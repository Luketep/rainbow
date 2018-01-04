import ACTIONS from './actions';

import cryptoCompareService from './exchanges/cryptoCompareService';
import cryptoCompareParser from './exchanges/cryptoCompareParser';
import coinMarketCapService from './exchanges/coinMarketCapService';
import coinMarketCapParser from './exchanges/coinMarketCapParser';

const EXCHANGES = {
    CRYPTOCOMPARE: { PARSER: cryptoCompareParser, SERVICE: cryptoCompareService },
    COINMARKETCAP: { PARSER: coinMarketCapParser, SERVICE: coinMarketCapService }
};

export default {
    setStore(store) {
        this.store = store;
    },
    validate(config) {
        try {
            const currencies = JSON.parse(config);
            const errors = [];
            const validExchanges = Object.keys(EXCHANGES);

            currencies.forEach((item, index) => {
                if (!item.token || typeof item.token !== 'string' || item.token.length === 0) {
                    errors.push(`Entry #${index + 1} ${JSON.stringify(item)} has an invalid or missing TOKEN`);
                }

                if (!item.amount || typeof item.amount !== 'number' || isNaN(item.amount)) {
                    errors.push(`Entry #${index + 1} ${JSON.stringify(item)} has an invalid or missing AMOUNT`);
                }

                if (!item.exchange || typeof item.exchange !== 'string' || !validExchanges.includes(item.exchange.toUpperCase())) {
                    errors.push(`Entry #${index + 1} ${JSON.stringify(item)} has an invalid or missing EXCHANGE`);
                }
            });

            if (errors.length > 0) {
                throw Error(errors.join('\n'));
            }

            this.store.dispatch({ type: ACTIONS.CURRENCIES_UPDATE, currencies });
            this.store.dispatch({ type: ACTIONS.CONFIG_VALIDATION, validConfig: true, validationError: '' });

            return true;
        }
        catch (error) {
            console.log(error.message);
            this.store.dispatch({ type: ACTIONS.CONFIG_VALIDATION, validConfig: false, validationError: error.message });
            return false;
        }
    },
    update() {
        const state = this.store.getState();
        const currencies = state.currencies;
        const numOfCurrencies = currencies.length;
        const results = [];
        const isUpdateInProgress = state.updateInProgress;
        const hasValidConfig = state.validConfig;
        let resolvedCurrencies = 0;
        let total = 0;

        if (isUpdateInProgress || !hasValidConfig) {
            return;
        }

        this.store.dispatch({
            type: ACTIONS.RESET_PROGRESS
        });

        currencies.forEach(currency => {
            const amount = currency.amount;
            const token = currency.token.toUpperCase();
            const exchange = currency.exchange.toUpperCase();

            EXCHANGES[exchange].SERVICE.fetch(token)
                .then(data => {
                    const price = EXCHANGES[exchange].PARSER.getUSD(data);

                    total += price * amount;
                    resolvedCurrencies++;

                    results.push({ token, price, amount, total: price * amount });

                    this.store.dispatch({
                        type: ACTIONS.UPDATE_PROGRESS,
                        progress: ((resolvedCurrencies / numOfCurrencies) * 100).toFixed(0)
                    });

                    if (resolvedCurrencies === numOfCurrencies) {
                        this.store.dispatch({
                            type: ACTIONS.UPDATE_COMPLETE,
                            total,
                            results
                        });
                    }
                });
        });
    }
};

