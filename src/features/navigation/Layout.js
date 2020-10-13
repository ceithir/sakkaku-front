import React from "react";
import { Layout, Menu } from "antd";
import logo from "./logo.png";
import styles from "./Layout.module.css";
import { Link } from "react-router-dom";

const { Header, Content, Footer } = Layout;

const CustomLayout = ({ user, children }) => {
  return (
    <Layout className={styles.layout}>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item className={styles.logo}>
            <Link to="/">
              <img alt="Logo" src={logo} />
            </Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/">Roll</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="/rolls">All rolls</Link>
          </Menu.Item>
          {user && (
            <Menu.Item>
              <Link to={`/rolls?player=${user.id}`}>My rolls</Link>
            </Menu.Item>
          )}
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
