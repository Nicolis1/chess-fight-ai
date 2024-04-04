import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';

import { Provider } from 'react-redux';
import dataStore from './data/stores/dataStore.ts';

import 'simple-line-icons/css/simple-line-icons.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Provider store={dataStore}>
		<React.StrictMode>
			<App />
		</React.StrictMode>
	</Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
