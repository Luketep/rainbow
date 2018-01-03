import React from 'react';
import { connect } from 'react-redux';

import CurrencyRow from './CurrencyRow';

class CurrencyTable extends React.Component {
    constructor(props) {
        super(props);

        this.store = props.store;
        this.store.subscribe(() => this.render());
    }

    render() {
        const sortedResults = this.props.results.sort((coinA, coinB) => (
            coinB.total - coinA.total
        ));
        let sectionClassName = 'section';

        if (sortedResults.length === 0) {
            sectionClassName += ' is-hidden';
        }

        return (
            <section className={sectionClassName}>
                <table className="table container">
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Amount</th>
                            <th>Single Value</th>
                            <th>Total Value</th>
                        </tr>
                    </thead>
                    <tbody className="currencyBody">
                        {
                           sortedResults.map((result, index) => {
                                return (
                                <CurrencyRow
                                    key={index.toString()}
                                    token={result.token}
                                    amount={result.amount}
                                    single={result.price}
                                    total={result.total.toFixed(2)}
                                />
                            )})
                        }
                    </tbody>
                </table>
            </section>
        );
    }
}

const mapStateToProps = ({ results }) => ({ results });

export default connect(mapStateToProps)(CurrencyTable);