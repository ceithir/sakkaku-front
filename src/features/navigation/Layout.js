import React from "react";
import { Layout, Menu } from "antd";
import logo from "./logo.png";
import styles from "./Layout.module.css";

const { Header, Content, Footer } = Layout;

const CustomLayout = ({ user, children }) => {
  return (
    <Layout className={styles.layout}>
      <Header>
        <Menu theme="dark" mode="horizontal">
          <Menu.Item className={styles.logo}>
            <a href="/">
              <img alt="Logo" src={logo} />
            </a>
          </Menu.Item>
          <Menu.Item>
            <a href="/">Roll</a>
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
