import { createSignal, onMount, createEffect, Show, JSX, onCleanup, Accessor, Setter, Switch, Match, For } from 'solid-js';
import { TreeNode, TreeEdge, Position, Theme, RelationType } from './types';
import { RelationTypeSelector } from '../relationTypeModal/relationTypeSelector';

import style from './canvas.module.css';

export default function(props: {
  snapToGrid: Accessor<boolean>,
  gridSize: Accessor<number>,
  theme: {
    getter: Accessor<Theme>,
    setter: Setter<Theme>
  },
  nodes: {
    getter: Accessor<TreeNode[]>,
    setter: Setter<TreeNode[]>
  },
  edges: {
    getter: Accessor<TreeEdge[]>,
    setter: Setter<TreeEdge[]>
  },
  searchTerm: Accessor<string>,
  addNewPerson: (x: number, y: number) => void,
  removePerson: (personId: string) => void,
  selectedNode: {
    getter: Accessor<TreeNode | null>,
    setter: Setter<TreeNode | null>
  }
}): JSX.Element {
  let canvasRef!: HTMLCanvasElement;
  
  const [isDragging, setIsDragging] = createSignal<boolean>(false);
  const [dragOffset, setDragOffset] = createSignal<Position>({ x: 0, y: 0 });
  const [zoom, setZoom] = createSignal<number>(1);
  const [pan, setPan] = createSignal<Position>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = createSignal<boolean>(false);
  const [lastPanPoint, setLastPanPoint] = createSignal<Position>({ x: 0, y: 0 });
  
  const [showContextMenu, setShowContextMenu] = createSignal<boolean>(false);
  const [contextMenuPos, setContextMenuPos] = createSignal<Position>({ x: 0, y: 0 });
  
  const [relationshipType, setRelationshipType] = createSignal<RelationType>('parent');
  const [showRelationTypeSelector, setShowRelationTypeSelector] = createSignal<boolean>(false);

  const [highlightedNodes, setHighlightedNodes] = createSignal<number[]>([]);
  
  const [isConnecting, setIsConnecting] = createSignal<boolean>(false);
  const [connectionStart, setConnectionStart] = createSignal<TreeNode | null>(null);
  
  const [lastMousePos, setLastMousePos] = createSignal<Position>({ x: 0, y: 0 });

  const NODE_RADIUS: number = 40;
  let observer!: ResizeObserver;

  const transform = (x: number, y: number): { x: number; y: number } => ({
    x: (x - pan().x) * zoom(),
    y: (y - pan().y) * zoom()
  });

  const inverseTransform = (x: number, y: number): { x: number; y: number } => ({
    x: x / zoom() + pan().x,
    y: y / zoom() + pan().y
  });

  const snapToGridPosition = (x: number, y: number): { x: number; y: number; } => {
    if (!props.snapToGrid()) return { x, y };
    const size = props.gridSize();
    return {
      x: Math.round(x / size) * size,
      y: Math.round(y / size) * size
    };
  };

  const drawGrid = (ctx: CanvasRenderingContext2D): void => {
    if (!props.snapToGrid()) return;

    const size = props.gridSize() * zoom();
    const width = canvasRef.width;
    const height = canvasRef.height;

    ctx.strokeStyle = props.theme.getter().gridColor;
    ctx.lineWidth = 0.5;

    for (let x = size; x < width; x += size) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = size; y < height; y += size) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const getNodeConnections = (nodeId: number): TreeEdge[] => {
    return props.edges.getter().filter(edge => 
      edge.parentId === nodeId || edge.childId === nodeId
    );
  };

  const deleteConnection = (edgeId: string): void => {
    props.edges.setter(props.edges.getter().filter(edge => edge.id !== edgeId));
  };

  const getRelationshipDescription = (edge: TreeEdge, nodeId: number): string => {
    const otherNode = props.nodes.getter().find(n => 
      n.id === (edge.parentId === nodeId ? edge.childId : edge.parentId)
    );

    if (!otherNode) return '';

    switch (edge.type) {
        case 'parent':
            return edge.parentId === nodeId 
                ? `parent of ${otherNode.name}`
                : `child of ${otherNode.name}`;
            
        case 'spouse':
            return `married to ${otherNode.name}`;
            
        case 'sibling':
            return `sibling of ${otherNode.name}`;
            
        default:
            return `connected to ${otherNode.name}`;
    }
};

  const addConnection = (parentId: number, childId: number, type: RelationType): void => {
    props.edges.setter([...props.edges.getter(), {
      id: `NEW-${Date.now()}`,
      parentId: parentId,
      childId: childId,
      type: type
    } as TreeEdge]);
  };

  const deleteNode = (nodeId: number): void => {
    props.nodes.setter(props.nodes.getter().filter(n => n.id !== nodeId));
    props.edges.setter(props.edges.getter().filter(e => e.parentId !== nodeId && e.childId !== nodeId));
    props.removePerson(nodeId.toString());
    props.selectedNode.setter(null);
    setShowContextMenu(false);
  };

  const drawNode = (ctx: CanvasRenderingContext2D, node: TreeNode, isSelected = false): void => {
    const { x, y } = transform(node.x, node.y);
    const radius = NODE_RADIUS * zoom();
    const isHighlighted = highlightedNodes().includes(node.id);
    const isConnecting = connectionStart()?.id === node.id;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);

    if (isConnecting) {
      ctx.lineWidth = 3;
      ctx.strokeStyle = props.theme.getter().selectedColor;
    } else {
      ctx.lineWidth = 1;
      ctx.strokeStyle = props.theme.getter().edgeColor;
    }

    ctx.fillStyle = isHighlighted ? props.theme.getter().highlightColor :
      isSelected ? props.theme.getter().selectedColor :
        props.theme.getter().nodeColor;

    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = props.theme.getter().textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${14 * zoom()}px Arial`;
    ctx.fillText(node.name, x, y);
  };

  const drawEdge = (ctx: CanvasRenderingContext2D, edge: TreeEdge, parent: TreeNode, child: TreeNode) => {
    const p = transform(parent.x, parent.y);
    const c = transform(child.x, child.y);

    const angle = Math.atan2(c.y - p.y, c.x - p.x);

    const startX = p.x + Math.cos(angle) * (NODE_RADIUS * zoom());
    const startY = p.y + Math.sin(angle) * (NODE_RADIUS * zoom());
    const endX = c.x - Math.cos(angle) * (NODE_RADIUS * zoom());
    const endY = c.y - Math.sin(angle) * (NODE_RADIUS * zoom());

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = props.theme.getter().edgeColor;

    if (edge.type === 'spouse') {
      ctx.setLineDash([5, 5]);
    } else if (edge.type === 'sibling') {
      ctx.setLineDash([10, 10]);
    } else {
      ctx.setLineDash([]);
    }

    ctx.lineWidth = 2 * zoom();
    ctx.stroke();
    ctx.setLineDash([]);

    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    ctx.fillStyle = props.theme.getter().edgeColor;
    ctx.font = `${12 * zoom()}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(edge.type, midX, midY);
  };

  const render = (): void => {
    const ctx: CanvasRenderingContext2D = canvasRef.getContext('2d')!;
    ctx.clearRect(0, 0, canvasRef.width, canvasRef.height);
    ctx.fillStyle = props.theme.getter().backgroundColor;
    ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);

    drawGrid(ctx);

    props.edges.getter().forEach((edge: TreeEdge): void => {
      const parent: TreeNode | undefined = props.nodes.getter().find((n: TreeNode): boolean => n.id === edge.parentId);
      const child: TreeNode | undefined = props.nodes.getter().find((n: TreeNode): boolean => n.id === edge.childId);
      if (parent && child) {
        drawEdge(ctx, edge, parent, child);
      }
    });

    props.nodes.getter().forEach((node: TreeNode): void => {
      const isSelected = props.selectedNode.getter()?.id === node.id;
      const isConnecting = connectionStart()?.id === node.id;
      drawNode(ctx, node, isSelected || isConnecting);
    });

    if (isConnecting() && connectionStart()) {
      const start = connectionStart()!;
      const startPos = transform(start.x, start.y);
      const rect = canvasRef.getBoundingClientRect();
      const mousePos = {
        x: (lastMousePos().x - rect.left),
        y: (lastMousePos().y - rect.top)
      };

      ctx.beginPath();
      ctx.moveTo(startPos.x, startPos.y);
      ctx.lineTo(mousePos.x, mousePos.y);
      ctx.strokeStyle = props.theme.getter().edgeColor;
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  };

  const handleCanvasClick = (e: MouseEvent): void => {
    if (showContextMenu()) {
      setShowContextMenu(false);
      return;
    }

    const rect = canvasRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const transformed = inverseTransform(x, y);

    const clickedNode = props.nodes.getter().find(node => {
      const dx = node.x - transformed.x;
      const dy = node.y - transformed.y;
      return Math.sqrt(dx * dx + dy * dy) <= NODE_RADIUS;
    });

    if (clickedNode) {
      if (isConnecting()) {
        if (connectionStart() && clickedNode.id !== connectionStart()!.id) {
          addConnection(connectionStart()!.id, clickedNode.id, relationshipType());
          setIsConnecting(false);
          setConnectionStart(null);
          props.selectedNode.setter(null);
        }
      } else {
        props.selectedNode.setter(clickedNode);
      }
    } else {
      setIsConnecting(false);
      setConnectionStart(null);
      props.selectedNode.setter(null);
    }
  };

  const handleContextMenu = (e: MouseEvent): void => {
    e.preventDefault();
    const rect = canvasRef.getBoundingClientRect();
    const transformed = inverseTransform(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    const clickedNode = props.nodes.getter().find((node: TreeNode) => {
      const dx = node.x - transformed.x;
      const dy = node.y - transformed.y;
      return Math.sqrt(dx * dx + dy * dy) <= NODE_RADIUS;
    });

    if (clickedNode) {
      props.selectedNode.setter(clickedNode);
    }

    setContextMenuPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setShowContextMenu(true);
  };

  const handleWheel = (e: WheelEvent): void => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom(z => Math.max(0.1, Math.min(5, z * delta)));
  };

  const handleMouseDown = (e: MouseEvent): void => {
    const rect = canvasRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const transformed = inverseTransform(x, y);

    if (e.button === 1 || e.button === 2) {
      e.preventDefault();
      setIsPanning(true);
      setLastPanPoint({ x: e.clientX, y: e.clientY });
      canvasRef.style.cursor = 'grabbing';
      return;
    }

    const clickedNode = props.nodes.getter().find(node => {
      const dx = node.x - transformed.x;
      const dy = node.y - transformed.y;
      return Math.sqrt(dx * dx + dy * dy) <= NODE_RADIUS;
    });

    if (clickedNode) {
      setIsDragging(true);
      props.selectedNode.setter(clickedNode);
      setDragOffset({
        x: clickedNode.x - transformed.x,
        y: clickedNode.y - transformed.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent): void => {
    setLastMousePos({ x: e.clientX, y: e.clientY });

    if (isPanning()) {
      const dx = e.clientX - lastPanPoint().x;
      const dy = e.clientY - lastPanPoint().y;

      setPan(prev => ({
        x: prev.x + dx / zoom(),
        y: prev.y + dy / zoom()
      }));

      setLastPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    if (isDragging() && props.selectedNode.getter()) {
      const rect = canvasRef.getBoundingClientRect();
      const transformed = inverseTransform(
        e.clientX - rect.left,
        e.clientY - rect.top
      );

      const snapped = snapToGridPosition(
        transformed.x + dragOffset().x,
        transformed.y + dragOffset().y
      );

      props.nodes.setter(props.nodes.getter().map(node => {
        if (node.id === props.selectedNode.getter()!.id) {
          return { ...node, x: snapped.x, y: snapped.y };
        }
        return node;
      }));
    }
  };

  const handleMouseUp = (e: MouseEvent): void => {
    if (e.button === 2) {
      setIsConnecting(false);
      setConnectionStart(null);
      props.selectedNode.setter(null);
    }
    setIsDragging(false);
    setIsPanning(false);
    canvasRef.style.cursor = 'default';
  };

  const handleResize = (entries: any): void => {
    canvasRef.width = entries[0].target.offsetWidth;
    canvasRef.height = entries[0].target.offsetHeight;

    setTimeout((): void => {
      render();
    }, 0);
  };

  const searchNodes = (term: string): void => {
    if (!term) {
      setHighlightedNodes([]);
      return;
    }

    const results = props.nodes.getter().filter(node =>
      node.name.toLowerCase().includes(term.toLowerCase())
    );

    setHighlightedNodes(results.map(n => n.id));
  };

  createEffect((): void => {
    searchNodes(props.searchTerm());
  });

  createEffect((): void => {
    props.nodes.getter();
    props.edges.getter();
    zoom();
    pan();
    props.theme.getter();
    render();
  });

  onMount((): void => {
    canvasRef.width = canvasRef.getBoundingClientRect().width;
    canvasRef.height = canvasRef.getBoundingClientRect().height;

    observer = new ResizeObserver(handleResize);
    observer.observe(canvasRef);

    setTimeout((): void => {
      render();
    }, 0);
  });

  onCleanup((): void => {
    observer.disconnect();
  });

  return <>
    <div class={style['family-tree']}>
      <div class={style['connection-status']} style={{
        "background": isConnecting() ? "rgba(33, 150, 243, 0.9)" : "transparent",
      }}>
        {isConnecting() && "Click another node to create connection"}
      </div>
      
      <div class={style['canvas-container']}>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            class={style['canvas']}
            style={{
              "cursor": isPanning() ? "grabbing" : isDragging() ? "grab" : "default"
            }}
          />

          <Show when={showContextMenu()}>
            <div class={style['contextMenu']}
              style={{
                "left": `${contextMenuPos().x}px`,
                "top": `${contextMenuPos().y}px`
              }}
            >
              <Switch>
                <Match when={props.selectedNode.getter()}>
                  <div class={style['contextContainer']}>
                    <button
                      onClick={(): void => {
                        setShowContextMenu(false);
                        setShowRelationTypeSelector(true);
                      }}
                    >
                      Add connection
                    </button>
                    <button onClick={(): void => deleteNode(props.selectedNode.getter()!.id)}>
                      Delete Node
                    </button>
                  </div>

                  <div class={style['relationsContainer']}>
                    <p>Connections:</p>
                    <For each={getNodeConnections(props.selectedNode.getter()!.id)}>
                      {(edge) => (
                        <div class={style['container']}>
                          <span>{getRelationshipDescription(edge, props.selectedNode.getter()!.id)}</span>
                          <button 
                            onClick={() => {
                              if(confirm('Are you sure you want to delete this connection?')) {
                                deleteConnection(edge.id);
                                setShowContextMenu(false);
                              }
                            }}
                          >
                            ×
                          </button>
                        </div>
                      )}
                    </For>
                  </div>
                </Match>
                <Match when={!props.selectedNode.getter()}>
                  <button class={style['newPersonButton']} onClick={(): void => {
                    setShowContextMenu(false);
                    props.addNewPerson(contextMenuPos().x, contextMenuPos().y);
                  }}>
                    Create new person
                  </button>
                </Match>
              </Switch>
            </div>
          </Show>

          <Show when={showRelationTypeSelector()}>
            <RelationTypeSelector
              onSelect={(type) => {
                setRelationshipType(type);
                setIsConnecting(true);
                setConnectionStart(props.selectedNode.getter());
                setShowRelationTypeSelector(false);
              }}
              onCancel={() => {
                setShowRelationTypeSelector(false);
              }}
            />
          </Show>
      </div>
    </div>
  </>;
}