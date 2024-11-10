import {Accessor, JSX, Setter, useContext} from "solid-js";

import style from './customizeBar.module.css';

import { ApplicationService } from "../../services/application.service";
import { DIContextProvider } from "../../services/context-provider";
import { Theme } from "../canvas/types";

export default function(props: {
  snapToGrid: {
    getter: Accessor<boolean>,
    setter: Setter<boolean>
  },
  gridSize: {
    getter: Accessor<number>,
    setter: Setter<number>
  },
  theme: {
    getter: Accessor<Theme>,
    setter: Setter<Theme>
  },
  searchTerm: {
    getter: Accessor<string>,
    setter: Setter<string>
  },
  saveTree: () => void
}): JSX.Element {
  const app: ApplicationService = useContext(DIContextProvider)!.resolve(ApplicationService);

  const saveChanges = (): void => {
    if(confirm('Are you certain you want to save the changes?\nThis will replace the previous version!')) {
      props.saveTree();
    }
  }

  const deleteTree = (): void => {
    if(confirm('Are you certain you want to remove this tree?\nThis action cannot be reversed!')) {
      app.deleteTree();
    }
  }

  return <>
    <div class={style.customizeBar}>
      <div class={style.optionsMenu}>
        <div class={style.title}>
          <h2>Customize display</h2>
        </div>
        <div class={style.options}>

          <label class={style.option}>
            <p>Snap to grid</p>
            <input
              type="checkbox"
              id="snapToGrid"
              checked={props.snapToGrid.getter()}
              onChange={(e) => props.snapToGrid.setter(e.target.checked)}
            />
          </label>

          <label class={style.option}>
            <p>Grid Size</p>
            <input
              type="number"
              id="size"
              value={props.gridSize.getter()}
              min={1}
              max={100}
              onInput={(e) => {
                const value = parseInt(e.target.value);
                if (value === 0) {
                  props.gridSize.setter(20);
                } else {
                  props.gridSize.setter(value)
                }
              }}
            />
          </label>

          <hr/>

          <label class={style.option}>
            <p>Node Color</p>
            <input
              type={'color'}
              id={'nodeColor'}
              value={props.theme.getter().nodeColor}
              onChange={(e) => {
                let oldValue: Theme = props.theme.getter();
                oldValue.nodeColor = e.target.value;
                props.theme.setter(oldValue)
              }}
            />
          </label>

          <label class={style.option}>
            <p>Selected Color</p>
            <input
              type={'color'}
              id={'selectedColor'}
              value={props.theme.getter().selectedColor}
              onChange={(e) => {
                let oldValue: Theme = props.theme.getter();
                oldValue.selectedColor = e.target.value;
                props.theme.setter(oldValue)
              }}
            />
          </label>

          <label class={style.option}>
            <p>Highlight Color</p>
            <input
              type={'color'}
              id={'highlightColor'}
              value={props.theme.getter().highlightColor}
              onChange={(e) => {
                let oldValue: Theme = props.theme.getter();
                oldValue.highlightColor = e.target.value;
                props.theme.setter(oldValue)
              }}
            />
          </label>

          <label class={style.option}>
            <p>Connection Color</p>
            <input
              type={'color'}
              id={'edgeColor'}
              value={props.theme.getter().edgeColor}
              onChange={(e) => {
                let oldValue: Theme = props.theme.getter();
                oldValue.edgeColor = e.target.value;
                props.theme.setter(oldValue)
              }}
            />
          </label>

          <label class={style.option}>
            <p>Background Color</p>
            <input
              type={'color'}
              id={'bgColor'}
              value={props.theme.getter().backgroundColor}
              onChange={(e) => {
                let oldValue: Theme = props.theme.getter();
                oldValue.backgroundColor = e.target.value;
                props.theme.setter(oldValue)
              }}
            />
          </label>

          <label class={style.option}>
            <p>Text Color</p>
            <input
              type={'color'}
              id={'textColor'}
              value={props.theme.getter().textColor}
              onChange={(e) => {
                let oldValue: Theme = props.theme.getter();
                oldValue.textColor = e.target.value;
                props.theme.setter(oldValue)
              }}
            />
          </label>

          <label class={style.option}>
            <p>Grid Color</p>
            <input
              type={'color'}
              id={'gridColor'}
              value={props.theme.getter().gridColor}
              onChange={(e) => {
                let oldValue: Theme = props.theme.getter();
                oldValue.gridColor = e.target.value;
                props.theme.setter(oldValue)
              }}
            />
          </label>

          <hr/>

          <label class={style.option}>
            <p>Search</p>
            <input
              type="text"
              id="searchTree"
              placeholder="Search family members..."
              value={props.searchTerm.getter()}
              onInput={(e) => props.searchTerm.setter(e.target.value)}
            />
          </label>

        </div>
      </div>
      <hr/>
      <div class={style.actionsMenu}>
        <button onClick={(): void => {
          saveChanges();
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M48 96l0 320c0 8.8 7.2 16 16 16l320 0c8.8 0 16-7.2 16-16l0-245.5c0-4.2-1.7-8.3-4.7-11.3l33.9-33.9c12 12 18.7 28.3 18.7 45.3L448 416c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l245.5 0c17 0 33.3 6.7 45.3 18.7l74.5 74.5-33.9 33.9L320.8 84.7c-.3-.3-.5-.5-.8-.8L320 184c0 13.3-10.7 24-24 24l-192 0c-13.3 0-24-10.7-24-24L80 80 64 80c-8.8 0-16 7.2-16 16zm80-16l0 80 144 0 0-80L128 80zm32 240a64 64 0 1 1 128 0 64 64 0 1 1 -128 0z"></path>
          </svg>
          <p>Save changes</p>
        </button>
        <button onClick={(): void => {
          deleteTree();
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path d="M135.2 17.7L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-7.2-14.3C307.4 6.8 296.3 0 284.2 0L163.8 0c-12.1 0-23.2 6.8-28.6 17.7zM416 128L32 128 53.2 467c1.6 25.3 22.6 45 47.9 45l245.8 0c25.3 0 46.3-19.7 47.9-45L416 128z"/>
          </svg>
          <p>Delete this tree</p>
        </button>
      </div>
    </div>
  </>;
};
