import {
    createSignal,
    onMount,
    JSX,
    Accessor, onCleanup,
} from "solid-js";

import style from './canvas.module.css';

import {
    Node,
    NodeWithPerson,
    Person,
    Relationships,
    RelationTypes
} from "../../interfaces/canvas.interface";

interface CanvasProps {
    treeId: number;
    people: Accessor<Person[]>;
    relations: Accessor<Relationships[]>;
}

export default function(props: CanvasProps): JSX.Element {
    let container!: HTMLDivElement;
    let canvas!: HTMLCanvasElement;

    const [context, setContext] = createSignal<CanvasRenderingContext2D>({} as CanvasRenderingContext2D);
    
    const [rootPerson, setRootPerson] = createSignal<Person>({} as Person);
    const [drawnNodes, setDrawnNodes] = createSignal<NodeWithPerson[]>([] as NodeWithPerson[]);

    const settings = {
        nodeWidth: 120,
        nodeHeight: 40,
        horizontalSpacing: 20,
        verticalSpacing: 80
    };

    /* Initialization */
    onMount((): void => {
        // Settings canvas 2D context
        setContext(canvas.getContext('2d')! as CanvasRenderingContext2D);

        window.addEventListener('resize', resizeCanvas);

        // Clear canvas
        clearCanvas();

        // Initial draw with rootPerson() equals the first person in the people prop
        setRootPerson(props.people()[0]);

        setDrawnNodes(
          drawTree() as NodeWithPerson[]
        );
    });

    onCleanup((): void => {
        window.removeEventListener('resize', resizeCanvas);
    });

    /* Canvas related methods */
    const drawTree = (): NodeWithPerson[] => {
        return [] as NodeWithPerson[];
    }

    const drawNode = (person: Person, x: number, y: number): Node => {
        context().fillStyle = person.id === rootPerson().id ? '#a0e1ff' : '#f0f0f0';

        context().fillRect(x, y, settings.nodeWidth, settings.nodeHeight);
        context().strokeRect(x, y, settings.nodeWidth, settings.nodeHeight);
        context().fillStyle = 'black';

        // TODO: implement customize display settings
        context().fillText(person.nickName, x + 5, y + 25);

        return {
            x,
            y,
            width: settings.nodeWidth,
            height: settings.nodeHeight
        };
    };

    const drawLine = (x1: number, y1: number, x2: number, y2: number, color = 'black'): void => {
        context().beginPath();
        context().moveTo(x1, y1);
        context().lineTo(x2, y2);
        context().strokeStyle = color;
        context().stroke();
    };

    const drawRootName = (): void => {
        context().fillStyle = 'black';
        context().font = 'bold 16px Arial';

        if(rootPerson().firstName && rootPerson().lastName) {
            const name: string = `${rootPerson().firstName}, ${rootPerson().lastName}`;
            context().fillText(`Root: ${name}`, 10, 20);
        }
    }

    const resizeCanvas = (): void => {
        console.debug('RESIZE');

        // Clear canvas
        clearCanvas();

        // Set new dimensions
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;

        // Re-Draw tree
        drawTree();
    }

    const clearCanvas = (): void => {
        context().clearRect(0, 0, canvas.width, canvas.height);
        context().font = '14px Arial';

        // Clear drawnNodes array
        setDrawnNodes(
          [] as NodeWithPerson[]
        );
    }

    /* Tree related methods */
    const handleCanvasClick = (event: MouseEvent): void => {
        /* TODO:
            - Check if node is clicked
            - If node clicked check if it is the rootPerson or not
            - If it not the root person then clear the canvas, set the new root person, and re-draw the canvas
        * */

    }

    const getRelativesOf = (person: Person, relationType: RelationTypes): Person[] => {
        const relationIds: number[] = props.relations()
          .filter((r: Relationships): boolean => r.type === relationType && (r.person1Id === person.id || r.person2Id === person.id))
          .map((r: Relationships): number => r.person1Id === person.id ? r.person2Id : r.person1Id);

        return props.people().filter((p: Person): boolean => relationIds.includes(p.id));
    };

    return <>
        <div
          ref={container}
          class={style.mainBox}
        >
            <canvas
                ref={canvas}
                onClick={handleCanvasClick}
            />
        </div>
    </>;
}