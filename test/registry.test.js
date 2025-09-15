const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Registry + IncidentLog", function() {
  let registry, incident, owner, issuer, logger, tourist;

  beforeEach(async function() {
    [owner, issuer, logger, tourist] = await ethers.getSigners();
    const Registry = await ethers.getContractFactory("TouristRegistry");
    registry = await Registry.deploy();
    await registry.deployed();

    const Incident = await ethers.getContractFactory("IncidentLog");
    incident = await Incident.deploy(registry.address);
    await incident.deployed();

    // grant roles
    await registry.grantIssuerRole(issuer.address);
    await incident.grantRole(ethers.utils.id("LOGGER_ROLE"), logger.address);
  });

  it("issue -> verify -> revoke tourist", async function() {
    const kycHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("encrypted-kyc-sample"));
    const validUntil = Math.floor(Date.now() / 1000) + 3600;
    const tx = await registry.connect(issuer).issueTourist(tourist.address, kycHash, validUntil);
    const receipt = await tx.wait();
    const event = receipt.events.find(e => e.event === "TouristIssued");
    const id = event.args[0];

    const info = await registry.getTourist(id);
    expect(info[0]).to.equal(tourist.address);

    await registry.connect(issuer).revokeTourist(id);
    const info2 = await registry.getTourist(id);
    expect(info2[3]).to.equal(false);
  });

  it("log incident for active tourist", async function() {
    const kycHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("encrypted-kyc-sample"));
    const validUntil = Math.floor(Date.now() / 1000) + 3600;
    const tx = await registry.connect(issuer).issueTourist(tourist.address, kycHash, validUntil);
    const id = (await tx.wait()).events[0].args[0];

    const res = await incident.connect(logger).logIncident(id, "QmLocCid", "QmEvidenceCid", "QmDescCid");
    const rec = await res.wait();
    expect(rec.events.some(e => e.event === "IncidentLogged")).to.be.true;
  });
});
