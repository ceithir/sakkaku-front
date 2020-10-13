import React from "react";
import opportunityImage from "./images/opportunity.png";
import strifeImage from "./images/strife.png";
import successImage from "./images/success.png";
import styles from "./Result.module.css";

const Result = ({ opportunity, success, strife }) => {
  return (
    <span className={styles.result}>
      <img src={successImage} title="Success" alt="Success" />
      {`: ${success}, `}
      <img src={opportunityImage} title="Opportunity" alt="Opportunity" />
      {`: ${opportunity}, `}
      <img src={strifeImage} title="Strife" alt="Strife" />
      {`: ${strife}`}
    </span>
  );
};

export default Result;
