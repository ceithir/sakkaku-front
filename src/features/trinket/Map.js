import React, { useState } from "react";
import styles from "./Map.module.less";
import mapData from "./map-data";
import { AutoComplete, Typography } from "antd";
import ScrollContainer from "react-indiana-drag-scroll";

const { Text } = Typography;

const Search = () => {
  const [search, setSearch] = useState();

  return (
    <div className={styles.search}>
      <AutoComplete
        options={mapData.map(({ label }) => {
          return { value: label };
        })}
        placeholder={`Search location`}
        onChange={(value) => {
          setSearch(mapData.find(({ label }) => label === value));
        }}
        filterOption={true}
        allowClear={true}
      />
      {search && (
        <Text
          strong={true}
        >{`${search.label}: x${search.x} / y${search.y}`}</Text>
      )}
    </div>
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
      <Search />
      <ScrollContainer
        className={styles["scroll-container"]}
        hideScrollbars={false}
      >
        <img src={url} alt="Rokugan map (5th ed)" />
      </ScrollContainer>
    </div>
  );
};

export default Map;
