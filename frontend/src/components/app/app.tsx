import {Accessor, from, Show, useContext, type JSX } from 'solid-js';

import Auth from '../../pages/auth/auth';

import Home from '../../pages/home/home';

import { DIContextProvider } from '../../services/context-provider';
import { AuthService } from '../../services/auth.service';

export default function(): JSX.Element {
  const auth: AuthService = useContext(DIContextProvider)!.resolve(AuthService);

  const authenticated: Accessor<boolean | undefined> = from(auth.authenticated$);

  return <>
    <Show when={authenticated()} fallback={<Auth />}>
      <Home />
    </Show>
  </>;
};
