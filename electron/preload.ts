import { contextBridge, ipcRenderer } from 'electron';
import {RemoveListener, RendererOnCallback} from "./interfaces/api.interface";

const receiveMessage = (channel: string, func: RendererOnCallback): RemoveListener => {
    const subscription: RendererOnCallback = (event, ...args) => {
        // console.info('receiveMessage - channel: ', channel, ', event: ', event, ', args: ', ...args);
        return func(...args)
    };

    ipcRenderer.on(channel, subscription);

    return () => {
        ipcRenderer.removeListener(channel, subscription);
    }
};

contextBridge.exposeInMainWorld(
    'authentication', {
        login: (email: string, password: string) => {
            ipcRenderer.send('auth:login', {
                email: email,
                password: password
            });
        },
        register: (email: string, username: string, password: string, passwordAgain: string) => {
            ipcRenderer.send('auth:register', {
                email: email,
                username: username,
                password: password,
                passwordAgain: passwordAgain
            });
        },
        logout: (bearer_token: string) => {
            ipcRenderer.send('auth:logout', {
                token: bearer_token
            });
        },
        getMyself: (bearer_token: string) => {
          ipcRenderer.send('auth:myself', {
              token: bearer_token
          });
        },
        listen: (callback: RendererOnCallback): RemoveListener => {
            return receiveMessage('authentication', callback);
        }
    }
);

// You can also expose variables, not just functions
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform
});