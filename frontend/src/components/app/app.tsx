import type { JSX } from 'solid-js';

import styles from './app.module.css';

export default function(): JSX.Element {
  return (
    <div class={styles.App}>
      <header class={styles.header}>
        <h1>Hello world!</h1>
      </header>
    </div>
  );
};
