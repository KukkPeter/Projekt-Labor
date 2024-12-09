import {BrowserWindow, ipcMain, IpcMainEvent} from "electron";
import * as Config from '../config.json';

export function treesService(
    browserWindow: BrowserWindow
) {
    /**
     * Get all
     * */
    ipcMain.on('trees:getTrees', (e: IpcMainEvent, item: {
        token: string;
    }): void => {
        fetch(`${Config.API}/trees`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${item.token}`
            }
        })
            .then(res => res.json())
            .then((res: any): void => {
                browserWindow.webContents.send('trees', {
                    action: 'getTrees',
                    response: res
                });
            })
    });

    /**
     * Get one
     * */
    ipcMain.on('trees:getTree', (e: IpcMainEvent, item: {
        token: string;
        treeId: number;
    }): void => {
        fetch(`${Config.API}/trees/${item.treeId}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${item.token}`
            }
        })
            .then(res => res.json())
            .then((res: any): void => {
                browserWindow.webContents.send('trees', {
                    action: 'getTree',
                    response: res
                });
            })
    });

    /**
     * Delete
     * */
    ipcMain.on('trees:deleteTree', (e: IpcMainEvent, item: {
        token: string;
        treeId: number;
    }): void => {
        fetch(`${Config.API}/trees/${item.treeId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${item.token}`
            }
        })
            .then(res => res.json())
            .then((res: any): void => {
                browserWindow.webContents.send('trees', {
                    action: 'deleteTree',
                    response: res
                });
            })
    });

    /**
     * Update
     * */
    ipcMain.on('trees:updateTree', (e: IpcMainEvent, item: {
        token: string;
        treeId: number;
        body: string
    }): void => {
        fetch(`${Config.API}/trees/update/${item.treeId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${item.token}`
            },
            body: JSON.stringify({
                newValue: item.body
            })
        })
          .then(res => res.json())
          .then((res: any): void => {
              browserWindow.webContents.send('trees', {
                  action: 'updateTree',
                  response: res
              });
          })
    });

    /**
     * Create
     * */
    ipcMain.on('trees:createTree', (e: IpcMainEvent, item: {
        token: string;
        title: string;
    }): void => {
        const requestBody = {
            title: item.title
        };

        fetch(`${Config.API}/trees/create`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${item.token}`
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => res.json())
            .then((res: any): void => {
                browserWindow.webContents.send('trees', {
                    action: 'createTree',
                    response: res
                });
            })
    });
}