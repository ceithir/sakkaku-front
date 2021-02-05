export default {
  core: {
    name: "Core Rulebook (page 96)",
    entries: [
      {
        name: "Famous Deed",
        description:
          "One of your ancestors won a great victory for their clan or even the Emperor, and was rewarded with an item of incredible quality.",
        modifier: "Increase your glory by 3.",
        effect: {
          intro:
            "Roll a ten-sided die again and add the resulting family heirloom to your starting items (",
          outro:
            "). You choose one quality and the GM chooses one quality from the list of item qualities; these are applied to the item.",
          options: [
            {
              min: 1,
              max: 3,
              text: "a weapon",
            },
            {
              min: 4,
              max: 6,
              text: "a set of armor",
            },
            {
              min: 7,
              max: 8,
              text: "another item",
            },
            {
              min: 9,
              max: 9,
              text: "a horse or other animal",
            },
            {
              min: 10,
              max: 10,
              text: "a boat or estate",
            },
          ],
        },
      },
      {
        name: "Glorious Sacrifice",
        description:
          "One of your ancestors perished nobly in battle, and one of their signature items vanished with them or was lost in the subsequent years.",
        modifier: "Increase your honor by 5 and your glory by 5.",
        effect: {
          intro:
            "Roll a ten-sided die again to determine your lost family heirloom (",
          outro:
            "), which exists somewhere in the world. You choose one quality and the GM chooses one quality; these are applied to the item. You do not know where the heirloom is, but you could later reclaim it during the campaign.",
          options: [
            {
              min: 1,
              max: 3,
              text: "a weapon",
            },
            {
              min: 4,
              max: 6,
              text: "a set of armor",
            },
            {
              min: 7,
              max: 8,
              text: "another item",
            },
            {
              min: 9,
              max: 9,
              text: "a horse or other animal",
            },
            {
              min: 10,
              max: 10,
              text: "a boat or estate",
            },
          ],
        },
      },
      {
        name: "Wondrous Work",
        description:
          "One of your ancestors crafted a piece of great beauty that won renown for your family, and others expect you to live up to that legacy.",
        modifier: "Increase your glory by 5.",
        effect: {
          intro: "Roll a ten-sided die again to determine an Artisan skill (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Aesthetics",
            },
            {
              min: 4,
              max: 6,
              text: "Composition",
            },
            {
              min: 7,
              max: 8,
              text: "Design",
            },
            {
              min: 9,
              max: 10,
              text: "Smithing",
            },
          ],
        },
      },
      {
        name: "Dynasty Builder",
        description:
          "One of your ancestors was instrumental in the rise of a powerful lord, using cunning stratagems and shrewd advice to secure their ascension. You have heard this story many times and know the importance of power subtly wielded.",
        modifier: "Decrease your glory by 3.",
        effect: {
          intro: "Roll a ten-sided die again to determine a Social skill (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Command",
            },
            {
              min: 4,
              max: 6,
              text: "Courtesy",
            },
            {
              min: 7,
              max: 8,
              text: "Games",
            },
            {
              min: 9,
              max: 10,
              text: "Performance",
            },
          ],
        },
      },
      {
        name: "Discovery",
        description:
          "One of your ancestors made an incredible discovery, invented something of great importance, or uncovered an ancient secret. Thanks to family lore, you have at least a rudimentary understanding of the subject of their discovery.",
        modifier: "Increase your glory by 3.",
        effect: {
          intro: "Roll a ten-sided die again to determine a Scholar skill (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Culture",
            },
            {
              min: 4,
              max: 5,
              text: "Sentiment",
            },
            {
              min: 6,
              max: 7,
              text: "Government",
            },
            {
              min: 8,
              max: 9,
              text: "Medicine",
            },
            {
              min: 10,
              max: 10,
              text: "Theology",
            },
          ],
        },
      },
      {
        name: "Ruthless Victor",
        description:
          "One of your ancestors claimed a bloody victory over a rival, smashing their forces with a cunning maneuver or seizing their domain after vanquishing them in battle. From this relative or their story, you learned well the importance of brute force.",
        modifier: "Decrease your honor by 5.",
        effect: {
          intro: "Roll a ten-sided die again to determine a Martial skill (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Fitness",
            },
            {
              min: 4,
              max: 5,
              text: "Martial Arts [Melee]",
            },
            {
              min: 6,
              max: 7,
              text: "Martial Arts [Ranged]",
            },
            {
              min: 8,
              max: 8,
              text: "Martial Arts [Unarmed]",
            },
            {
              min: 9,
              max: 9,
              text: "Tactics",
            },
            {
              min: 10,
              max: 10,
              text: "Meditation",
            },
          ],
        },
      },
      {
        name: "Elevated for Service",
        description:
          "One of your ancestors was a jizamurai or even a commoner who served with such distinction that their position was elevated to that of a Great Clan samurai by marriage or mandate of a daimyō. As a child, you learned the basics of the skills for which they won their esteem.",
        modifier: "Decrease your glory by 3 and increase your honor by 3.",
        effect: {
          intro: "Roll a ten-sided die again to determine a Trade skill (",
          outro: "); gain +1 rank in that skill.",
          options: [
            {
              min: 1,
              max: 3,
              text: "Commerce",
            },
            {
              min: 4,
              max: 5,
              text: "Labor",
            },
            {
              min: 6,
              max: 7,
              text: "Seafaring",
            },
            {
              min: 8,
              max: 8,
              text: "Skulduggery",
            },
            {
              min: 9,
              max: 10,
              text: "Survival",
            },
          ],
        },
      },
      {
        name: "Stolen Knowledge",
        description:
          "One of your ancestors learned a secret of another school and clandestinely passed it down through the ages; now, it has reached you.",
        modifier: "Decrease your honor by 5.",
        effect: {
          intro:
            "You know one additional technique. Roll a ten-sided die again to determine the category (",
          outro:
            "), and then select one technique with a prereq- uisite of school rank 1 and learn that technique. You can perform that technique even if it is not normally allowed by your school.",
          options: [
            {
              min: 1,
              max: 3,
              text: "kata",
            },
            {
              min: 4,
              max: 6,
              text: "shūji",
            },
            {
              min: 7,
              max: 7,
              text: "ritual",
            },
            {
              min: 8,
              max: 8,
              text: "invocation",
            },
            {
              min: 9,
              max: 9,
              text: "kihō",
            },
            {
              min: 10,
              max: 10,
              text: "mahō or ninjutsu",
            },
          ],
        },
      },
      {
        name: "Imperial Heritage",
        description: "You can trace your lineage back to the Imperial line.",
        modifier: "Increase your status by 10.",
        effect:
          "You gain the Blessed Lineage advantage (this can be assigned in excess of the normal limitations on advantages at character creation).",
      },
      {
        name: "Unusual Name Origin",
        description:
          "Your character was not named for an ancestor—perhaps they were named for an outsider who did a great service to the clan, perhaps their name was bestowed upon them for a unique deed, or perhaps someone was trying to send a specific message in the selection of their name.",
        modifier: "Decrease your glory by 3.",
        effect:
          "Choose two of your character’s rings; you may reduce the value of one of these rings by 1 to increase the value of the other by 1 (this still cannot raise a ring above 3). If you do not do so, choose one item of rarity 6 or lower and assign it to your starting outfit.",
      },
    ],
  },
};
