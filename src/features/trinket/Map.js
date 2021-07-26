import React from "react";
import styles from "./Map.module.less";
import legend from "./map-data";
import { List } from "antd";
import ScrollContainer from "react-indiana-drag-scroll";

const Legend = () => {
  return (
    <List
      dataSource={legend.map((item, i) => {
        return { ...item, position: i + 1 };
      })}
      renderItem={({ label, x, y, position }) => (
        <List.Item>{`${position}. ${label} x${x}/y${y}`}</List.Item>
      )}
      grid={{ gutter: 12, column: 6, xs: 3, sm: 3 }}
      pagination={{
        defaultPageSize: 6,
        size: "small",
        pageSizeOptions: [6, 12, 24],
      }}
      className={styles.legend}
      size="small"
    />
  );
};

const Map = () => {
  const url = "/media/maps/rokugan-map-1800.jpg";

  return (
    <div className={styles.container}>
      <p>
        {`A simple reupload of `}
        <a href="https://craneclan.weebly.com/map-of-rokugan.html">{`Trevor Cuba (Kakita Onimaru) work`}</a>
        {` at a more web-friendly resolution. See link for details.`}
      </p>
      <ScrollContainer
        className={styles["scroll-container"]}
        hideScrollbars={false}
      >
        <img src={url} alt="Rokugan map (5th ed)" />
      </ScrollContainer>
      <Legend />
    </div>
  );
};

export default Map;
