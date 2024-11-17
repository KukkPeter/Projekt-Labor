import {
    Accessor, createEffect,
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
import {Person, Theme, TreeEdge, TreeNode} from "../../components/canvas/types";
import { Tree } from "../../interfaces/tree.interface";
import {Modal} from "../../components/modal/modal";
import {ModalRootElement} from "../../components/modal/modal.types";
import NewPersonModal from "../../components/newPersonModal/newPersonModal";

export default function(): JSX.Element {
    let addNewPersonModal!: ModalRootElement;

    const app: ApplicationService = useContext(DIContextProvider)!.resolve(ApplicationService);

    const currentTree: Accessor<Tree | undefined> = from(app.currentTree$);
    const originalPeople: Accessor<Person[] | undefined> = from(app.originalPeople$);

    const [people, setPeople] = createSignal([] as Person[]);
    const [selectedPerson, setSelectedPerson] = createSignal<Person | undefined>(undefined);
    const [coordinates, setCoordinates] = createSignal<{x: number; y: number;}>({ x: 0, y: 0});

    // Canvas Signals
    const [nodes, setNodes] = createSignal<TreeNode[]>([]);
    const [edges, setEdges] = createSignal<TreeEdge[]>([]);
    const [selectedNode, setSelectedNode] = createSignal<TreeNode | null>(null);
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
        setPeople(originalPeople()!);

        if(typeof currentTree()!.treeData === 'string') {
            if(JSON.parse(currentTree()!.treeData).nodes) {
                setNodes(
                    JSON.parse(currentTree()!.treeData).nodes as TreeNode[]
                );
            }

            if(JSON.parse(currentTree()!.treeData).edges){
                setEdges(
                    JSON.parse(currentTree()!.treeData).edges as TreeEdge[]
                );
            }

            if(JSON.parse(currentTree()!.treeData).theme) {
                setTheme(
                    JSON.parse(currentTree()!.treeData).theme as Theme
                );
            }
        }
    });

    createEffect((): void => {
        if(selectedNode() !== null) {
            const nodeId: number = selectedNode()?.id!;

            const person: Person | undefined = people().find((p: Person): boolean => p.id === nodeId);
            if(person) {
                setSelectedPerson(person);
            }
        } else {
            setSelectedPerson(undefined);
        }
    });

    const removePerson = (personId: string): void => {
        const updatedPeople = people().filter(person => person.id !== personId);
        setPeople(updatedPeople);
    }

    const addNewPerson = (x: number, y: number): void => {
        setCoordinates({x: x, y: y});
        addNewPersonModal.show();
    }

    const saveTree = (): void => {
        let newPeople: Person[] = [];
        people().forEach((person: Person): void => {
           if((person.id as string).startsWith('NEW-')) {
               newPeople.push({
                   ...person,
                   id: (person.id as string).split('NEW-')[1]
               });
           }
        });

        let allNodes: TreeNode[] = [];
        nodes().forEach((node: TreeNode): void => {
           if((node.id as string).startsWith('NEW-')) {
               allNodes.push({
                   ...node,
                   id: (node.id as string).split('NEW-')[1]
               });
           }  else {
               allNodes.push(node);
           }
        });

        let allEdges: TreeEdge[] = [];
        edges().forEach((edge: TreeEdge): void => {
            let newEdge: TreeEdge = edge;

            if(edge.parentId.startsWith('NEW-')) {
                newEdge.parentId = edge.parentId.split('NEW-')[1];
            }

            if(edge.childId.startsWith('NEW-')) {
                newEdge.childId = edge.childId.split('NEW-')[0];
            }

            allEdges.push(edge);
        });

        let needToDeletePeople: Person[] = [];
        originalPeople()!.forEach((person: Person): void => {
            if(!people().includes(person)) {
                needToDeletePeople.push(person);
            }
        });
        // TODO: fix saving (needToDeletePeople not working)

        const data = {
            nodes: allNodes,
            edges: allEdges,
            theme: theme()
        };

        setNodes(allNodes);
        setEdges(allEdges);
        setPeople((prev: Person[]): Person[] => {
            let newPObject: Person[] = prev;
            for(let i: number = 0; i < newPObject.length; i++) {
                if((newPObject[i].id as string).startsWith('NEW-')) {
                    newPObject[i].id = (newPObject[i].id as string).split('NEW-')[1];
                }
            }
            return newPObject;
        });

        app.saveTree(
          JSON.stringify(data),
          needToDeletePeople,
          newPeople
        );
    }

    return <>
        <div id='editor' class={style.editor}>
            {/* Left Panel */}
            <Navbar page={Pages.Editor} selectedPerson={selectedPerson()}/>

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
                addNewPerson={addNewPerson}
                removePerson={removePerson}
                selectedNode={{
                    getter: selectedNode,
                    setter: setSelectedNode
                }}
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
                saveTree={saveTree}
            />

            {/* Modals */}
            <Modal
              ref={addNewPersonModal}
              hideCloseButton={true}
              shouldCloseOnBackgroundClick={true}
              title={'Add new person'}
              buttons={[
                  {
                      label: 'Cancel',
                      type: 'secondary full',
                      onClick: (): void => {
                          addNewPersonModal.close();
                      }
                  }
              ]}
            >
                <NewPersonModal treeId={currentTree()?.id!} onSubmit={(person: Person): void => {
                    setPeople([
                        ...people(),
                        {
                            ...person
                        }
                    ]);

                    setNodes([
                      ...nodes(),
                        {
                            id: person.id,
                            name: `${person.firstName}`,
                            x: coordinates().x,
                            y: coordinates().y
                        } as TreeNode
                    ]);

                    addNewPersonModal.close();
                }} />
            </Modal>
        </div>
    </>;
};
