const {deployments,upgrades} = require("hardhat");
const path = require("path");
const fs = require("fs");
module.exports = async ({getNamedAccounts,deployments}) => {
    const {save} = deployments;
    const {deployer} = await getNamedAccounts();
    console.log("部署用户地址:", deployer);
    const NFTAuction = await ethers.getContractFactory("NFTAuction");
    // 通过代理合约部署
    const nftAuctionProxy = await upgrades.deployProxy(NFTAuction, [
       
    ], {initializer: 'initialize'});
    await nftAuctionProxy.waitForDeployment();
    const proxyAddress = await nftAuctionProxy.getAddress();
    console.log("代理合约地址:", proxyAddress);
    const implAddress = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log("实现合约地址:", implAddress);

    // 保存部署信息
    const storePath = path.resolve(__dirname, './.cache/proxyNFTAuction.json');
    fs.writeFileSync(storePath, JSON.stringify({
        proxyAddress,
        implAddress,
        abi: NFTAuction.interface.format('json'),
    }));
    await save("NFTAuctionProxy", {
        abi: NFTAuction.interface.format('json'),
        address: proxyAddress,
        //args: [],
        //log: true
    }); 
    // await deploy("NFTAuction", {
    //     from: deployer,
    //     args: ["Hello"],
    //     log: true,
    // });
};
module.exports.tags = ["deployNFTAuction"];