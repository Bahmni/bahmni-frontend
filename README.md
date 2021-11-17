# Bahmni App on OpenMRS 3.0

This is a [Lerna](https://lerna.js.org/) project containing bahmni applications. This package handles the following

-  [@bahmni/bahmni-patient-search-app](packages/bahmni-patient-search-app)

## Repository Development
### Prerequisites

- [Node](https://nodejs.org/en/download)
- yarn ```sh npm install yarn -g ```
### Getting started

To install and setup the repository once cloned just use the following command

```sh
npx lerna bootstrap
```

To start all applications (very resource intensive)
```sh
yarn start
```

To develop on a specific package e.g [@bahmni/bahmni-patient-search-app](packages/bahmni-patient-search-app)
```sh
npx openmrs develop --sources 'packages/bahmni-patient-search-app'
```


### Building

For building the code just run

```sh
npx lerna run build

```


### Tests

To verify that all the test run

```sh
yarn test or npm test
```