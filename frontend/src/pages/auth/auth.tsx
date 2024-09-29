import { createSignal, JSX, Switch, Match, useContext } from "solid-js";

import { AuthService } from '../../services/auth.service';
import { DIContextProvider } from '../../services/context-provider';

import Login from "../../components/login/login";
import Register from "../../components/register/register";

export default function(): JSX.Element {
  const auth: AuthService = useContext(DIContextProvider)!.resolve(AuthService);
  
  const [page, setPage] = createSignal('login');

  return <>
    <div id='authentication'>
      <Switch>
        <Match when={page() === 'login'}>
          <Login goToRegister={(): void => { setPage('register'); }} />
        </Match>
        <Match when={page() === 'register'}>
          <Register goToLogin={(): void => { setPage('login'); }} />
        </Match>
      </Switch>
    </div>
  </>;
};
