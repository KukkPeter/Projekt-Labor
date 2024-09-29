import type { JSX } from 'solid-js';

import styles from './app.module.css';
import Login from '../login/login';
import Register from '../register/register';

export default function(): JSX.Element {
  return (
    <Register></Register>
  );
};
