import React from "react";
import BaseBreadcrump from "../navigation/Breadcrumb";

const Breadcrumb = ({ character, campaign }) => {
  if (!character) {
    return null;
  }

  return (
    <BaseBreadcrump
      character={character}
      campaign={campaign}
      description={`Heritage`}
    />
  );
};

export default Breadcrumb;
