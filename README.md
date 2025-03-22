# A Weather App based on 7timer.info weather api

This app was an assessment from Shoreline Wind for the position of Lead Technical Developer

The assignment was delivered in the early weeks of September 2023, and helped me secure the position.

Since then, I've maintained the project, done some refactoring and added new things to it. To keep myself sharp.

## Available Scripts

In the project directory, you can run:

```bash
yarn
```

installs all dependencies.

```bash
yarn lint
```

Checks for linting errors.

```bash
yarn lint:fix`
```

Fixes linting errors.

```bash
yarn test
```

Runs unit tests.

```bash
yarn test:e2e
```

Run end to end tests.

After that, you can run:

```bash
yarn start
```

Runs the app in the development mode.\
Open [http://localhost:5173](http://localhost:5173/) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Changelog

23.03.2025:

- Upgraded packages and setup to use the latest versions
- Refactoring. Moved the api calls to their own file called api.ts
- Added a better tooltip to the 5 day forecast
- Made minor UI changes to the sidebar
- Added lint checks
- Added tests

## To-Do list:

- Add a text to the spinner that says something like "Please wait while we fetch the weather data"
- Add a header the displays the users location along with some other information. Perhaps information about the current day, quote of the day, fun fact of the day etc. Could be fun to play around with
- Add a footer that displays rights and contact information for myself
