import {Accessor, createSignal, JSX, Setter} from 'solid-js';

import style from "./titleBox.module.css";

import MenuIcon from './chevron-left-solid.svg';

export default function(props: {
  title: string;
  left: {
    getter: Accessor<boolean>,
    setter: Setter<boolean>
  },
  right: {
    getter: Accessor<boolean>,
    setter: Setter<boolean>
  }
}): JSX.Element {
  return <>
    <div class={style.titleBox}>
      <div
        class={`${style.left} ${props.left.getter() ? style.open : style.closed}`}
        title={"Toggle navigation and info bar"}
      >
        <div onClick={(): void => { props.left.setter(!props.left.getter())}}>
          <MenuIcon />
        </div>
      </div>
      <div class={style.center}>
        <h1>{props?.title}</h1>
      </div>
      <div
        class={`${style.right} ${props.right.getter() ? style.open : style.closed}`}
        title={"Toggle customization bar"}
      >
        <div onClick={(): void => { props.right.setter(!props.right.getter())}} >
          <MenuIcon />
        </div>
      </div>
    </div>
  </>
}