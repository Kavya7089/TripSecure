const hre = require("hardhat");

async function main() {
  const TouristRegistry = await hre.ethers.getContractFactory("TouristRegistry");
  const registry = await TouristRegistry.deploy();
  await registry.deployed();
  console.log("TouristRegistry deployed to:", registry.address);

  const IncidentLog = await hre.ethers.getContractFactory("IncidentLog");
  const incident = await IncidentLog.deploy(registry.address);
  await incident.deployed();
  console.log("IncidentLog deployed to:", incident.address);

  // optionally grant roles to other accounts (demo)
  const [deployer, issuer, logger] = await hre.ethers.getSigners();
  await registry.grantIssuerRole(issuer.address); // only owner allowed
  await incident.grantRole(ethers.utils.id("LOGGER_ROLE"), logger.address);
  console.log("Roles configured (demo).");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
