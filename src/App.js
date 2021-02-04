import React, { useEffect } from "react";
import "./App.css";
import Roller from "./features/roller";
import Layout from "./features/navigation/Layout";
import { getOnServer } from "./server";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import List from "./features/browse/List";
import IdentifiedRoll from "./features/roller/IdentifiedRoll";
import { useDispatch } from "react-redux";
import { setUser } from "./features/user/reducer";
import Heritage from "./features/heritage";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    getOnServer({
      uri: "/user",
      success: (data) => {
        dispatch(setUser(data));
      },
      error: (_) => {},
    });
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Switch>
          <Route path="/heritage">
            <Heritage />
          </Route>
          <Route path="/rolls/:id">
            <IdentifiedRoll />
          </Route>
          <Route path="/rolls">
            <List />
          </Route>
          <Route path="/">
            <Roller />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
