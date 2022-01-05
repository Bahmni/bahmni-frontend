# Bahmni Frontend

This is a [Lerna](https://lerna.js.org/) project containing bahmni applications. This package handles the following

-  [@bahmni/design-system](packages/bahmni-design-system)

## Repository Development
### Prerequisites

- [Node](https://nodejs.org/en/download)
- yarn ```sh npm install yarn -g ```
### Getting started

To install and setup the repository once cloned just use the following command

```sh
yarn setup
```

To start all applications (very resource intensive)
```sh
yarn start
```

> Run test for all applications
```sh
yarn test
```

> Run test all test across applications in parallel
```sh
yarn test:parallel
```

> Run test for a given application
```sh
yarn test --scope bahmni-medication-app
```
Note: you can always go inside the application and just do `yarn test`


#### Running nginx container to expose MF's
```
docker build -t bahmni-frontend .
docker run -d -p 8090:80 -p 443:443 --name bahmni-frontend bahmni-frontend
```

```

├── ...
├── application             # micro frontend
│   ├── services            # api wrapper functions
│       ├── api_nameOrConcept.ts
|   |── components
│       ├── SomeresuseComponent.tsx
│   ├── ComponentName e.g. PrescirptionDialog
│       ├── ComponentName.tsx     # Parent component  PrescriptionDialog.tsx
│       ├── ChildComponent.tsx     # Child component
│       ├── index.tsx             # export the component
│       ├── component.test.tsx  # we could also use different file names e.g. drugs-search.test.tsx
│       ├── __tests__        #conditional if having snapshot / more test files
│       ├── types.d.ts      # We could also use concept names
│       ├── messsages.ts    # making localization more fluent
│   ├── AnotherComponent
│       ├── ...
│   └── ...                 # and so on...
│   ├── types
│       ├── someCommonTypes.d.ts
│   ├── locales
│       ├── en
│         ├── translation.json
│       ├── de
│         ├── translation.json
│       ├── ...
│   ├── context
│       ├── someContext.tsx   # Only when sharing state is required
│   ├── index.tsx             
|   ├── __tests__        #conditional if having snapshot / more test files
|   ├── application.test.tsx  
│   ├── babel, jest, package.json, tsconfig.json, webpack
└── ...
```

---