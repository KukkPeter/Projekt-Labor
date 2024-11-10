import { createSignal, onMount, createEffect, Show, JSX, onCleanup, Accessor, Setter, Switch, Match } from 'solid-js';

import { TreeNode, TreeEdge, Position, Theme, RelationType } from './types';

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

  const addConnection = (parentId: number, childId: number): void => {
    // TODO: set relationship type with modal
    props.edges.setter([...props.edges.getter(), {
      id: `NEW-${Date.now()}`,
      parentId: parentId,
      childId: childId,
      type: relationshipType()
    } as TreeEdge]);
  }

  const deleteNode = (nodeId: number): void => {
    props.nodes.setter(props.nodes.getter().filter(n => n.id !== nodeId));
    props.edges.setter(props.edges.getter().filter(e => e.parentId !== nodeId && e.childId !== nodeId));
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

    // Add outline for connecting node
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

    // Draw name
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

    // Calculate start and end points on the circumference of the nodes
    const startX = p.x + Math.cos(angle) * (NODE_RADIUS * zoom());
    const startY = p.y + Math.sin(angle) * (NODE_RADIUS * zoom());
    const endX = c.x - Math.cos(angle) * (NODE_RADIUS * zoom());
    const endY = c.y - Math.sin(angle) * (NODE_RADIUS * zoom());

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = props.theme.getter().edgeColor;

    // Different line styles for different relationships
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

    // Draw relationship type
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
        // If we're in connecting mode and click a different node, create the connection
        if (connectionStart() && clickedNode.id !== connectionStart()!.id) {
          addConnection(connectionStart()!.id, clickedNode.id);
          // Reset connection mode
          setIsConnecting(false);
          setConnectionStart(null);
          props.selectedNode.setter(null);
        }
      }
    } else {
      // Reset connection mode if clicking empty space
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

    // Right click initiates panning
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
    if (e.button === 2) { // Right click
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
  }

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

  const loadTree = (event: any): void => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      /* eslint-disable-next-line no-explicit-any */
      reader.onload = (e: any): void => {
        const data = JSON.parse(e.target.result);
        props.nodes.setter(data.nodes);
        props.edges.setter(data.edges);
        props.theme.setter(data.theme);
      };
      reader.readAsText(file);
    }
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
    <div class="family-tree" style={{
      "position":"absolute",
      "width": "50%",
      "height": "93%",
      "top": "7%",
      "left": "25%",
    }}>
      <div class="connection-status" style={{
        "position": "absolute",
        "top": "10px",
        "left": "50%",
        "transform": "translateX(-50%)",
        "padding": "5px 10px",
        "background": isConnecting() ? "rgba(33, 150, 243, 0.9)" : "transparent",
        "color": "white",
        "border-radius": "4px",
        "pointer-events": "none",
        "transition": "background 0.3s"
      }}>
        {isConnecting() && "Click another node to create connection"}
      </div>
      
      <div style={{"position": "absolute", "width": "100%", "height": "100%"}}>
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            onContextMenu={handleContextMenu}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{
              "width": "100%",
              "height": "100%",
              "border": "1px solid #ccc",
              "cursor": isPanning() ? "grabbing" : isDragging() ? "grab" : "default"
            }}
          />

          <Show when={showContextMenu()}>
            <div
              style={{
                "position": "absolute",
                "left": `${contextMenuPos().x}px`,
                "top": `${contextMenuPos().y}px`,
                "background": "white",
                "border": "1px solid #ccc",
                "padding": "0.5rem",
                "box-shadow": "2px 2px 5px rgba(0,0,0,0.2)"
              }}
            >
              <Switch>
                <Match when={props.selectedNode.getter()}>
                  <button onClick={(): void => {
                    setShowContextMenu(false);
                    setIsConnecting(true);
                    setConnectionStart(props.selectedNode.getter());
                  }}>
                    Add connection
                  </button>
                  <button onClick={(): void => deleteNode(props.selectedNode.getter()!.id)}>
                    Delete Node
                  </button>
                </Match>
                <Match when={!props.selectedNode.getter()}>
                  <button onClick={(): void => {
                    setShowContextMenu(false);
                    props.addNewPerson(contextMenuPos().x, contextMenuPos().y);
                  }}>
                    Create new person
                  </button>
                </Match>
              </Switch>
            </div>
          </Show>
      </div>
    </div>
  </>;
}