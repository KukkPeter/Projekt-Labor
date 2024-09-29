import { JSX, useContext } from "solid-js";

import { AuthService } from '../../services/auth.service';
import { DIContextProvider } from '../../services/context-provider';

export default function(): JSX.Element {
  const auth: AuthService = useContext(DIContextProvider)!.resolve(AuthService);

  const logout = (): void => {
    auth.logout();
  }

  return <>
    <div id='home'>
        <h1>HELLO WORLD!</h1>
        <button onClick={logout}>LOGOUT</button>
    </div>
  </>;
};
