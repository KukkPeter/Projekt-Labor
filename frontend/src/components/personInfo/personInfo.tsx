import { Pages } from "../../interfaces/pages.interface";
import {createSignal, JSX, Match, Switch} from "solid-js";

import style from './personInfo.module.css';

export default function(): JSX.Element {
  const [menu, setMenu] = createSignal('Personal');

  const addRelative = (): void => {
    console.debug('TODO: addRelative');
  }

  return <>
    <div class={style.personInfo}>
      <h3>Selected Person: <span>John Doe</span></h3>
      <div class={style.menu}>
        <button class={menu() !== 'Personal' ? style.unselected : ''} onClick={(): void => { setMenu('Personal'); }}>
          Personal
        </button>
        <button class={menu() !== 'Biography' ? style.unselected : ''} onClick={(): void => { setMenu('Biography'); }}>
          Biography
        </button>
      </div>
      <Switch>
        <Match when={menu() === 'Personal'}>
          <div class={style.content}>
            <p>
              <strong>Full Name:</strong> John Doe
            </p>
            <p>
              <strong>Gender:</strong> Male
            </p>
            <p>
              <strong>Birth place:</strong> Veszprém
            </p>
            <p>
              <strong>Birth date:</strong> 2006.09.15
            </p>
          </div>
        </Match>
        <Match when={menu() === 'Biography'}>
          <div class={style.content}>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent vitae eros ut justo venenatis imperdiet ac vel turpis. Donec aliquet semper mattis. Phasellus tincidunt nulla in efficitur consectetur.
            </p>
          </div>
        </Match>
      </Switch>
      <button onClick={addRelative}>Add a relative</button>
    </div>
  </>;
}