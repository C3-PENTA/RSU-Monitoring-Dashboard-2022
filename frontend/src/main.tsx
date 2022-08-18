import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import './config/i18n';
import './index.scss';

/**
 * @note Since react 18 simulate immediately unmounting and remounting the component whenever a component mounts in strict mode,
 * it seems like a bug of the empty dependency useEffect which is execute effect twice, but its work fine on production.
 * You can run `npm run preview` to preview production build on local machine (see #Build section in README.md), or just disable react strict mode.
 *
 * ref:
 *      https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects
 *      https://reactjs.org/docs/strict-mode.html#ensuring-reusable-state
 */
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
