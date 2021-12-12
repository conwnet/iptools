/**
 * @file maxmind query city
 * @author netcon
 */

import path from 'path';
import maxmind, { CityResponse } from 'maxmind';
import dns from 'dns';

const mmdb = maxmind.open<CityResponse>(path.join(__dirname, './GeoLite2-City.mmdb'));

export const getCityResponse = (ip: string): Promise<CityResponse | null> => {
  if (!maxmind.validate(ip)) {
    throw new Error('Invalid IP');
  }
  return mmdb.then(lookup => lookup.get(ip));
};

export const getLocationInfo = (ip: string) => {
  return getCityResponse(ip).then(cityResponse => {
    if (!cityResponse) {
      return { ip };
    }

    const address = [
      cityResponse.continent?.names?.en,
      cityResponse.country?.names.en,
      cityResponse.city?.names.en,
    ].filter(Boolean).join(' - ');
    const addressCN = [
      cityResponse.continent?.names?.['zh-CN'],
      cityResponse.country?.names?.['zh-CN'],
      cityResponse.city?.names?.['zh-CN'],
    ].filter(Boolean).join(' - ');

    return {
      ip,
      address,
      addressCN,
      location: cityResponse.location as any,
    };
  })
};

export const getLocationInfoWithDNS = (ipOrDomain: string): Promise<ReturnType<typeof getLocationInfo>> => {
  return new Promise((resolve, reject) => dns.lookup(ipOrDomain, (error, address) => {
    return error ? reject(error) : resolve(getLocationInfo(address));
  }));
};
