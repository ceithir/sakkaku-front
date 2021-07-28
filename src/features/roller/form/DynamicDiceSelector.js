import React from "react";
import { Form, Button } from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { UncontrolledDiceSideSelector } from "../DiceSideSelector";
import classNames from "classnames";
import styles from "./DynamicDiceSelector.module.css";

const DynamicDiceSelector = ({
  fields,
  labelText,
  defaultValue,
  buttonText,
  errors,
  add,
  remove,
  values = [],
  facets,
  className,
}) => {
  return (
    <div className={className}>
      <Form.Item>
        <Button
          type="dashed"
          onClick={() => add(defaultValue)}
          icon={<PlusOutlined />}
        >
          {buttonText}
        </Button>
        <Form.ErrorList errors={errors} />
      </Form.Item>
      {fields.map((field, index) => (
        <Form.Item required={false} key={field.key} label={labelText}>
          <Form.Item {...field} noStyle>
            <UncontrolledDiceSideSelector
              initialValue={values[index] || defaultValue}
              button={
                !!remove && (
                  <div
                    className={classNames(
                      "ant-radio-button-wrapper",
                      styles["pseudo-radio"]
                    )}
                    onClick={() => remove(field.name)}
                  >
                    <MinusCircleOutlined className={"dynamic-delete-button"} />
                  </div>
                )
              }
              facets={facets}
            />
          </Form.Item>
        </Form.Item>
      ))}
    </div>
  );
};

export default DynamicDiceSelector;
