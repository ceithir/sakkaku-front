import React from "react";
import { Form, Input, Divider, AutoComplete } from "antd";
import { useSelector } from "react-redux";
import {
  selectCampaigns,
  selectCharacters,
  selectUser,
} from "features/user/reducer";

const { TextArea } = Input;

const defaultRules = [{ required: true, message: "Please fill this field" }];

const arrayToAutoCompleteOptions = (values) => {
  if (!values) {
    return undefined;
  }

  return values.map((value) => {
    return {
      value,
    };
  });
};

const UserContext = () => {
  const campaigns = useSelector(selectCampaigns);
  const characters = useSelector(selectCharacters);
  const user = useSelector(selectUser);

  if (!user) {
    return null;
  }

  return (
    <>
      <fieldset>
        <Form.Item label="Campaign" name="campaign" rules={defaultRules}>
          <AutoComplete
            options={arrayToAutoCompleteOptions(campaigns)}
            placeholder={"The Dead of Winter"}
            filterOption={true}
          />
        </Form.Item>
        <Form.Item label="Character" name="character" rules={defaultRules}>
          <AutoComplete
            options={arrayToAutoCompleteOptions(characters)}
            placeholder={"Doji Sakura"}
            filterOption={true}
          />
        </Form.Item>
      </fieldset>
      <Form.Item label="Description" name="description" rules={defaultRules}>
        <TextArea
          placeholder={"Running at the foe! Fire, Fitness, Keen Balance"}
        />
      </Form.Item>
      <Divider />
    </>
  );
};

export default UserContext;
