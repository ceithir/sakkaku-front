import React, { useEffect } from "react";
import "./App.less";
import { StandardRoller, AdvancedRoller } from "./features/roller";
import Layout from "./features/navigation/Layout";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import List from "./features/browse/List";
import IdentifiedRoll from "./features/roller/IdentifiedRoll";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/reducer";
import HeritageRoll from "./features/heritage/Roll";
import HeritageRollLoader from "./features/heritage/RollLoader";
import Calculator from "./features/probabilities/Calculator";
import Homepage from "./features/navigation/Homepage";
import Map from "./features/trinket/Map";
import ScrollToTop from "./features/navigation/ScrollToTop";
import AnonymousAlertWrapper from "features/display/AnonymousAlertWrapper";
import FfgSubmenu from "features/navigation/FfgSubmenu";
import D10Roller from "features/d10/D10Roller";
import D10IdentifiedRoll from "features/d10/D10IdentifiedRoll";
import AegSubmenu from "features/navigation/AegSubmenu";
import Guided4thEdRoll from "features/d10/Guided4thEdRoll";
import ReconnectionModal from "features/user/ReconnectionModal";
import DnDRoller from "features/dnd/Roller";
import DnDRoll from "features/dnd/IdentifiedRoll";
import FFGSWRoller from "features/sw/Roller";
import FFGSWRoll from "features/sw/Roll";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    fetchUser(dispatch);
  }, [dispatch]);

  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <ReconnectionModal />
        <Switch>
          <Route path="/resources/rokugan-map" exact>
            <FfgSubmenu />
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
          <Route path="/roll-dnd" exact>
            <AnonymousAlertWrapper>
              <DnDRoller />
            </AnonymousAlertWrapper>
          </Route>
          <Route path="/dnd-rolls/:id" exact>
            <DnDRoll />
          </Route>
          <Route path="/roll-d10" exact>
            <AegSubmenu />
            <AnonymousAlertWrapper>
              <D10Roller />
            </AnonymousAlertWrapper>
          </Route>
          <Route path="/roll-d10-4th-ed" exact>
            <AegSubmenu />
            <AnonymousAlertWrapper>
              <Guided4thEdRoll />
            </AnonymousAlertWrapper>
          </Route>
          <Route path="/roll" exact>
            <FfgSubmenu />
            <AnonymousAlertWrapper>
              <StandardRoller />
            </AnonymousAlertWrapper>
          </Route>
          <Route path="/roll-ffg-sw" exact>
            <AnonymousAlertWrapper>
              <FFGSWRoller />
            </AnonymousAlertWrapper>
          </Route>
          <Route path="/ffg-sw-rolls/:id" exact>
            <FFGSWRoll />
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
