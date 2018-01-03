import React from 'react';
import { createStore } from 'redux';

import ACTIONS from './../actions';
import reducer from './../reducer';

import Header from './Header';
import CurrencyTable from './CurrencyTable';
import About from './About';
import Credits from './Credits';
import Donations from './Donations';
import LegalNotice from './LegalNotice';

import exchange from './../exchange';

const INITIAL_STATE = {
    updateProgress: 0,
    updateInProgress: false,
    results: [],
    total: 0,
    autoUpdate: false,
    autoUpdateInterval: 30,
    currencies: [],
    validConfig: false,
    validationError: ''
};

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.autoUpdateInterval = undefined;

        this.store = createStore(reducer, INITIAL_STATE);
		this.store.subscribe(() => {
		    this.render();
		    this.checkAutoUpdate();
		    this.updateHeadTitle();
		});

		exchange.setStore(this.store);

		this.parseQueryParameter();
    }

    saveConfiguration() {
        const { currencies, autoUpdate, autoUpdateInterval } = this.store.getState();
        const queryParameter = `currencies=${JSON.stringify(currencies)}&autoUpdate=${autoUpdate}&autoUpdateInterval=${autoUpdateInterval}`;

        window.location.search = `?${queryParameter}`;
    }

    parseQueryParameter() {
        const data = {};

        window.location.search.substr(1).split('&').forEach(pair => {
            const splitPair = pair.split('=');

            if (splitPair.length === 2) {
                data[splitPair[0]] = decodeURIComponent(splitPair[1]);
            }
        });

        if (data.currencies) {
            const isValid = exchange.validate(data.currencies);

            if (isValid) {
                exchange.update();
            }
        }

        if (data.autoUpdateInterval) {
            const parsedAutoUpdateInterval = Number(data.autoUpdateInterval);

            if (parsedAutoUpdateInterval < 15) {
                data.autoUpdate = false;

                this.store.dispatch({
                    type: ACTIONS.CONFIG_VALIDATION, validConfig: false,
                    validationError: `Invalid config value for autoUpdateInterval found (${parsedAutoUpdateInterval}).
                        It has to be greater or equal than 15`
                });
            }
            else {
                this.store.dispatch({
                    type: ACTIONS.CHANGE_AUTO_UPDATE_INTERVAL,
                    autoUpdateInterval: Number(data.autoUpdateInterval)
                });
            }
        }

        if (data.autoUpdate) {
            this.store.dispatch({
                type: ACTIONS.SET_AUTO_UPDATE,
                autoUpdate: data.autoUpdate === 'true' ? true : false
            });
        }
    }

    render() {
        return (
            <div>
                <Header store={this.store} saveConfiguration={() => this.saveConfiguration()} />
                <CurrencyTable store={this.store} />
                <About />
                <Credits />
                <Donations />
                <LegalNotice />
            </div>
        );
    }

    checkAutoUpdate() {
        const state = this.store.getState();
        const isEnabled = state.autoUpdate;
        const interval = state.autoUpdateInterval;
        const isRunning = this.autoUpdateInterval;

        if (isEnabled && !isRunning) {
            this.autoUpdateInterval = setInterval(() => exchange.update(), interval * 1000);
        }

        if (!isEnabled && isRunning) {
            clearInterval(this.autoUpdateInterval);
            this.autoUpdateInterval = undefined;
        }
    }

    updateHeadTitle() {
        document.title = this.store.getState().total.toFixed(2);
    }
}