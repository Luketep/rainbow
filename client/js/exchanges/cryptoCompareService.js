export default {
    fetch(token) {
        // https://min-api.cryptocompare.com/data/price?fsym=EMT&tsyms=USD
        return fetch(`https://min-api.cryptocompare.com/data/price?fsym=${token.toUpperCase()}&tsyms=USD`)
            .then(response => response.json());
    }
};