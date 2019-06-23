import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducer';

// copypasta from https://github.com/gatsbyjs/gatsby/issues/6137#issuecomment-422740799
const windowGlobal = typeof window !== 'undefined' && window

const devtools = process.env.NODE_ENV === 'development' && windowGlobal.devToolsExtension
  ? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  : f => f;

export default () => createStore(
  reducer,
  compose(
    applyMiddleware(thunk),
    devtools,
  ),
);
