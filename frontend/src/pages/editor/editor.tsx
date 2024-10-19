import { JSX } from "solid-js";

import style from './editor.module.css';

import Navbar from "../../components/navbar/navbar";
import CustomizeBar from "../../components/customizeBar/customizeBar";
import Canvas from "../../components/canvas/canvas";

import TreeEditor from "../../components/treeEditor/treeEditor";

import { Pages } from "../../interfaces/pages.interface";

export default function(): JSX.Element {
    return <>
        <TreeEditor />
    </>;
    return <>
        <div id='editor' class={style.editor}>
            {/* Left Panel */}
            <Navbar page={Pages.Editor} />

            {/* Title Bar */}
            <div class={style.titleBox}>
                <h1>Family Tree Title</h1>
            </div>

            {/* Main */}
            <Canvas />

            {/* Right Panel */}
            <CustomizeBar />
        </div>
    </>;
};
