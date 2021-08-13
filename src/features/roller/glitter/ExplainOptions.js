import React from "react";
import styles from "./ExplainOptions.module.less";

const ExplainOptions = ({ options, description }) => {
  return (
    <div className={styles.container}>
      {description && <p>{description}</p>}
      {!!options?.length && (
        <dl>
          {options.map(({ label, description }) => {
            return (
              <React.Fragment key={label}>
                <dt>{label}</dt>
                <dd>{description}</dd>
              </React.Fragment>
            );
          })}
        </dl>
      )}
    </div>
  );
};

export default ExplainOptions;
