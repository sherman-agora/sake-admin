<p align='center'>
<b style="font-size:30px">Petgo ERP Admin</b><br>
</p>

> This project is using [React-Admin](https://marmelab.com/react-admin/) framework with graphql backend

## How to start

install
---
`npm install`

Start
---
`npm start`

## Available Scripts

In the project directory, you can run:

#### Install all packages `npm install`
#### Start web `npm start`

>It will start the web application in development mode at [http://localhost:3000](http://localhost:3000).

#### Build `npm run build`

#### Deploy to google cloud `npm run deploy`

> Note: you need to login with gcloud first.

## Folder
---

```bash
├── 📦src
│   ├── 📂components  //root components
│   ├── 📂containers //custom container page
│   ├── 📂dataProvider //handle connecting backend
│   ├── 📂graphql //graphql client
│   ├── 📂i18n
│   ├── 📂pages //custom page
│   ├── 📂redux 
│   ├── 📂resources //react-admin resources
│   ├── 📂utils //custom utils
│   ├── 📜App.css
│   ├── 📜App.js //start server
│   ├── 📜App.test.js
│   ├── 📜body.css
│   ├── 📜i18nProvider.js
│   ├── 📜index.css
│   ├── 📜index.js
│   ├── 📜logo.svg
│   ├── 📜routes.js //custom routes
│   ├── 📜serviceWorker.js
├── 📜app.yaml //google cloud deployment file
├── 📜package.json //manage packages
```