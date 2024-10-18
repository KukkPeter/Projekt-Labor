import { JSX } from "solid-js";

import Navbar from "../../components/navbar/navbar";
import { Pages } from "../../interfaces/pages.interface";

export default function(): JSX.Element {
    return <>
        <div id='editor'>
            <Navbar page={Pages.Editor} />
        </div>
    </>;
};
