# API structure

[![CodeQL Advanced](https://github.com/ChewBaccaYeti/DS_API/actions/workflows/codeql.yml/badge.svg?branch=main)](https://github.com/ChewBaccaYeti/DS_API/actions/workflows/codeql.yml)

## Architecture

Flow Process

```mermaid
flowchart TB
    subgraph startup [Server Startup]
        dotenv[dotenv.config] -->|loads| envVars[".env vars <br/> ADMIN, PASS, CONN, DB, PORT"]
        envVars -->|validates| check{vars defined?}
        check -->|no| throw[throw Error]
        check -->|yes| mongoConnect
    end

    subgraph connection [MongoDB Connection]
        mongoConnect[mongoose.connect <br/> mongodb+srv://] -->|.then| success[Connection successful]
        mongoConnect -->|.catch| fail[Log error]
        success -->|await| logAllData[logAllData]
    end

    subgraph fetching [Fetching Crew Data]
        logAllData -->|getMiners| miners[Miner.find]
        logAllData -->|getEngineers| engineers[Engineer.find]
        logAllData -->|getScientists| scientists[Scientist.find]
        miners --> log[Winston log <br/> Crew Data Summary]
        engineers --> log
        scientists --> log
    end

    subgraph pipeline [Express Pipeline]
        log -->|app.listen| server[Server on PORT]
        server --> pipe[pipe / Express]
        pipe --> helmet[Helmet / Security]
        pipe --> cors[CORS]
        pipe --> rateLimit[Rate Limiter]
        pipe --> compression[Compression]
        pipe --> router["/api Router"]
    end

    subgraph routes [API Routes]
        router --> minersRoute[GET /api/miners]
        router --> engineersRoute[GET /api/engineers]
        router --> scientistsRoute[GET /api/scientists]
    end

    subgraph frontend ["Frontend / Hub.tsx"]
        hub[Hub Component] --> navMiners["/miners"]
        hub --> navEngineers["/engineers"]
        hub --> navScientists["/scientists"]
        navMiners -->|fetch| minersRoute
        navEngineers -->|fetch| engineersRoute
        navScientists -->|fetch| scientistsRoute
    end
```

entityRelations

```mermaid
erDiagram
    ENGINEER }|--|| CEC_SCHEMA : "uses"
    MINER }|--|| CEC_SCHEMA : "uses"
    SCIENTIST }|--|| CEC_SCHEMA : "uses"

    CEC_SCHEMA ||--o{ CERTIFICATION : "has"
    CEC_SCHEMA ||--o{ EQUIPMENT : "carries"
    CEC_SCHEMA ||--o{ LAST_MISSION : "completed"
    CEC_SCHEMA ||--|| ROLE : "assigned"
    CEC_SCHEMA ||--|| EXPERIENCE : "accumulated"

    CEC_SCHEMA {
        string name "required"
        string avatar "required"
        string species "required"
        string citizenship "required"
        number rank "required, min: 0"
        string directive "required"
        string id "required"
        date birthdate "required"
        boolean activeStatus "required"
    }
    ROLE {
        string name "required"
        string symbol "required"
    }
    EXPERIENCE {
        number years "required"
        stringArray skills "required"
    }
    CERTIFICATION {
        string title "required"
        date dateObtained "required"
    }
    EQUIPMENT {
        string name "required"
        string type "required"
        date acquired "required"
    }
    LAST_MISSION {
        string missionName
        date completedDate
    }
    ENGINEER {
        string collection "Engineers"
    }
    MINER {
        string collection "Miners"
    }
    SCIENTIST {
        string collection "Scientists"
    }
```

`Below you can find default description of CRA`

## Getting Started with Create React App

This project was bootstrapped with
[Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about
[running tests](https://facebook.github.io/create-react-app/docs/running-tests)
for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the
best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can
`eject` at any time. This command will remove the single build dependency from
your project.

Instead, it will copy all the configuration files and the transitive
dependencies (webpack, Babel, ESLint, etc) right into your project so you have
full control over them. All of the commands except `eject` will still work, but
they will point to the copied scripts so you can tweak them. At this point
you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for
small and middle deployments, and you shouldn't feel obligated to use this
feature. However we understand that this tool wouldn't be useful if you couldn't
customize it when you are ready for it.

## Learn More

You can learn more in the
[Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here:
[https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here:
[https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here:
[https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here:
[https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here:
[https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here:
[https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
