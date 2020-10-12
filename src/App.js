import React from "react";
import "./App.css";
import Roller from "./features/roller";
import Layout from "./features/navigation/Layout";

const App = () => {
  return (
    <Layout>
      <Roller />
    </Layout>
  );
};

export default App;
