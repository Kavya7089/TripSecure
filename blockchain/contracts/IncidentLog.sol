// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

interface ITouristRegistry {
    function getTourist(uint256 id) external view returns (address wallet, bytes32 kycHash, uint256 validUntil, bool active);
}

contract IncidentLog is AccessControl {
    bytes32 public constant LOGGER_ROLE = keccak256("LOGGER_ROLE");
    ITouristRegistry public registry;

    struct Incident {
        uint256 id;
        uint256 touristId;
        uint256 timestamp;
        string locationCid;    // IPFS CID or encrypted location reference
        string evidenceCid;    // IPFS CID for photos/audio (encrypted)
        string descriptionCid; // IPFS CID of encrypted description/meta
        address reporter;
    }

    mapping(uint256 => Incident) public incidents;
    uint256 public incidentCount;

    event IncidentLogged(uint256 indexed id, uint256 indexed touristId, address indexed reporter, uint256 timestamp);

    constructor(address registryAddress) {
        registry = ITouristRegistry(registryAddress);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(LOGGER_ROLE, msg.sender);
    }

    function logIncident(uint256 touristId, string memory locationCid, string memory evidenceCid, string memory descriptionCid) external onlyRole(LOGGER_ROLE) returns (uint256) {
        // verify tourist exists & active via registry
        (, , , bool active) = registry.getTourist(touristId);
        require(active, "Tourist not active / does not exist");

        incidentCount++;
        incidents[incidentCount] = Incident(incidentCount, touristId, block.timestamp, locationCid, evidenceCid, descriptionCid, msg.sender);
        emit IncidentLogged(incidentCount, touristId, msg.sender, block.timestamp);
        return incidentCount;
    }

    function getIncident(uint256 id) external view returns (uint256 touristId, uint256 timestamp, string memory locationCid, string memory evidenceCid, string memory descriptionCid, address reporter) {
        Incident storage inc = incidents[id];
        return (inc.touristId, inc.timestamp, inc.locationCid, inc.evidenceCid, inc.descriptionCid, inc.reporter);
    }
}
