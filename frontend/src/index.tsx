/* @refresh reload */
import 'reflect-metadata';
import { render } from 'solid-js/web';
import { container } from 'tsyringe';

import { DIContextProvider } from './services/context-provider';
import App from './components/app/app';

import './index.css';

const root = document.getElementById('root');

if (!(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

const appContainer = container.createChildContainer();

render(() => <>
  <DIContextProvider.Provider value={appContainer}>
    <App />
  </DIContextProvider.Provider>
</>,
root!);

