import React from "react";
import { Form, Select } from "antd";

const rings = ["Air", "Earth", "Fire", "Water", "Void"];
const skills = [
  {
    group: "Artisan",
    skills: ["Aesthetics", "Composition", "Design", "Smithing"],
  },
  {
    group: "Social",
    skills: ["Command", "Courtesy", "Games", "Performance"],
  },
  {
    group: "Scholar",
    skills: ["Culture", "Government", "Medicine", "Sentiment", "Theology"],
  },
  {
    group: "Martial",
    skills: [
      "Fitness",
      "Martial Arts [Melee]",
      "Martial Arts [Ranged]",
      "Martial Arts [Unarmed]",
      "Meditation",
      "Tactics",
    ],
  },
  {
    group: "Trade",
    skills: ["Commerce", "Labor", "Seafaring", "Skulduggery", "Survival"],
  },
];

const options = rings
  .map((ring) =>
    skills.map(({ skills }) =>
      skills.map((skill) => {
        const value = `${ring}|${skill}`;
        const label = `${skill} (${ring})`;

        return { value, label };
      })
    )
  )
  .flat(2)
  .sort(({ label: a }, { label: b }) => a.localeCompare(b));

const ApproachSelector = () => {
  return (
    <Form.Item label={`Approach`} name="approach">
      <Select
        options={options}
        showSearch={true}
        optionFilterProp="label"
        allowClear={true}
      />
    </Form.Item>
  );
};

export default ApproachSelector;
