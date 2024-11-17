import {BrowserWindow, ipcMain, IpcMainEvent} from "electron";
import * as Config from '../config.json';

export function peopleService(
  browserWindow: BrowserWindow
) {
  /**
   * Get People for Tree
   * */
  ipcMain.on('people:getPeopleForTree', (e: IpcMainEvent, item: {
    token: string;
    treeId: number;
  }): void => {
    fetch(`${Config.API}/people/${item.treeId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${item.token}`
      },
    })
        .then(res => res.json())
        .then((res: any) => {
          browserWindow.webContents.send('people', {
            action: 'getPeopleForTree',
            response: res
          });
        });
  });

  /**
   * Add people
   * */
  ipcMain.on('people:addPeople', (e: IpcMainEvent, item: {
    token: string;
    people: any;
  }): void => {
    item.people.forEach((person: any): void => {
      // Add person to db
      fetch(`${Config.API}/people/create`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${item.token}`
        },
        body: JSON.stringify({
          id: person.id,
          firstName: person.firstName || "",
          lastName: person.lastName || "",
          nickName: person.nickName || "",
          title: person.title || "",
          gender: person.gender || null,
          birthDate: person.birthDate || null,
          deathDate: person.deathDate || null,
          description: person.description || "",
          treeId: person.treeId,
        })
      })
          .then(res => res.json())
          .then((res: any): void => {
            // Add addresses to db
            person.addresses.forEach((address: any): void => {
              fetch(`${Config.API}/addresses/create/${person.id}`, {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${item.token}`
                },
                body: JSON.stringify({
                  addressType: address.addressType || 'residence',
                  country: address.country || '',
                  postalCode: address.postalCode || '',
                  city: address.city || '',
                  street: address.street || '',
                  door: address.door || '',
                })
              })
                  .then(res => res.json())
                  .then((res: any): void => {
                    browserWindow.webContents.send('people', {
                      action: 'addressAdded',
                      response: res
                    });
                  })
            });

            browserWindow.webContents.send('people', {
              action: 'addPeople',
              response: res
            });
          });
    });
  });

  /**
   * Delete people
   * */
  ipcMain.on('people:deletePeople', (e: IpcMainEvent, item: {
    token: string;
    people: any;
  }): void => {
    item.people.forEach((person: any): void => {
      // Remove person from db
      fetch(`${Config.API}/people/${person.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${item.token}`
        }
      })
          .then(res => res.json())
          .then((res: any): void => {
            browserWindow.webContents.send('people', {
              action: 'deletePeople',
              response: res
            });
          });
    });
  });
}