import { JSX } from "solid-js";

import Navbar from "../../components/navbar/navbar";
import FolderView from "../../components/folderView/folderView";

export default function(): JSX.Element {
  return <>
    <div id='home'>
      <Navbar />
      <FolderView />
    </div>
  </>;
};
