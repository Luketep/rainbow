import React from 'react';
import { connect } from 'react-redux';

import ACTIONS from './../actions';
import exchange from './../exchange';

class Header extends React.Component {
    constructor(props) {
        super(props);

        this.store = props.store;
        this.store.subscribe(() => this.render());

        exchange.setStore(this.store);
    }

    render() {
        const isLoading = this.props.updateInProgress;
        const isAutoUpdateEnabled = this.props.autoUpdate;
        const hasValidConfig = this.props.validConfig;
        const updateButtonDisabled = hasValidConfig ? false : true;
        const example = '[ { "token": "BTC", "amount": 1, "exchange": "CRYPTOCOMPARE" }, { "token": "ETH", "amount": 1, "exchange": "CRYPTOCOMPARE" } ]';
        const validationError = this.props.validationError.split('\n');

        let updateButtonClassNames = 'button is-black is-large';
        let autoUpdateButtonClassNames = 'fa fa-refresh';

        if (isLoading) {
            updateButtonClassNames += ' is-loading';
        }

        if (isAutoUpdateEnabled) {
            autoUpdateButtonClassNames += ' fa-spin';
        }

        return (
            <section className="hero is-dark">
                <div className="hero-body">
                    <div className="container">
                        <p className="title">
                            Rainbow
                        </p>
                        <p className="subtitle" id="loader">$ {this.props.total.toFixed(2)} USD</p>
                    </div>
                </div>
                <div className="container">
                    <p className="help is-small">
                        Supported exchanges: <a className="has-text-weight-bold" href="https://www.cryptocompare.com/">CryptoCompare</a>
                    </p>
                    <p className="help is-small">{example}</p>
                    <div className="control">
                        <textarea
                            className="textarea is-small"
                            type="text"
                            defaultValue={JSON.stringify(this.props.currencies)}
                            onBlur={(event) => exchange.validate(event.target.value)}
                        >
                        </textarea>
                    </div>
                    {
                        validationError.map((message, index) => (
                            <p className="help is-danger is-small" key={index}>{message}</p>
                        ))
                    }
                </div>
                <div className="buttons is-centered">
                    <button title="update" className={updateButtonClassNames} onClick={() => exchange.update()} disabled={updateButtonDisabled}>update</button>
                    <button title="toogle auto update" className="button is-large is-black" onClick={() => this.store.dispatch({ type: ACTIONS.TOGGLE_AUTO_UPDATE })}  disabled={updateButtonDisabled}>
                        <span className="icon">
                            <i className={autoUpdateButtonClassNames}></i>
                        </span>
                    </button>
                    <button title="save config to url" className="button is-large is-black" onClick={this.props.saveConfiguration} disabled={updateButtonDisabled}>
                        <span className="icon">
                            <i className="fa fa-floppy-o"></i>
                        </span>
                    </button>
                </div>
                <progress className="progress" value={this.props.updateProgress} max="100">{this.props.updateProgress}%</progress>
            </section>
        );
    }
}

const mapStateToProps =
    ({ total, updateProgress, autoUpdate, updateInProgress, validConfig, validationError, currencies }) =>
    ({ total, updateProgress, autoUpdate, updateInProgress, validConfig, validationError, currencies });

export default connect(mapStateToProps)(Header);