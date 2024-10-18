import { JSX, For, createSignal, Accessor, onMount } from "solid-js";

import style from './folderView.module.css';

export default function(): JSX.Element {
  const [trees, setTrees] = createSignal([] as {
    name: string;
    lastModified: string;
  }[]);

  onMount((): void => {
    setTrees([
      {
        name: 'Kukk Fa',
        lastModified: '1 egy almafa'
      },
      {
        name: 'Szűcs Fa',
        lastModified: 'kettő, két katica'
      },
      {
        name: 'Regenye Fa',
        lastModified: 'három, három kis malac'
      },
      {
        name: 'Péter Fa',
        lastModified: 'egy kettő három'
      },
      {
        name: 'Gergely Fa',
        lastModified: 'Soha'
      },
      {
        name: 'Tamás Fa',
        lastModified: 'Lorem ipsum'
      },
      {
        name: 'Valamilyen Fa',
        lastModified: '234234'
      },
      {
        name: 'Jó Fa',
        lastModified: 'Passz'
      },
      {
        name: 'Rossz Fa',
        lastModified: 'Valamikor'
      },
    ])
  });

  const openTree = (treeIdentifier: string): void => {

  }

  return <>
    <div id='folderView' class={style.folder}>
        <div class={style.topSection}>
            <h3>A fáid</h3>
        </div>
        <div class={style.bottomSection}>
            <div class={style.scrollView}>
                <For each={trees()}>
                  {(tree, index: Accessor<number>) => {
                    return <>
                      <div class={style.card} id={`tree_${index()}`}>
                        <h2>{tree.name}</h2>
                        <p>
                          <strong>Utoljára módosítva:</strong>&nbsp;{tree.lastModified}
                        </p>
                        <button class={style.btnOpenTree} onClick={(): void => {
                          openTree(tree.name);
                        }}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="width: 32px;height: 32px;">
                            <path d="M217.9 105.9L340.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L217.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1L32 320c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM352 416l64 0c17.7 0 32-14.3 32-32l0-256c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32l64 0c53 0 96 43 96 96l0 256c0 53-43 96-96 96l-64 0c-17.7 0-32-14.3-32-32s14.3-32 32-32z"></path>
                          </svg>
                        </button>
                      </div>
                    </>;
                  }}
                </For>
            </div>
        </div>
    </div>
  </>;
};
