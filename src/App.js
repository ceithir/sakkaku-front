import React, { useEffect, useState } from "react";
import "./App.css";
import Roller from "./features/roller";
import Layout from "./features/navigation/Layout";
import { getOnServer } from "./server";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import List from "./features/browse/List";

const App = () => {
  const [user, setUser] = useState();
  useEffect(() => {
    getOnServer({
      uri: "/user",
      success: (data) => {
        setUser(data);
      },
      error: (_) => {},
    });
  }, []);

  return (
    <Router>
      <Layout user={user}>
        <Switch>
          <Route path="/rolls">
            <List />
          </Route>
          <Route path="/">
            <Roller user={user} />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
