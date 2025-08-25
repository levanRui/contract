const {ethers,deployments, upgrades} = require("hardhat");
const {expect} = require("chai");

// describe("Starting", async function () {
//     it("Should create a new auction", async function () {
//         const NFTAuction = await ethers.getContractFactory("NFTAuction");
//         const contract = await NFTAuction.deploy();
//         await contract.waitForDeployment();

//         await contract.createAuction(
//             10*1000,
//             ethers.parseEther("0.0000000000000001"),
//             ethers.ZeroAddress,
//             1
//         );
//         const auctionDetails = await contract.auctions(0);
//         console.log("Auction Details:", auctionDetails);
//     });
// });

describe("Test upgrade", function () {
    it("Should create a new auction", async function () {
        // 1.部署业务合约
        await deployments.fixture(["deployNFTAuction"]);
        const nftAuctionProxy = await deployments.get("NFTAuctionProxy");
        // 2.调用createAuction 方法创建拍卖
        const nftAuction = await ethers.getContractAt("NFTAuction", nftAuctionProxy.address);
        await nftAuction.createAuction(
            10*1000,
            ethers.parseEther("0.01"),
            ethers.ZeroAddress,
            1
        );
        const auction = await nftAuction.auctions(0);
        console.log("创建拍卖成功：", auction);

        const implAddress1 = await upgrades.erc1967.getImplementationAddress(nftAuctionProxy.address);
        console.log("升级前实现合约地址:", implAddress1);
        // 3.升级合约
        await deployments.fixture(["upgradeNFTAuction"]);

        const implAddress2 = await upgrades.erc1967.getImplementationAddress(nftAuctionProxy.address);
        console.log("升级后实现合约地址:", implAddress2);
        // 4.读取合约  auctions(0）
        const auction2 = await nftAuction.auctions(0);
        console.log("升级后拍卖信息：", auction2);
        expect(auction2.startTime).to.equal(auction.startTime);


        // 5.测试升级合约内容 
        const nftAuctionV2 = await ethers.getContractAt("NFTAuctionV2", nftAuctionProxy.address);
        const hello = await nftAuctionV2.testHello();
        console.log("升级后合约内容:", hello);
    });
});