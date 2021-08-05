import React, { useEffect } from "react";
import "./App.less";
import Roller from "./features/roller";
import Layout from "./features/navigation/Layout";
import { getOnServer } from "./server";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import List from "./features/browse/List";
import IdentifiedRoll from "./features/roller/IdentifiedRoll";
import { useDispatch } from "react-redux";
import { setUser } from "./features/user/reducer";
import HeritageRoll from "./features/heritage/Roll";
import HeritageRollLoader from "./features/heritage/RollLoader";
import Calculator from "./features/probabilities/Calculator";
import Homepage from "./features/navigation/Homepage";
import Search from "./features/browse/Search";
import Map from "./features/trinket/Map";
import ScrollToTop from "./features/navigation/ScrollToTop";
import AnonymousAlertWrapper from "features/display/AnonymousAlertWrapper";

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
      <ScrollToTop />
      <Layout>
        <Switch>
          <Route path="/resources/rokugan-map">
            <Map />
          </Route>
          <Route path="/probabilities">
            <Calculator />
          </Route>
          <Route path="/heritage/:uuid">
            <HeritageRollLoader />
          </Route>
          <Route path="/heritage">
            <AnonymousAlertWrapper>
              <HeritageRoll />
            </AnonymousAlertWrapper>
          </Route>
          <Route path="/rolls/:id">
            <IdentifiedRoll />
          </Route>
          <Route path="/rolls">
            <List />
            <Search />
          </Route>
          <Route path="/roll">
            <AnonymousAlertWrapper>
              <Roller />
            </AnonymousAlertWrapper>
          </Route>
          <Route path="/">
            <Homepage />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
