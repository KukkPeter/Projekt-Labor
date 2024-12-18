import {JSX} from "solid-js";

import Navbar from "../../components/navbar/navbar";
import FolderView from "../../components/folderView/folderView";

import { Pages } from "../../interfaces/pages.interface";

export default function(): JSX.Element {
  return <>
    <div id='home'>
      <Navbar page={Pages.Home} />
      <FolderView />
    </div>
  </>;
};
