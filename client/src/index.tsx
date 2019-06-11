import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import reduxThunk, { ThunkMiddleware } from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';
import { IRootState } from './types';
import { IActions } from './actions';

const windowIfDefined = typeof window === 'undefined' ? null : (window as any);
const composeEnhancers = windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore<IRootState, IActions, {}, {}>(
  reducers,
  composeEnhancers(applyMiddleware(reduxThunk as ThunkMiddleware<IRootState, IActions>))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
);
