import React, { useEffect, useState } from "react";
import "./App.css";
import Roller from "./features/roller";
import Layout from "./features/navigation/Layout";
import { getOnServer } from "./server";

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
    <Layout user={user}>
      <Roller />
    </Layout>
  );
};

export default App;
