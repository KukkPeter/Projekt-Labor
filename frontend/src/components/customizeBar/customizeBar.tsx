import {JSX, useContext} from "solid-js";

import style from './customizeBar.module.css';

import { ApplicationService } from "../../services/application.service";
import { DIContextProvider } from "../../services/context-provider";

export default function(): JSX.Element {
  const app: ApplicationService = useContext(DIContextProvider)!.resolve(ApplicationService);

  const saveChanges = (): void => {
    if(confirm('Are you certain you want to save the changes?\nThis will replace the previous version!')) {
      // TODO
    }
  }

  const deleteTree = (): void => {
    if(confirm('Are you certain you want to remove this tree?\nThis action cannot be reversed!')) {
      // TODO
    }
  }

  return <>
    <div class={style.customizeBar}>
      <div class={style.optionsMenu}>
        <div class={style.title}>
          <h2>Customize display</h2>
        </div>
        <div class={style.options}>
          <label class={style.option}>
            <input
              type="checkbox"
              id="name"
              checked={true}
            />
            <p>Name</p>
          </label>
          <label class={style.option}>
            <input
              type="checkbox"
              id="nickname"
            />
            <p>Nickname</p>
          </label>
          <label class={style.option}>
            <input
              type="checkbox"
              id="age"
              checked={true}
            />
            <p>Age</p>
          </label>
          <label class={style.option}>
            <input
              type="checkbox"
              id="birth_date"
              checked={true}
            />
            <p>Birth date</p>
          </label>
          <label class={style.option}>
            <input
              type="checkbox"
              id="birth_place"
              checked={true}
            />
            <p>Birth place</p>
          </label>
          <label class={style.option}>
            <input
              type="checkbox"
              id="death_date"
            />
            <p>Death date</p>
          </label>
          <label class={style.option}>
            <input
              type="checkbox"
              id="death_place"
            />
            <p>Death place</p>
          </label>
        </div>
      </div>
      <hr/>
      <div class={style.actionsMenu}>
        <button onClick={(): void => {
          saveChanges();
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M48 96l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-245.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l245.5 0c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8L320 184c0 13.3-10.7 24-24 24l-192 0c-13.3 0-24-10.7-24-24L80 80 64 80c-8.8 0-16 7.2-16 16zm80-16l0 80 144 0 0-80L128 80zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"></path>
          </svg>
          <p>Save changes</p>
        </button>
        <button onClick={(): void => {
          deleteTree();
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
          </svg>
          <p>Delete this tree</p>
        </button>
      </div>
    </div>
  </>;
};
