import { Accessor, from, type JSX, Match, Switch, useContext } from 'solid-js';

import { DIContextProvider } from '../../services/context-provider';
import { AuthService } from '../../services/auth.service';
import { ApplicationService } from "../../services/application.service";

import { Toaster } from "solid-toast";

import { Pages } from "../../interfaces/pages.interface";

import Auth from "../../pages/auth/auth";
import Home from "../../pages/home/home";
import Editor from "../../pages/editor/editor";

export default function(): JSX.Element {
  const auth: AuthService = useContext(DIContextProvider)!.resolve(AuthService);
  const app: ApplicationService = useContext(DIContextProvider)!.resolve(ApplicationService);

  const authenticated: Accessor<boolean | undefined> = from(auth.authenticated$);
  const currentPage: Accessor<Pages | undefined> = from(app.currentPage$);

  return <>
    <Toaster
      position={'bottom-right'}
      gutter={8}
    />
    <Switch>
      <Match when={!authenticated() || currentPage() === Pages.Authentication}>
        <Auth />
      </Match>
      <Match when={authenticated() && currentPage() === Pages.Home}>
        <Home />
      </Match>
      <Match when={authenticated() && currentPage() === Pages.Editor}>
        <Editor />
      </Match>
    </Switch>
  </>;
};
