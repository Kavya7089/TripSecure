// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract TouristRegistry is AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    struct Tourist {
        address wallet;
        bytes32 kycHash;   // Keccak256 hash of off-chain encrypted KYC
        uint256 validUntil; // unix timestamp
        bool active;
    }

    mapping(uint256 => Tourist) private tourists;
    mapping(address => uint256[]) private idsByAddress;
    uint256 public nextId;

    event TouristIssued(uint256 indexed id, address indexed wallet, bytes32 kycHash, uint256 validUntil, address issuer);
    event TouristRevoked(uint256 indexed id, address issuer);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ISSUER_ROLE, msg.sender);
        nextId = 1;
    }

    function issueTourist(address wallet, bytes32 kycHash, uint256 validUntil) external onlyRole(ISSUER_ROLE) returns (uint256) {
        require(wallet != address(0), "Invalid wallet");
        uint256 id = nextId++;
        tourists[id] = Tourist(wallet, kycHash, validUntil, true);
        idsByAddress[wallet].push(id);
        emit TouristIssued(id, wallet, kycHash, validUntil, msg.sender);
        return id;
    }

    function revokeTourist(uint256 id) external onlyRole(ISSUER_ROLE) {
        require(tourists[id].active, "Already inactive");
        tourists[id].active = false;
        emit TouristRevoked(id, msg.sender);
    }

    function getTourist(uint256 id) external view returns (address wallet, bytes32 kycHash, uint256 validUntil, bool active) {
        Tourist storage t = tourists[id];
        return (t.wallet, t.kycHash, t.validUntil, t.active);
    }

    function verifyTourist(uint256 id, bytes32 kycHash) external view returns (bool) {
        Tourist storage t = tourists[id];
        return t.active && t.kycHash == kycHash && block.timestamp <= t.validUntil;
    }

    // Admin helper
    function grantIssuerRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ISSUER_ROLE, account);
    }
}
