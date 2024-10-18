import {Accessor, from, JSX, Show, useContext} from "solid-js";

import {AuthService} from '../../services/auth.service';
import {DIContextProvider} from '../../services/context-provider';

import style from './navbar.module.css';

import {User} from "../../interfaces/user.interface";
import {Pages} from "../../interfaces/pages.interface";
import {ApplicationService} from "../../services/application.service";
import PersonInfo from "../personInfo/personInfo";

export default function(props: {
    page: Pages.Home | Pages.Editor,
    selectedPerson?: any
}): JSX.Element {
  const app: ApplicationService = useContext(DIContextProvider)!.resolve(ApplicationService);
  const auth: AuthService = useContext(DIContextProvider)!.resolve(AuthService);

  const user: Accessor<User | undefined> = from(auth.user$);

  const logout = (): void => {
    auth.logout();
  }

  const createNewTree = (): void => {
    console.debug('TODO: createNewTree');
  }

  const backToTheMainMenu = (): void => {
    if(confirm('Are you sure you want to go back to the main menu?\nUnsaved content will be lost!')) {
        app.setCurrentPage(Pages.Home);
    }
  }

  return <>
    <div id='navbar' class={style.navbar}>
      <div class={style.profileSection}>
        <div class={style.profile}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/>
            </svg>
            <p>{user()?.username}</p>
        </div>
        <button class={style.btnLogout} onClick={logout}>
            Logout
        </button>
      </div>

      <div class={style.menuSection}>
        <Show when={props.page === Pages.Home}>
            <button onClick={createNewTree}>Create new family tree</button>
        </Show>
        <Show when={props.page === Pages.Editor}>
          <button onClick={backToTheMainMenu}>Back to the main menu</button>
          <hr />
          <div class={style.editorTab}>
            <button>Create a new person</button>
            <hr />

            <PersonInfo />

          </div>
        </Show>
      </div>
    </div>
  </>
;
};
