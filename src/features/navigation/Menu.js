import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import styles from "./Menu.module.css";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../user/reducer";
import logo150 from "./logo-150.png";
import logo100 from "./logo-100.png";
import logo50 from "./logo-50.png";

const CustomMenu = () => {
  const user = useSelector(selectUser);
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState();

  useEffect(() => {
    const getMenuKey = ({ pathname, search }) => {
      if (pathname === "/") {
        return "home";
      }

      if (["/roll", "/heritage", "/probabilities"].includes(pathname)) {
        return "ffg";
      }

      if (["roll-d10"].includes(pathname)) {
        return "aeg";
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
      <Menu.Item key="ffg">
        <Link to="/roll">{`L5R – FFG`}</Link>
      </Menu.Item>
      <Menu.Item key="aeg">
        <Link to="/roll-d10">{`L5R – AEG`}</Link>
      </Menu.Item>
      <Menu.Item key="all_rolls">
        <Link to="/rolls">All rolls</Link>
      </Menu.Item>
      {user && (
        <Menu.Item key="my_rolls" className={styles["sm-hide"]}>
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
  );
};

export default CustomMenu;
