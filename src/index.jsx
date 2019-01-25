// Please, feel free to use JavaScript instead TypeScript

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { Switch } from 'react-router';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import App from './containers/App';
import appReducer from './reducers';
import rootSaga from './sagas';

const composeEnchancers = process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
	? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
	: compose;
const sagaMiddleware = createSagaMiddleware();
const enchancers = composeEnchancers(
	applyMiddleware(sagaMiddleware)
);
const store = createStore(
	appReducer,
	enchancers
);

sagaMiddleware.run(rootSaga);

ReactDOM.render(
	<Provider store={store}>
		<Router>
			<Switch>
				<Route exact path="/" component={App} />
				<Route path="/:resource/:id" component={App} />
			</Switch>
		</Router>
	</Provider>,
	document.getElementById('root')
);
