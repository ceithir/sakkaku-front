import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import logo from "./logo.png";
import styles from "./Layout.module.css";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../user/reducer";

const { Header, Content, Footer } = Layout;

const CustomLayout = ({ children }) => {
  const user = useSelector(selectUser);
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState();

  useEffect(() => {
    const getMenuKey = ({ pathname, search }) => {
      if (pathname === "/") {
        return "new_roll";
      }

      if (pathname === "/rolls" && !search) {
        return "all_rolls";
      }

      if (pathname === "/rolls" && !!user && search === `?player=${user.id}`) {
        return "my_rolls";
      }

      return pathname.substring(1, pathname.length);
    };

    setSelectedKey(getMenuKey(location));
  }, [location, user]);

  return (
    <Layout className={styles.layout}>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[selectedKey]}
          onSelect={({ key }) => setSelectedKey(key)}
        >
          <Menu.Item className={styles.logo} key="home">
            <Link to="/">
              <img alt="Logo" src={logo} />
            </Link>
          </Menu.Item>
          <Menu.Item key="new_roll">
            <Link to="/">Roll</Link>
          </Menu.Item>
          <Menu.Item key="all_rolls">
            <Link to="/rolls">All rolls</Link>
          </Menu.Item>
          {user && (
            <Menu.Item key="my_rolls">
              <Link to={`/rolls?player=${user.id}`}>My rolls</Link>
            </Menu.Item>
          )}
          <Menu.Item key="heritage">
            <Link to="/heritage">Heritage</Link>
          </Menu.Item>
          <Menu.Item className={styles.login}>
            {user ? (
              <a href="/user/profile">{user.name}</a>
            ) : (
              <a href="/login">Login</a>
            )}
          </Menu.Item>
        </Menu>
      </Header>
      <Content>{children}</Content>
      <Footer className={styles.footer}>
        {`Sakkaku Project / 2020 / `}
        <a href="mailto:contact.sakkaku@gmail.com">Issue? Suggestion?</a>
      </Footer>
    </Layout>
  );
};

export default CustomLayout;
