import { JSX, useContext } from "solid-js";

import { AuthService } from '../../services/auth.service';
import { DIContextProvider } from '../../services/context-provider';

import style from './navbar.module.css';

export default function(): JSX.Element {
  const auth: AuthService = useContext(DIContextProvider)!.resolve(AuthService);

  const logout = (): void => {
    auth.logout();
  }

  return <>
    <div id='navbar' class={style.navbar}>
      <div class={style.profileSection}>
        <div class={style.profile}>
            <img src="" />
            <p>Kukk Regenye Szűcs</p>
        </div>
        <button class={style.btnLogout} onClick={logout}>
            Kijelentkezés
        </button>
      </div>

      <div class={style.menuSection}>
        <button>A fáid</button>
        <button>Új fa létrehozása</button>
      </div>
    </div>
  </>;
};
