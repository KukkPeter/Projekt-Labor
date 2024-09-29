import { createSignal, JSX, useContext } from "solid-js";

import style from './login.module.css';

import { AuthService } from "../../services/auth.service";
import { DIContextProvider } from "../../services/context-provider";

export default function(props: { goToRegister: any }): JSX.Element {
  const auth: AuthService = useContext(DIContextProvider)!.resolve(AuthService);

  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");

  const handleSubmit = (e:any) => {
    e.preventDefault();

    auth.login(username(), password());
  };

  return (
    <div class={style['login-container']}>
      <div class={style['login-form']}>
        <h2 class={style['login-title']}>Bejelentkezés</h2>
        <form onSubmit={handleSubmit}>
          <div class={style['form-group']}>
            <label for="username" class={style['form-label']}>
              Felhasználónév
            </label>
            <input
              type="text"
              id="username"
              value={username()}
              onInput={(e) => setUsername(e.target.value)}
              class={style['form-input']}
              required
            />
          </div>
          <div class={style['form-group']}>
            <label for="password" class={style['form-label']}>
              Jelszó
            </label>
            <input
              type="password"
              id="password"
              value={password()}
              onInput={(e) => setPassword(e.target.value)}
              class={style['form-input']}
              required
            />
          </div>
          <button type="submit" class={style['submit-button']}>
            Bejelentkezés
          </button>
        </form>
      </div>
      <button class={style['redirect-button']} onClick={props.goToRegister}>Itt tudsz regisztrálni</button>
    </div>
  );
};

