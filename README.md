# JuicySoup

Dies ist der Code für das Spiel, das im Rahmen des Informatikunterrichts entwickelt werden soll.

- Programmiersprache: JavaScript/NodeJS
- Frontend
  - Bibliothek: p5.js
  - Bundler: webpack
- Backend
  - Framework: Express.js

## How to Build

Dependencies:

- Node/npm
- MongoDB (nur für Server)

`server/config/database.js` erstellen, folgenden Code einfügen und ggf. Anmeldedaten einfügen.

```js
module.exports = {
  database: "mongodb://localhost:27017/juicy_soup"
};
```

Diese Befehle in den entsprechenden Ordnern ausführen:

```bash
cd server
npm i
npm start

cd web
npm i
npm start
```
