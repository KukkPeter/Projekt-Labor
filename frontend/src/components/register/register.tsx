import { createSignal, JSX } from "solid-js";
import style from './register.module.css';

export default function(): JSX.Element {
  const [username, setUsername] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [email, setEmail] = createSignal("");

  const handleSubmit = (e:any) => {
    e.preventDefault();
    // Itt kezelheti a bejelentkezési logikát
    console.log("Bejelentkezési kísérlet:", username(), email(), password());
  };

  return (
    <div class={style['login-container']}>
      <div class={style['login-form']}>
        <h2 class={style['login-title']}>Regisztrácó</h2>
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
    </div>
  );
};

