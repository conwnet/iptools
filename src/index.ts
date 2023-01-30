/**
 * @file app entry
 * @author netcon
 */

import Koa from 'koa';
import { getLocationInfoWithDNS } from './geoip';

const app = new Koa();
const first = (items: any[] | any) => Array.isArray(items) ? items[0] : items;

app.use(({ request, response }) => {
  const pathQuery = request.path.slice(1);
  const query = pathQuery || first(request.headers['x-real-ip']) || request.ip;

  return getLocationInfoWithDNS(query).then((locationInfo) => {
    response.body = !pathQuery && request.socket ? {
	...locationInfo,
        port: first(request.headers['x-real-port']) || request.socket.remotePort,
    } : locationInfo;
  }).catch((error) => {
    response.status = 400;
    response.body = {
      message: error.message,
    };
  });
});

app.listen(process.env.APP_PORT || 3000);
console.log(`app started at port ${process.env.APP_PORT || 3000}...`);
