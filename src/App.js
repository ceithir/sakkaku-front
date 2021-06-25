import React, { useEffect, Suspense, lazy } from "react";
import "./App.less";
import Layout from "./features/navigation/Layout";
import { getOnServer } from "./server";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "./features/user/reducer";
import Loader from "./features/navigation/Loader";

const Roller = lazy(() => import("./features/roller"));
const List = lazy(() => import("./features/browse/List"));
const IdentifiedRoll = lazy(() => import("./features/roller/IdentifiedRoll"));
const HeritageRoll = lazy(() => import("./features/heritage/Roll"));
const HeritageRollLoader = lazy(() => import("./features/heritage/RollLoader"));
const HeritageListLoader = lazy(() => import("./features/heritage/ListLoader"));
const Calculator = lazy(() => import("./features/probabilities/Calculator"));

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
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route path="/probabilities">
              <Calculator />
            </Route>
            <Route path="/heritage/list">
              <HeritageListLoader />
            </Route>
            <Route path="/heritage/:uuid">
              <HeritageRollLoader />
            </Route>
            <Route path="/heritage">
              <HeritageRoll />
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
        </Suspense>
      </Layout>
    </Router>
  );
};

export default App;
