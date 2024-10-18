import {BrowserWindow} from "electron";
import {authService} from "./services/auth.service";

export class Router {
    public constructor(browserWindow: BrowserWindow) {
        this.route(browserWindow);
    }

    private route(iWindow: BrowserWindow) {
        authService(iWindow);
    }
}