import { JSX } from "solid-js";

import style from './editor.module.css';

import Navbar from "../../components/navbar/navbar";
import CustomizeBar from "../../components/customizeBar/customizeBar";

import { Pages } from "../../interfaces/pages.interface";

export default function(): JSX.Element {
    return <>
        <div id='editor' class={style.editor}>
            <Navbar page={Pages.Editor} />

            <div class={style.titleBox}>
                <h1>Family Tree Title</h1>
            </div>

            <CustomizeBar />
        </div>
    </>;
};
