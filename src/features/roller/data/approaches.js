export const rings = ["Air", "Earth", "Fire", "Water", "Void"];

export const skills = [
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

export const skillGroup = (skill) =>
  skills.find(({ skills }) => skills.includes(skill))?.group;
