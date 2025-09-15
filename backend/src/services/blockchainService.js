// backend/services/blockchainService.js
const { ethers, JsonRpcProvider } = require("ethers");
require("dotenv").config();

const registryAbi = require("../../../blockchain/artifacts/contracts/TouristRegistry.sol/TouristRegistry.json").abi;
const incidentAbi = require("../../../blockchain/artifacts/contracts/IncidentLog.sol/IncidentLog.json").abi;

const provider = new JsonRpcProvider(process.env.RPC_URL || "http://127.0.0.1:8545");
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
if (!process.env.REGISTRY_ADDRESS || !process.env.INCIDENT_ADDRESS) {
  throw new Error("Missing contract addresses in .env file (REGISTRY_ADDRESS / INCIDENT_ADDRESS)");
}

const registry = new ethers.Contract(process.env.REGISTRY_ADDRESS, registryAbi, signer);
const incident = new ethers.Contract(process.env.INCIDENT_ADDRESS, incidentAbi, signer);

// helper: compute kyc hash from encrypted KYC JSON
function computeKycHash(encryptedKycJson) {
  return ethers.utils.keccak256(ethers.utils.toUtf8Bytes(JSON.stringify(encryptedKycJson)));
}

async function issueTourist(walletAddr, encryptedKycJson, validUntilUnix) {
  const kycHash = computeKycHash(encryptedKycJson);
  const tx = await registry.issueTourist(walletAddr, kycHash, validUntilUnix);
  const receipt = await tx.wait();
  const event = receipt.events.find(e => e.event === "TouristIssued");
  return event.args[0].toNumber(); // id
}

async function logIncident(touristId, locationCid, evidenceCid, descriptionCid) {
  const tx = await incident.logIncident(touristId, locationCid, evidenceCid, descriptionCid);
  const receipt = await tx.wait();
  const event = receipt.events.find(e => e.event === "IncidentLogged");
  return event.args[0].toNumber(); // incident id
}

module.exports = {
  issueTourist, logIncident, computeKycHash, registry, incident
};
