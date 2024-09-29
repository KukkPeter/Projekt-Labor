import { createSignal, JSX, useContext } from "solid-js";
import style from './register.module.css';
import { AuthService } from "../../services/auth.service";
import { DIContextProvider } from "../../services/context-provider";

export default function(props: { goToLogin: any }): JSX.Element {
  const auth: AuthService = useContext(DIContextProvider)!.resolve(AuthService);
  
  const [username, setUsername] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const handleSubmit = (e:any) => {
    e.preventDefault();
    auth.register(username(), email(), password());
  };

  return (
    <div class={style['register-container']}>
      <div class={style['register-form']}>
        <h2 class={style['register-title']}>Regisztrácó</h2>
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
            <label for="email" class={style['form-label']}>
              E-mail cím
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
            Regisztráció
          </button>
        </form>
      </div>
      <button class={style['redirect-button']} onClick={props.goToLogin}>Vissza a bejelentkezéshez</button>
    </div>
  );
};

