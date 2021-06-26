import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import styles from "./Menu.module.css";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../user/reducer";
import logo150 from "./logo-150.png";
import logo100 from "./logo-100.png";
import logo50 from "./logo-50.png";

const { SubMenu } = Menu;

const CustomMenu = () => {
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
    <Menu
      theme="dark"
      mode="horizontal"
      selectedKeys={[selectedKey]}
      onSelect={({ key }) => setSelectedKey(key)}
      className={styles.menu}
    >
      <Menu.Item className={styles.logo} key="home">
        <Link to="/">
          <img
            alt="Logo"
            src={logo50}
            width="50"
            height="50"
            srcSet={`${logo50}, ${logo100} 2x, ${logo150} 3x`}
          />
        </Link>
      </Menu.Item>
      <Menu.Item key="new_roll">
        <Link to="/">Roll</Link>
      </Menu.Item>
      <Menu.Item key="all_rolls" className={styles["sm-hide"]}>
        <Link to="/rolls">All rolls</Link>
      </Menu.Item>
      {user && (
        <Menu.Item key="my_rolls" className={styles["sm-hide"]}>
          <Link to={`/rolls?player=${user.id}`}>My rolls</Link>
        </Menu.Item>
      )}
      <Menu.Item key="heritage" className={styles["sm-hide"]}>
        <Link to="/heritage">Heritage</Link>
      </Menu.Item>
      <Menu.Item key="probabilities" className={styles["sm-hide"]}>
        <Link to="/probabilities">{`Probabilities`}</Link>
      </Menu.Item>
      <SubMenu
        key="plus"
        title={`...`}
        className={styles["sm-only"]}
        popupOffset={[0, 0]}
      >
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
        <Menu.Item key="probabilities">
          <Link to="/probabilities">{`Probabilities`}</Link>
        </Menu.Item>
      </SubMenu>
      <Menu.Item className={styles.login}>
        {user ? (
          <a href="/user/profile">{user.name}</a>
        ) : (
          <a href="/login">Login</a>
        )}
      </Menu.Item>
    </Menu>
  );
};

export default CustomMenu;
