import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App';

window.addEventListener('load', () => {
    ReactDOM.render(<App />, document.querySelector('#app'));
});