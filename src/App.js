import React, { useEffect } from "react";
import "./App.less";
import { StandardRoller, AdvancedRoller } from "./features/roller";
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
import FfgSubmenu from "features/navigation/FfgSubmenu";
import D10Roller from "features/d10/D10Roller";
import D10IdentifiedRoll from "features/d10/D10IdentifiedRoll";
import AegSubmenu from "features/navigation/AegSubmenu";

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
          <Route path="/resources/rokugan-map" exact>
            <Map />
          </Route>
          <Route path="/probabilities" exact>
            <FfgSubmenu />
            <Calculator />
          </Route>
          <Route path="/heritage/:uuid" exact>
            <HeritageRollLoader />
          </Route>
          <Route path="/heritage" exact>
            <FfgSubmenu />
            <AnonymousAlertWrapper>
              <HeritageRoll />
            </AnonymousAlertWrapper>
          </Route>
          <Route path="/rolls/:id" exact>
            <IdentifiedRoll />
          </Route>
          <Route path="/rolls" exact>
            <List />
            <Search />
          </Route>
          <Route path="/roll-advanced" exact>
            <FfgSubmenu />
            <AnonymousAlertWrapper>
              <AdvancedRoller />
            </AnonymousAlertWrapper>
          </Route>
          <Route path="/d10-rolls/:id" exact>
            <D10IdentifiedRoll />
          </Route>
          <Route path="/roll-d10" exact>
            <AegSubmenu />
            <AnonymousAlertWrapper>
              <D10Roller />
            </AnonymousAlertWrapper>
          </Route>
          <Route path="/roll" exact>
            <FfgSubmenu />
            <AnonymousAlertWrapper>
              <StandardRoller />
            </AnonymousAlertWrapper>
          </Route>
          <Route path="/" exact>
            <Homepage />
          </Route>
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
