import {
    createSignal,
    JSX
} from "solid-js";

import style from './editor.module.css';

import Navbar from "../../components/navbar/navbar";
import CustomizeBar from "../../components/customizeBar/customizeBar";
import Canvas from "../../components/canvas/canvas";

import TreeEditor from "../../components/treeEditor/treeEditor";

import { Pages } from "../../interfaces/pages.interface";
import {
    Person,
    Relationships
} from "../../interfaces/canvas.interface";

export default function(): JSX.Element {
    const [people, setPeople] = createSignal([] as Person[]);
    const [relationships, setRelationships] = createSignal([] as Relationships[]);

    /* For demonstrations only */
    return <>
        <TreeEditor />
    </>

    return <>
        <div id='editor' class={style.editor}>
            {/* Left Panel */}
            <Navbar page={Pages.Editor} />

            {/* Title Bar */}
            <div class={style.titleBox}>
                <h1>Family Tree Title</h1>
            </div>

            {/* Main */}
            <Canvas
              treeId={0}
              people={people}
              relations={relationships}
            />

            {/* Right Panel */}
            <CustomizeBar />
        </div>
    </>;
};
