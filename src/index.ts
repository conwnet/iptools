/**
 * @file app entry
 * @author netcon
 */

import Koa from 'koa';
import { getLocationInfoWithDNS } from './geoip';

const app = new Koa();

app.use(({ request, response }) => {
  const query = request.path.slice(1) || request.ip;

  return getLocationInfoWithDNS(query).then((locationInfo) => {
    response.body = locationInfo;
  }).catch((error) => {
    response.status = 400;
    response.body = {
      message: error.message,
    };
  });
});

app.listen(process.env.APP_PORT || 3000);
console.log(`app started at port ${process.env.APP_PORT || 3000}...`);
