import {createSignal, JSX, Match, Show, Switch} from "solid-js";

import style from './personInfo.module.css';
import {Person} from "../canvas/types";

export default function(props: { person: Person }): JSX.Element {
  const [menu, setMenu] = createSignal('Personal');

  const addRelative = (): void => {
    console.debug('TODO: addRelative');
  }

  return <>
    <div class={style.personInfo}>
      <h3>Selected Person: <span>{`${props.person.firstName} ${props.person.lastName}`}</span></h3>
      <div class={style.menu}>
        <button
          class={menu() !== 'Personal' ? style.unselected : ''}
          onClick={(): void => { setMenu('Personal'); }}
          style={{
            'width': (!props.person.description && !props.person.title) ? '100%' : ''
          }}
        >
          Personal
        </button>
        <button
          class={menu() !== 'Biography' ? style.unselected : ''}
          onClick={(): void => { setMenu('Biography'); }}
          style={{
            'display': (!props.person.description && !props.person.title) ? 'none' : ''
          }}
        >
          Biography
        </button>
      </div>
      <Switch>
        <Match when={menu() === 'Personal'}>
          <div class={style.content}>
            <p>
              <strong>Full Name:</strong>&nbsp;{`${props.person.firstName} ${props.person.lastName}`}
            </p>
            <p>
              <strong>First Name:</strong>&nbsp;{props.person.firstName}
            </p>
            <p>
              <strong>Last Name:</strong>&nbsp;{props.person.lastName}
            </p>
            <Show when={props.person.nickName}>
              <p>
                <strong>Nickname:</strong>&nbsp;{props.person.nickName}
              </p>
            </Show>
            <p>
              <strong>Gender:</strong>&nbsp;{props.person.gender}
            </p>
            <p>
              <strong>Birth date:</strong>&nbsp;{props.person.birthDate}
            </p>
            <Show when={props.person.deathDate}>
              <p>
                <strong>Death date:</strong>&nbsp;{props.person.deathDate}
              </p>
            </Show>
          </div>
        </Match>
        <Match when={menu() === 'Biography'}>
          <div class={style.content}>
            <Show when={props.person.title}>
              <p><strong>Title:</strong>&nbsp;{props.person.title!}</p>
            </Show>
            <Show when={props.person.description}>
              <p>
                {props.person.description!}
              </p>
            </Show>
          </div>
        </Match>
      </Switch>
    </div>
  </>;
}