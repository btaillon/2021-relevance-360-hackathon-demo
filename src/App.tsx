import "./App.scss";
import React, { useEffect } from "react";
import SearchPage from "./Components/SearchPage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { initializeHeadlessEngine } from "./common/Engine";
import { SearchEngine } from "@coveo/headless";

export default function App() {
  return (
    <Router>
      <GuardedRoute />
    </Router>
  );
}

const GuardedRoute = () => {
  const isEnvValid = () => {
    const variables = [
      "REACT_APP_PLATFORM_URL",
      "REACT_APP_ORGANIZATION_ID",
      "REACT_APP_API_KEY",
      "REACT_APP_USER_EMAIL",
      "REACT_APP_SERVER_PORT",
    ];
    const reducer = (previousValue: boolean, currentValue: string) =>
      previousValue && Boolean(process.env[currentValue]);
    return variables.reduce(reducer, true);
  };

  return (
    <Route render={() => (isEnvValid() === true ? <Home /> : <Error />)} />
  );
};

const Home = () => {
  const [engine, setEngine] = React.useState<SearchEngine | null>(null);

  useEffect(() => {
    initializeHeadlessEngine().then((engine) => {
      setEngine(engine);
    });
  }, []);

  if (engine) {
    return (
      <div className="App">{engine && <SearchPage engine={engine} />}</div>
    );
  } else {
    return <div>Waiting for engine</div>;
  }
};

const Error = () => {
  return (
    <div className="container">
      <h1>Invalid Environment variables</h1>
      <p>
        You should have a valid <code>.env</code> file at the root of this
        project. You can use <code>.env.example</code> as starting point and
        make sure to replace all placeholder variables
        <code>&#60;...&#62;</code> by the proper information for your
        organization.
      </p>
      <p>
        Refer to the project <b>README</b> file for more information.
      </p>
    </div>
  );
};
