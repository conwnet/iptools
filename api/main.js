/**
 * @file vercel api main
 * @author netcon
 */

const URL = require('url');
const { getLocationInfoWithDNS } = require('./dist/geoip');

module.exports = async (req, res) => {
  const urlObj = URL.parse(req.url, true);
  const query = urlObj.pathname.slice(1) || req.headers['x-real-ip'] || req.socket.remoteAddress;

  res.setHeader('Content-Type', 'application/json');
  return getLocationInfoWithDNS(query).then(locationInfo => {
    res.status(200);
    res.send(JSON.stringify(locationInfo, null, 2));
  }).catch(error => {
    res.status(400);
    res.send(JSON.stringify({ message: error.message }, null, 2));
  });
};
