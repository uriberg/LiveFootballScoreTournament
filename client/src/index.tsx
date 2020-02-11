import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose, combineReducers} from "redux";
import landingReducer from "./store/reducers/landing";
import tournamentReducer from './store/reducers/tournament';
import thunk from 'redux-thunk';
import * as serviceWorker from './serviceWorker';
import 'semantic-ui-css/semantic.min.css';

//making the redux dev tools(and easy look into our redux store) available only in dev mode
const composeEnhancers = (window && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const rootReducer = combineReducers({
    landing: landingReducer,
    tournament: tournamentReducer
});

const store = createStore(rootReducer, composeEnhancers(
    applyMiddleware(thunk)
));

ReactDOM.render(
    <Provider store={store}>
    <App />
    </Provider> , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
