# Projekt Labor

Ez a projekt egy ElectronJS alkalmazást és egy hozzá tartozó frontend frameworköt tartalmaz.

## Rendszerkövetelmények

- Node.js verzió: 20.14.0 vagy újabb

## Telepítés és Futtatás

Kövesse az alábbi lépéseket a projekt beállításához és futtatásához:

1. Klónozza le a projektet, majd nyissa meg a projekt mappáját.

2. Telepítse az ElectronJS package fájljait a gyökér mappában:
   ```bash
   npm install
   ```

3. Navigáljon a frontend mappába és telepítse a frontend package fájljait:
   ```bash
   cd ./frontend
   npm install
   ```

4. Buildelje ki a frontendet:
   ```bash
   npm run build
   ```

5. Térjen vissza a gyökér mappába és indítsa el az Electron alkalmazást:
   ```bash
   cd ../
   npm start
   ```

## Megjegyzések

- Győződjön meg róla, hogy a megfelelő Node.js verzió van telepítve a rendszerén.
- Ha bármilyen problémába ütközik a telepítés vagy futtatás során, ellenőrizze a hibaüzeneteket és szükség esetén frissítse a projekt package fájljait.