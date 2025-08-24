const {ethers,deployment} = require("hardhat");

describe("Starting", async function () {
    it("Should create a new auction", async function () {
        const NFTAuction = await ethers.getContractFactory("NFTAuction");
        const contract = await NFTAuction.deploy();
        await contract.waitForDeployment();

        await contract.createAuction(
            10*1000,
            ethers.parseEther("0.0000000000000001"),
            ethers.ZeroAddress,
            1
        );
        const auctionDetails = await contract.auctions(0);
        console.log("Auction Details:", auctionDetails);
    });
});