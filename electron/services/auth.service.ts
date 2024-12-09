import { BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

import * as Config from '../config.json';

export function authService(
    browserWindow: BrowserWindow
) {
    /**
     * LOGIN
     * */
    ipcMain.on('auth:login', (e: IpcMainEvent, item: {
        email: string;
        password: string;
    }): void => {
        const requestBody = {
            email: item.email,
            password: item.password
        };

        fetch(`${Config.API}/user/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => res.json())
            .then((res: any): void => {
                browserWindow.webContents.send('authentication', {
                    action: 'login',
                    response: res
                });
            });
    });

    /**
     * REGISTER
     * */
    ipcMain.on('auth:register', (e: IpcMainEvent, item: {
        email: string;
        username: string;
        password: string;
        passwordAgain: string;
    }): void => {
        const requestBody = {
            email: item.email,
            username: item.username,
            password: item.password,
            passwordAgain: item.passwordAgain
        };

        fetch(`${Config.API}/user/register`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
            .then(res => res.json())
            .then((res: any): void => {
                browserWindow.webContents.send('authentication', {
                    action: 'register',
                    response: res
                });
            });
    });

    /**
     * LOGOUT
     * */
    ipcMain.on('auth:logout', (e: IpcMainEvent, item: {
        token: string;
    }): void => {
       fetch(`${Config.API}/user/logout`, {
           method: 'POST',
           headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${item.token}`
           }
       })
           .then(res => res.json())
           .then((res: any): void => {
               browserWindow.webContents.send('authentication', {
                   action: 'logout',
                   response: res
               });
           })
    });

    /**
     * MYSELF
     * */
    ipcMain.on('auth:myself', (e: IpcMainEvent, item: {
        token: string;
    }): void => {
        fetch(`${Config.API}/user/myself`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${item.token}`
            }
        })
            .then(res => res.json())
            .then((res: any): void => {
                browserWindow.webContents.send('authentication', {
                    action: 'myself',
                    response: res
                });
            })
    });
}