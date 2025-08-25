// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
contract NFTAuctionV2 is Initializable {
    // 结构体
    struct Auction {
        address seller; // 卖家
        address nftAddress; // NFT合约地址
        uint256 tokenId; // NFT的Token ID  
        uint256 startPrice; // 起始出价
        address highestBidder; // 最高出价者
        uint256 highestBid; // 最高出价
        uint256 startTime; // 开始时间
        uint256 endTime; // 结束时间
        bool ended; // 是否结束
        uint duration; // 拍卖持续时间
    }
    // 状态变量
    mapping(uint256 => Auction) public auctions; // 拍卖列表
    // 下一个拍卖ID
    uint256 public nextAuctionId;
    // 管理员地址
    address public admin;
    // 合约升级需要注释原来的构造，用initialize函数代替
    // constructor() {
    //     admin = msg.sender;
    // }
    //初始化函数
    function initialize() initializer public {
        admin = msg.sender;
    }
    // 创建拍卖
    function createAuction(
        uint256 _duration ,
        uint256 _startPrice,     
        address _nftAddress,
        uint256 _tokenId  
    ) external {
        //require(msg.sender == admin, "Only admin can create auctions");
        require(_duration > 1000, "Duration must be greater than 10s");
        require(_startPrice > 0, "Start price must be greater than 0");
        // 创建新的拍卖
        Auction memory newAuction = Auction({
            seller: msg.sender,
            nftAddress: _nftAddress,
            tokenId: _tokenId,
            startPrice: _startPrice,
            highestBidder: address(0),
            highestBid: 0,
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            ended: false,
            duration: _duration
        });

        auctions[nextAuctionId] = newAuction;
        nextAuctionId++;
    }   
    // 出价-买家参与
    function placeBid(uint256 _auctionId) external payable {
        Auction storage auction = auctions[_auctionId];
        // 判断当前拍卖是否结束
        require(!auction.ended && (auction.startTime + auction.duration) > block.timestamp, "Auction ended");
        // 判断出价是否高于当前最高出价
        require(msg.value > auction.highestBid && msg.value >= auction.startPrice, "There already is a higher bid");
        // 退还之前的最高出价
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        // 更新最高出价和最高出价者
        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;
    }
    // 3.拍卖结束
    function endAuction(uint256 _auctionId) external {
        Auction storage auction = auctions[_auctionId];
        // 判断当前拍卖是否结束
        require(!auction.ended && (auction.startTime + auction.duration) < block.timestamp, "Auction not ended");
        auction.ended = true;

        // 如果有出价，转移NFT给最高出价者
        if (auction.highestBidder != address(0)) {
            // 转移NFT
            // 这里需要调用NFT合约的转移函数
        }
    }
    // 升级函数
    function testHello() external pure returns (string memory) {
        return "Hello, World!";
    }
}