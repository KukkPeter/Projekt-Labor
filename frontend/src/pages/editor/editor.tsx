import {
    Accessor,
    createSignal, from,
    JSX, onMount, useContext
} from "solid-js";

import style from './editor.module.css';

import { DIContextProvider } from "../../services/context-provider";
import { ApplicationService } from "../../services/application.service";

import Navbar from "../../components/navbar/navbar";
import CustomizeBar from "../../components/customizeBar/customizeBar";
import Canvas from "../../components/canvas/canvas";

import { Pages } from "../../interfaces/pages.interface";
import { Person } from "../../interfaces/canvas.interface";
import { Theme, TreeEdge, TreeNode } from "../../components/canvas/types";
import { Tree } from "../../interfaces/tree.interface";

export default function(): JSX.Element {
    const app: ApplicationService = useContext(DIContextProvider)!.resolve(ApplicationService);

    const currentTree: Accessor<Tree | undefined> = from(app.currentTree$);

    const [people, setPeople] = createSignal([] as Person[]);

    // Canvas Signals
    const [nodes, setNodes] = createSignal<TreeNode[]>([]);
    const [edges, setEdges] = createSignal<TreeEdge[]>([]);
    const [searchTerm, setSearchTerm] = createSignal<string>('');
    const [snapToGrid, setSnapToGrid] = createSignal<boolean>(true);
    const [gridSize, setGridSize] = createSignal<number>(20);
    const [theme, setTheme] = createSignal<Theme>({
        nodeColor: '#4CAF50',
        selectedColor: '#2196F3',
        highlightColor: '#FF9800',
        edgeColor: '#666666',
        backgroundColor: '#ffffff',
        textColor: '#ffffff',
        gridColor: '#f0f0f0'
    });

    onMount((): void => {
       // TODO: Load tree data from currentTree object
    });

    return <>
        <div id='editor' class={style.editor}>
            {/* Left Panel */}
            <Navbar page={Pages.Editor} />

            {/* Title Bar */}
            <div class={style.titleBox}>
                <h1>{currentTree()?.title}</h1>
            </div>

            {/* Main */}
            <Canvas
                nodes={{
                    getter: nodes,
                    setter: setNodes
                }}
                edges={{
                    getter: edges,
                    setter: setEdges
                }}
                snapToGrid={snapToGrid}
                gridSize={gridSize}
                theme={{
                    getter: theme,
                    setter: setTheme
                }}
                searchTerm={searchTerm}
            />

            {/* Right Panel */}
            <CustomizeBar
                snapToGrid={{
                    getter: snapToGrid,
                    setter: setSnapToGrid
                }}
                gridSize={{
                    getter: gridSize,
                    setter: setGridSize
                }}
                theme={{
                    getter: theme,
                    setter: setTheme
                }}
                searchTerm={{
                    getter: searchTerm,
                    setter: setSearchTerm
                }}
            />
        </div>
    </>;
};
