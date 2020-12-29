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
}) => {
  const buttonLayout = {
    labelCol: { span: 0 },
    wrapperCol: { span: 16, offset: 8 },
  };

  return (
    <>
      {fields.map((field) => (
        <Form.Item required={false} key={field.key} label={labelText}>
          <Form.Item {...field} noStyle>
            <UncontrolledDiceSideSelector
              initialValue={defaultValue}
              button={
                <div
                  className={classNames(
                    "ant-radio-button-wrapper",
                    styles["pseudo-radio"]
                  )}
                  onClick={() => remove(field.name)}
                >
                  <MinusCircleOutlined className={"dynamic-delete-button"} />
                </div>
              }
            />
          </Form.Item>
        </Form.Item>
      ))}
      <Form.Item {...buttonLayout}>
        <Button
          type="dashed"
          onClick={() => add(defaultValue)}
          icon={<PlusOutlined />}
        >
          {buttonText}
        </Button>
        <Form.ErrorList errors={errors} />
      </Form.Item>
    </>
  );
};

export default DynamicDiceSelector;
