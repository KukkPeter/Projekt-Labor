import {createSignal, JSX, onMount} from "solid-js";

import style from './canvas.module.css';

import {Node, NodeWithPerson, Person, Relationships, RelationTypes} from "../../interfaces/canvas.interface";

export default function(): JSX.Element {
    let main!: HTMLDivElement;
    let canvas!: HTMLCanvasElement;

    const [rootPerson, setRootPerson] = createSignal<Person>({} as Person);
    const [people, setPeople] = createSignal<Person[]>([] as Person[]);
    const [relations, setRelations] = createSignal<Relationships[]>([] as Relationships[]);

    let context!: CanvasRenderingContext2D;
    let drawnNodes: NodeWithPerson[] = [];

    const settings = {
        nodeWidth: 120,
        nodeHeight: 40,
        horizontalSpacing: 20,
        verticalSpacing: 80
    };

    /* Initialization */
    onMount((): void => {
        context = canvas.getContext('2d')!;
        
        clearCanvas();
    });

    const drawNode = (person: Person, x: number, y: number): Node => {
        context.fillStyle = person.id === rootPerson().id ? '#a0e1ff' : '#f0f0f0';
        context.fillRect(x, y, settings.nodeWidth, settings.nodeHeight);
        context.strokeRect(x, y, settings.nodeWidth, settings.nodeHeight);
        context.fillStyle = 'black';
        context.fillText(person.nickName, x + 5, y + 25);

        return {
            x,
            y,
            width: settings.nodeWidth,
            height: settings.nodeHeight
        };
    };

    const drawLine = (x1: number, y1: number, x2: number, y2: number, color = 'black'): void => {
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.strokeStyle = color;
        context.stroke();
    };

    const getRelativesOf = (person: Person, relationType: RelationTypes): Person[] => {
        const relationIds: number[] = relations()
            .filter((r: Relationships): boolean => r.type === relationType && (r.person1Id === person.id || r.person2Id === person.id))
            .map((r: Relationships): number => r.person1Id === person.id ? r.person2Id : r.person1Id);

        return people().filter((p: Person): boolean => relationIds.includes(p.id));
    };

    const drawTree = (): NodeWithPerson[] => {
        clearCanvas();

        let nodes: NodeWithPerson[] = [];

        if(rootPerson() !== undefined && rootPerson() !== null) {
            const centerX: number = canvas.width / 2 - settings.nodeWidth / 2;
            const centerY: number = canvas.height / 2 - settings.nodeHeight / 2;

            const nodeInfo: Node = drawNode(rootPerson(), centerX, centerY);
            nodes.push({
                person: rootPerson(),
                ...nodeInfo
            });

            const parents: Person[] = getRelativesOf(rootPerson(), RelationTypes.parent);
            const siblings: Person[] = getRelativesOf(rootPerson(), RelationTypes.sibling);
            const spouse: Person[] = getRelativesOf(rootPerson(), RelationTypes.spouse);
            const children: Person[] = getRelativesOf(rootPerson(), RelationTypes.child);

            /* Draw Parents */
            parents.forEach((parent: Person, index: number): void => {
                const x: number = index === 0
                    ? (centerX - settings.nodeWidth - settings.horizontalSpacing)
                    : (centerX + settings.nodeWidth + settings.horizontalSpacing);
                const y: number = centerY - settings.verticalSpacing;
                const parentInfo: Node = drawNode(parent, x, y);

                nodes.push({
                    person: parent,
                    ...parentInfo
                });

                drawLine(
                    x + settings.nodeWidth / 2,
                    y + settings.nodeHeight,
                    centerX + settings.nodeWidth / 2,
                    centerY,
                    'green'
                );
            });

            /* Draw siblings */
            const siblingStartX: number = centerX - settings.nodeWidth - settings.horizontalSpacing;
            siblings.forEach((sibling: Person, index: number): void => {
                const x: number = siblingStartX - (index * (settings.nodeWidth + settings.horizontalSpacing));
                const y: number = centerY;
                const siblingInfo: Node = drawNode(sibling, x, y);

                nodes.push({
                    person: sibling,
                    ...siblingInfo
                });

                if (index > 0) {// Connect siblings to each other
                    const prevSiblingX: number = siblingStartX - ((index - 1) * (settings.nodeWidth + settings.horizontalSpacing));
                    drawLine(
                        x + settings.nodeWidth,
                        y + settings.nodeHeight / 2,
                        prevSiblingX,
                        y + settings.nodeHeight / 2,
                        'blue'
                    );
                }
                else { // Connect first sibling to root
                    drawLine(
                        x + settings.nodeWidth,
                        y + settings.nodeHeight / 2,
                        centerX,
                        centerY + settings.nodeHeight / 2,
                        'blue'
                    );
                }
            });

            /* Draw spouse */
            if(spouse.length > 0) {
                const spouseX: number = centerX + settings.nodeWidth + settings.horizontalSpacing;
                const spouseInfo: Node = drawNode(spouse[0], spouseX, centerY);
                nodes.push({
                    person: spouse[0],
                    ...spouseInfo
                });

                drawLine(
                    centerX + settings.nodeWidth,
                    centerY + settings.nodeHeight / 2,
                    spouseX,
                    centerY + settings.nodeHeight / 2,
                    'red'
                );
            }

            /* Draw children */
            const childrenStartX: number = centerX - ((children.length - 1) * (settings.nodeWidth + settings.horizontalSpacing) / 2);
            children.forEach((child: Person, index: number): void => {
                const x: number = childrenStartX + (index * (settings.nodeWidth + settings.horizontalSpacing));
                const y: number = centerY + settings.verticalSpacing;
                const childInfo: Node = drawNode(child, x, y);

                nodes.push({
                    person: child, ...childInfo
                });

                drawLine(
                    centerX + settings.nodeWidth / 2,
                    centerY + settings.nodeHeight,
                    x + settings.nodeWidth / 2,
                    y,
                    'green'
                );
            });

            // Draw Root Name
            drawRootName();
        } else {
            console.error('No root person selected!');
        }

        return nodes;
    }

    const drawRootName = (): void => {
        context.fillStyle = 'black';
        context.font = 'bold 16px Arial';

        const name: string = `${rootPerson().firstName}, ${rootPerson().lastName}`;
        context.fillText(`Root: ${name}`, 10, 20);
    }

    const clearCanvas = (): void => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.font = '14px Arial';
    }

    const handleCanvasClick = (event: MouseEvent): void => {
        const rect: DOMRect = canvas.getBoundingClientRect();
        const x: number = event.clientX - rect.left;
        const y: number = event.clientY - rect.top;

        const clickedNode: NodeWithPerson | undefined = drawnNodes.find((node: NodeWithPerson): boolean =>
            x >= node.x && x <= node.x + node.width &&
            y >= node.y && y <= node.y + node.height
        );

        if(clickedNode && clickedNode.person !== rootPerson()) {
            const oldRoot: Person = rootPerson();
            const newRoot: Person = clickedNode.person;

            // Check if the clicked node is a parent of the current root
            const isParentOfRoot: boolean = relations().some((r: Relationships): boolean =>
                r.type === RelationTypes.parent && r.person1Id === oldRoot.id && r.person2Id === newRoot.id
            );

            // Check if the clicked node is a child of the current root
            const isChildOfRoot: boolean = relations().some((r: Relationships): boolean =>
                r.type === RelationTypes.child && r.person1Id === oldRoot.id && r.person2Id === newRoot.id
            );

            if(isParentOfRoot) {
                // Remove the old parent-child relations
                setRelations((prev: Relationships[]): Relationships[] => prev.filter((r: Relationships) =>
                    !(r.type === RelationTypes.parent && r.person1Id === oldRoot.id && r.person2Id === newRoot.id)
                ));

                // Add a new child relationship from new root to old root
                setRelations((prev: Relationships[]): Relationships[] => [
                    ...prev,
                    {
                        person1Id: newRoot.id,
                        person2Id: oldRoot.id,
                        type: RelationTypes.child,
                        createdAt: '', // TODO
                        updatedAt: '' // TODO
                    }
                ]);
                // TODO: Migration
            }
        }
    }

    return <>
        <div ref={main} class={style.mainBox}>
            <canvas style={'width: 100%; height: 100%;'} ref={canvas}></canvas>
        </div>
    </>;
}