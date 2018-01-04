const CACHE_LIFETIME = 30 * 1000;
let lastFetch = undefined;
let cachedData = undefined;

const getCache = () => cachedData;
const setCache = data => cachedData = data;
const setLastFetch = () => lastFetch = Date.now;
const findToken = (data, token) => data.find(coin => coin.symbol === token)
const isCacheExpired = () => lastFetch + CACHE_LIFETIME < Date.now;

export default {
    fetch(token) {
        const cache = getCache();

        if (cache && !isCacheExpired()) {
            return Promise.resolve(findToken(cache, token));
        }

        return fetch('https://api.coinmarketcap.com/v1/ticker/')
            .then(response => response.json())
            .then(setCache)
            .then(setLastFetch)
            .then(() => findToken(getCache(), token));
    }
}