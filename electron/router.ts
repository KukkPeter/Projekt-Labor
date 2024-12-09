import {BrowserWindow} from "electron";
import {authService} from "./services/auth.service";
import {treesService} from "./services/trees.service";
import {peopleService} from "./services/people.service";

export class Router {
    public constructor(browserWindow: BrowserWindow) {
        this.route(browserWindow);
    }

    private route(iWindow: BrowserWindow) {
        authService(iWindow);
        treesService(iWindow);
        peopleService(iWindow);
    }
}