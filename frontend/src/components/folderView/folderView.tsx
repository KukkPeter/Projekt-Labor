import { JSX } from "solid-js";

import style from './folderView.module.css';

export default function(): JSX.Element {
  return <>
    <div id='folderView' class={style.folder}>
        <div class={style.topSection}>
            <h3>A fáid</h3>
        </div>
        <div class={style.bottomSection}>
            <div class={style.scrollView}>
                <div class={style.card}></div>
                <div class={style.card}></div>
                <div class={style.card}></div>
                <div class={style.card}></div>
                <div class={style.card}></div>
                <div class={style.card}></div>
                <div class={style.card}></div>
                <div class={style.card}></div>
                <div class={style.card}></div>
                <div class={style.card}></div>
                <div class={style.card}></div>
                <div class={style.card}></div>
                <div class={style.card}></div>
            </div>
        </div>
    </div>
  </>;
};
