const {ethers,upgrades} = require("hardhat");
const {save} = deployments;
const path = require("path");
const fs = require("fs");
module.exports = async ({getNamedAccounts,deployments}) => {
    const {deployer} = await getNamedAccounts();
    console.log("部署用户地址:", deployer);

    // 读取 .cache/proxyNFTAuction.json
    const storePath = path.resolve(__dirname, './.cache/proxyNFTAuction.json');
    const storeData = fs.readFileSync(storePath);
    const {proxyAddress,implAddress,abi} = JSON.parse(storeData);

    // 升级代理合约
    const NFTAuctionV2 = await ethers.getContractFactory("NFTAuctionV2");
    const nftAuctionV2Proxy = await upgrades.upgradeProxy(proxyAddress, NFTAuctionV2);
    await nftAuctionV2Proxy.waitForDeployment();
    const proxyAddressV2 = nftAuctionV2Proxy.getAddress();
    console.log("NFTAuctionV2代理合约地址:", proxyAddressV2);

    // 保存新的代理合约地址
    // fs.writeFileSync(storePath, JSON.stringify({
    //     proxyAddress: proxyAddressV2,
    //     implAddress: nftAuctionV2Proxy.implementation,
    //     abi: NFTAuctionV2.interface.format("json")
    // }));
    await save("NFTAuctionProxyV2",{
        proxyAddress: proxyAddressV2,
        implAddress: nftAuctionV2Proxy.implementation,
        abi: NFTAuctionV2.interface.format("json")
    });

};
module.exports.tags = ["upgradeNFTAuction"];