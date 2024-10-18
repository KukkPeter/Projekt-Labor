import { createSignal, JSX, useContext } from "solid-js";

import style from './login.module.css';

import { AuthService } from "../../services/auth.service";
import { DIContextProvider } from "../../services/context-provider";

export default function(props: { goToRegister: any }): JSX.Element {
  const auth: AuthService = useContext(DIContextProvider)!.resolve(AuthService);

  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const handleSubmit = (e:any) => {
    e.preventDefault();

    auth.login(email(), password());
  };

  return (
    <div class={style['login-container']}>
      <div class={style['login-form']}>
        <h2 class={style['login-title']}>Authenticate</h2>
        <form onSubmit={handleSubmit}>
          <div class={style['form-group']}>
            <label for="email" class={style['form-label']}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email()}
              onInput={(e) => setEmail(e.target.value)}
              class={style['form-input']}
              required
            />
          </div>
          <div class={style['form-group']}>
            <label for="password" class={style['form-label']}>
              Password
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
            Login
          </button>
        </form>
      </div>
      <button class={style['redirect-button']} onClick={props.goToRegister}>Go to register</button>
    </div>
  );
};

