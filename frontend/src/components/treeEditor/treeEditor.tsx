import { JSX, createSignal, createEffect } from "solid-js";
import style from './treeEditor.module.css';

type DisplayOption = 'photo' | 'name' | 'nickname' | 'age' | 'birthdate' | 'birthPlace' | 'deathdate' | 'deathplace';

type DisplayOptions = {
  [key in DisplayOption]: boolean;
};

const CanvasFamilyTreeEditor = () => {
  let canvasRef!: HTMLCanvasElement;
  const [rootPerson, setRootPerson] = createSignal('');
  const [people, setPeople] = createSignal([]as any[]);
  const [relationships, setRelationships] = createSignal([]as any[]);
  const [newPerson, setNewPerson] = createSignal('');
  const [newRelationship, setNewRelationship] = createSignal({ person1: '', person2: '', type: '' });
  const [previousRoots, setPreviousRoots] = createSignal([]as any[]);

  createEffect(() => {
    if (!canvasRef) return;

    const canvas = canvasRef;
    const ctx = canvas.getContext('2d')!;
    canvas.width = 800;
    canvas.height = 500;

    const drawTree = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = '14px Arial';

      const nodeWidth = 120;
      const nodeHeight = 40;
      const horizontalSpacing = 20;
      const verticalSpacing = 80;

      const drawNode = (person: string, x: number, y: number) => {
        ctx.fillStyle = person === rootPerson() ? '#a0e1ff' : '#f0f0f0';
        ctx.fillRect(x, y, nodeWidth, nodeHeight);
        ctx.strokeRect(x, y, nodeWidth, nodeHeight);
        ctx.fillStyle = 'black';
        ctx.fillText(person, x + 5, y + 25);
        return { x, y, width: nodeWidth, height: nodeHeight };
      };

      const drawLine = (x1: number, y1: number, x2: number, y2: number, color = 'black') => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.stroke();
      };

      const getRelativesOf = (person: any, relationType: string) => {
        return relationships()
          .filter((r:any) => r.type === relationType && (r.person1 === person || r.person2 === person))
          .map((r:any) => r.person1 === person ? r.person2 : r.person1);
      };

      const getParentsOf = (person: any) => getRelativesOf(person, 'parent');
      const getSiblingsOf = (person: any) => getRelativesOf(person, 'sibling');
      const getChildrenOf = (person: any) => getRelativesOf(person, 'child');
      const getSpouseOf = (person: any) => getRelativesOf(person, 'spouse')[0] || null;

      const drawnNodes: { x: number; y: number; width: number; height: number; person: any; }[] = [];

      const drawRelatives = (person: string, centerX: number, centerY: number) => {
        const nodeInfo = drawNode(person, centerX, centerY);
        drawnNodes.push({ person, ...nodeInfo });

        const parents = getParentsOf(person);
        const siblings = getSiblingsOf(person);
        const children = getChildrenOf(person);
        const spouse = getSpouseOf(person);

        // Draw parents
        const parentStartX = centerX - ((parents.length) * (nodeWidth + horizontalSpacing) / 2);
        parents.forEach((parent, index) => {
          const x = parentStartX + (index * (nodeWidth + horizontalSpacing));
          const y = centerY - verticalSpacing;
          const parentInfo = drawNode(parent, x, y);
          drawnNodes.push({ person: parent, ...parentInfo });
          drawLine(x + nodeWidth / 2, y + nodeHeight, centerX + nodeWidth / 2, centerY, 'green');
        });

        // Draw siblings
        const siblingStartX = centerX - ((siblings.length) * (nodeWidth + horizontalSpacing) / 2);
        siblings.forEach((sibling, index) => {
          const x = siblingStartX + (index * (nodeWidth + horizontalSpacing));
          const y = centerY;
          const siblingInfo = drawNode(sibling, x, y);
          drawnNodes.push({ person: sibling, ...siblingInfo });
          drawLine(x + nodeWidth, y + nodeHeight / 2, centerX, centerY + nodeHeight / 2, 'blue');
        });

        // Draw spouse
        if (spouse) {
          const spouseX = centerX + nodeWidth + horizontalSpacing;
          const spouseInfo = drawNode(spouse, spouseX, centerY);
          drawnNodes.push({ person: spouse, ...spouseInfo });
          drawLine(centerX + nodeWidth, centerY + nodeHeight / 2, spouseX, centerY + nodeHeight / 2, 'red');
        }

        // Draw children
        const childrenStartX = centerX - ((children.length - 1) * (nodeWidth + horizontalSpacing) / 2);
        children.forEach((child, index) => {
          const x = childrenStartX + (index * (nodeWidth + horizontalSpacing));
          const y = centerY + verticalSpacing;
          const childInfo = drawNode(child, x, y);
          drawnNodes.push({ person: child, ...childInfo });
          drawLine(centerX + nodeWidth / 2, centerY + nodeHeight, x + nodeWidth / 2, y, 'green');
        });
      };

      // Draw the root person and their immediate relatives
      if (rootPerson()) {
        drawRelatives(rootPerson(), canvas.width / 2 - nodeWidth / 2, canvas.height / 2 - nodeHeight / 2);
      }

      // Draw root person's name
      ctx.fillStyle = 'black';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(`Gyökér: ${rootPerson()}`, 10, 20);

      return drawnNodes;
    };

    const drawnNodes = drawTree();

    const handleCanvasClick = (event: { clientX: number; clientY: number; }) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const clickedNode = drawnNodes.find(node => 
        x >= node.x && x <= node.x + node.width && 
        y >= node.y && y <= node.y + node.height
      );

      if (clickedNode && clickedNode.person !== rootPerson()) {
        const oldRoot = rootPerson();
        const newRoot = clickedNode.person;

        // Check if the clicked node is a parent of the current root
        const isParentOfRoot = relationships().some(r => 
          r.type === 'parent' && r.person1 === oldRoot && r.person2 === newRoot
        );

        // Check if the clicked node is a child of the current root
        const isChildOfRoot = relationships().some(r => 
          r.type === 'child' && r.person1 === oldRoot && r.person2 === newRoot
        );

        if (isParentOfRoot) {
          // Remove the old parent-child relationship
          setRelationships(prev => prev.filter(r => 
            !(r.type === 'parent' && r.person1 === oldRoot && r.person2 === newRoot)
          ));

          // Add a new child relationship from new root to old root
          setRelationships(prev => [...prev, {
            person1: newRoot,
            person2: oldRoot,
            type: 'child'
          }]);

          setPreviousRoots(prev => [...prev, oldRoot]);
        } else if (isChildOfRoot && previousRoots().includes(newRoot)) {
          // If we're going back to a previous root, restore the original relationship
          setRelationships(prev => prev.filter(r => 
            !(r.type === 'child' && r.person1 === oldRoot && r.person2 === newRoot)
          ));

          // Add back the original parent-child relationship
          setRelationships(prev => [...prev, {
            person1: newRoot,
            person2: oldRoot,
            type: 'parent'
          }]);

          setPreviousRoots(prev => prev.filter(root => root !== newRoot));
        }

        setRootPerson(newRoot);
      }
    };

    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      canvas.removeEventListener('click', handleCanvasClick);
    };
  });

  const addPerson = () => {
    if (newPerson() && !people().includes(newPerson())) {
      setPeople([...people(), newPerson()]);
      if (!rootPerson()) {
        setRootPerson(newPerson());
      }
      setNewPerson('');
    }
  };

  const addRelationship = () => {
    if (newRelationship().person1 && newRelationship().person2 && newRelationship().type) {
      setRelationships([...relationships(), newRelationship()]);
      setNewRelationship({ person1: '', person2: '', type: '' });
    }
  };

  return (
    <div class={style.familyTreeEditor}>
      <div class={style.controls}>
        <input
          type="text"
          value={newPerson()}
          onInput={(e) => setNewPerson(e.target.value)}
          placeholder="Új személy neve"
        />
        <button onClick={addPerson}>Személy hozzáadása</button>

        <select
          value={newRelationship().person1}
          onChange={(e) => setNewRelationship({...newRelationship(), person1: e.target.value})}
        >
          <option value="">Válassz személyt</option>
          {people().map(person => <option value={person}>{person}</option>)}
        </select>
        <select
          value={newRelationship().type}
          onChange={(e) => setNewRelationship({...newRelationship(), type: e.target.value})}
        >
          <option value="">Kapcsolat típusa</option>
          <option value="parent">Szülő</option>
          <option value="sibling">Testvér</option>
          <option value="child">Gyermek</option>
          <option value="spouse">Házastárs</option>
        </select>
        <select
          value={newRelationship().person2}
          onChange={(e) => setNewRelationship({...newRelationship(), person2: e.target.value})}
        >
          <option value="">Válassz személyt</option>
          {people().map(person => <option value={person}>{person}</option>)}
        </select>
        <button onClick={addRelationship}>Kapcsolat hozzáadása</button>
      </div>
      <canvas ref={canvasRef} class={style.familyTreeCanvas}></canvas>
    </div>
  );
};

export default function TreeEditor(): JSX.Element {
  const [showPersonalInfo, setShowPersonalInfo] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal('personal');
  const [displayOptions, setDisplayOptions] = createSignal<DisplayOptions>({
    photo: true,
    name: true,
    nickname: false,
    age: true,
    birthdate: true,
    birthPlace: true,
    deathdate: false,
    deathplace: false
  });

  const togglePersonalInfo = () => {
    setShowPersonalInfo(!showPersonalInfo());
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
  };

  const toggleOption = (option: DisplayOption) => {
    setDisplayOptions((prev) => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  return (
    <div class={style.treeEditor}>
      <div class={style.leftPanel}>
        <h3>Profile Panel</h3>
        <div class={style.profileSection}>
          <div class={style.profile}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/>
            </svg>
            <p>Kukk Regenye Szűcs</p>
          </div>
          <button class={style.btnLogout}>
            Kijelentkezés
          </button>
        </div>
        
        <button onClick={togglePersonalInfo} class={style.toggleButton}>
          {showPersonalInfo() ? 'Hide Personal Info' : 'Show Personal Info'}
        </button>
        
        {showPersonalInfo() && (
          <div class={style.selectedPerson}>
            <h2>selected person (Teszt Aladár)</h2>
            <div class={style.tabs}>
              <button 
                class={activeTab() === 'personal' ? style.activeTab : ''}
                onClick={() => switchTab('personal')}
              >
                Personal
              </button>
              <button 
                class={activeTab() === 'biography' ? style.activeTab : ''}
                onClick={() => switchTab('biography')}
              >
                Biography
              </button>
              <button 
                class={activeTab() === 'upload' ? style.activeTab : ''}
                onClick={() => switchTab('upload')}
              >
                Upload
              </button>
            </div>
            
            {activeTab() === 'personal' && (
              <div class={style.personalInfo}>
                <p><strong>Full name:</strong> Teszt Aladár</p>
                <p><strong>Gender:</strong> male</p>
                <p><strong>Birth place:</strong> Veszprém</p>
                <p><strong>Birth date:</strong> 2006. 09. 15.</p>
              </div>
            )}

            {activeTab() === 'biography' && (
              <div class={style.biographyInfo}>
                <p>Teszt Aladár rövid életrajza itt lesz olvasható. Ez egy példa szöveg az életrajz bemutatására.</p>
              </div>
            )}

            {activeTab() === 'upload' && (
              <div class={style.uploadInfo}>
                <p>Itt lesz lehetőség feltölteni a személyhez kapcsolódó dokumentumokat vagy képeket.</p>
              </div>
            )}
            
            <button class={style.addRelativesButton}>Click to add his relatives</button>
          </div>
        )}
        
        <button class={style.createPersonButton}>Create new person</button>
        <button class={style.addExistingButton}>Add existing person</button>


        <div class={style.bottomButtons}>
          <button class={style.deleteButton}>
            <span class={style.icon}>🗑️</span> Delete this tree
          </button>
        </div>
      </div>
      <div class={style.centerPanel}>
      <h3>Családfa Szerkesztő</h3>
      <CanvasFamilyTreeEditor />
      </div>
      
      <div class={style.rightPanel}>
        <h3>Customize display</h3>
        <div class={style.customizeTabs}>
          <button class={style.activeTab}>Personal</button>
          <button>Biography</button>
          <button>Colors</button>
          <button>Lines</button>
        </div>
        <div class={style.optionsList}>
          {(Object.keys(displayOptions()) as DisplayOption[]).map((key) => (
            <label class={style.optionItem}>
              <input
                type="checkbox"
                checked={displayOptions()[key]}
                onChange={() => toggleOption(key)}
              />
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
          ))}
        </div>
        <button class={style.clearButton}>
          <span class={style.icon}>🗑️</span> Clear
        </button>
      </div>
    </div>
  );
}