//require("@nomicfoundation/hardhat-toolbox");
// 加载环境变量
//require('dotenv').config();

// module.exports = {
//   solidity: "0.8.20",
//   networks: {
//     // 配置测试网（如Sepolia）
//     sepolia: {
//       url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
//       accounts: [process.env.PRIVATE_KEY] // 从环境变量获取私钥
//     }
//   }
// };

require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("@openzeppelin/hardhat-upgrades");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  namedAccounts:{
    deployer:0,
    user1:1,
    user2:2,
  }
};
