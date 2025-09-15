const { create } = require('ipfs-http-client');
const { ipfs } = require('../config');

let client;
function getClient() {
  if (client) return client;
  if (!ipfs.projectId) {
    client = create({ host: ipfs.host, port: ipfs.port, protocol: ipfs.protocol });
  } else {
    const auth = 'Basic ' + Buffer.from(ipfs.projectId + ':' + ipfs.projectSecret).toString('base64');
    client = create({ host: ipfs.host, port: ipfs.port, protocol: ipfs.protocol, headers: { authorization: auth } });
  }
  return client;
}

async function uploadJSON(obj) {
  const client = getClient();
  const data = JSON.stringify(obj);
  const { cid } = await client.add(data);
  return cid.toString();
}

async function uploadBuffer(buffer) {
  const client = getClient();
  const { cid } = await client.add(buffer);
  return cid.toString();
}

module.exports = { uploadJSON, uploadBuffer };
