export default {
  core: {
    name: "Core Rulebook (page 96)",
    entries: [
      {
        name: "Famous Deed",
        min: 1,
        max: 1,
        description:
          "One of your ancestors won a great victory for their clan or even the Emperor, and was rewarded with an item of incredible quality.",
        modifier: "Increase your glory by 3.",
        effect: {
          intro:
            "Roll a ten-sided die again and add the resulting family heirloom to your starting items (",
          outro:
            "). You choose one quality and the GM chooses one quality from the list of item qualities, on page 240 of the core rulebook; these are applied to the item.",
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
        min: 2,
        max: 2,
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
        min: 3,
        max: 3,
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
        min: 4,
        max: 4,
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
        min: 5,
        max: 5,
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
        min: 6,
        max: 6,
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
        min: 7,
        max: 7,
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
        min: 8,
        max: 8,
        description:
          "One of your ancestors learned a secret of another school and clandestinely passed it down through the ages; now, it has reached you.",
        modifier: "Decrease your honor by 5.",
        effect: {
          intro:
            "You know one additional technique. Roll a ten-sided die again to determine the category (",
          outro:
            "), and then select one technique with a prerequisite of school rank 1 and learn that technique. You can perform that technique even if it is not normally allowed by your school.",
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
        min: 9,
        max: 9,
        description: "You can trace your lineage back to the Imperial line.",
        modifier: "Increase your status by 10.",
        effect:
          "You gain the Blessed Lineage advantage (see page 103 of the core rulebook) (this can be assigned in excess of the normal limitations on advantages at character creation).",
      },
      {
        name: "Unusual Name Origin",
        min: 10,
        max: 10,
        description:
          "Your character was not named for an ancestor—perhaps they were named for an outsider who did a great service to the clan, perhaps their name was bestowed upon them for a unique deed, or perhaps someone was trying to send a specific message in the selection of their name.",
        modifier: "Decrease your glory by 3.",
        effect:
          "Choose two of your character’s rings; you may reduce the value of one of these rings by 1 to increase the value of the other by 1 (this still cannot raise a ring above 3). If you do not do so, choose one item of rarity 6 or lower and assign it to your starting outfit.",
      },
    ],
  },
  court: {
    name: "Courts of Stone (page 104)",
    entries: [
      {
        name: "Dishonorable Cheat",
        min: 1,
        max: 1,
        description:
          "One of your kin was caught cheating in a high-profile duel. Instead of committing seppuku to purge their dishonor and redeem their family, they ran away and became a rōnin, disgracing their bloodline.",
        modifier: "Decrease your glory by 5.",
        effect: {
          intro:
            "Roll a ten-sided die to determine a skill to aid you in bringing your disgraced kin to justice (",
          outro: ").",
          options: [
            {
              min: 1,
              max: 3,
              text: "Martial Arts [ChooseOne]",
            },
            {
              min: 4,
              max: 6,
              text: "Survival",
            },
            {
              min: 7,
              max: 10,
              text: "Government",
            },
          ],
        },
      },
      {
        name: "Triumph over the Lion",
        min: 2,
        max: 3,
        description:
          "In your family line one of your ancestors held a decisive victory over the Lion. It may have been a duel, a critical game of Go, a battle, or any number of things. The circumstances are irrelevant; the Lion were embarrassed, and your ancestor brought honor to your clan.",
        modifier: "Increase your honor by 5.",
        effect: {
          intro:
            "Roll a ten-sided die and add the resulting family heirloom to your starting items (",
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
              text: "a game set of your choice",
            },
            {
              min: 7,
              max: 8,
              text: "some other item relevant to your ancestor’s victory",
            },
            {
              min: 9,
              max: 9,
              text: "a horse or another animal",
            },
            {
              min: 10,
              max: 10,
              text:
                "the deed to a small piece of land on the border of Lion territory",
            },
          ],
        },
      },
      {
        name: "Unforgivable Performance",
        min: 4,
        max: 5,
        description:
          "In the recent past one of your kin gave a truly horrible performance in the presence of the Imperial line. Through their embarrassing acting in a scene they caused the Emperor to leave the theatre and now rumors abound of your family being cursed by the Fortunes for such a failure.",
        modifier: "Decrease your status by 3.",
        effect: {
          intro:
            "You gain the Benten’s Curse (Air) disadvantage (see page 116 of the core rulebook). Roll a ten-sided die to determine a skill that will help redeem your family (",
          outro: ").",
          options: [
            {
              min: 1,
              max: 3,
              text: "Performance",
            },
            {
              min: 4,
              max: 6,
              text: "Culture",
            },
            {
              min: 7,
              max: 9,
              text: "Command",
            },
            {
              min: 10,
              max: 10,
              text: "Courtesy",
            },
          ],
        },
      },
      {
        name: "Triumph During Gempuku",
        min: 6,
        max: 7,
        description:
          "One of your parents was a Topaz Champion and brought honor to your clan and your family.",
        modifier: "Increase your honor and glory by 3.",
        effect:
          "You gain the Support of the Kakita Dueling Academy distinction, where the Topaz Championship takes place.",
      },
      {
        name: "A Little Too Close to Heaven",
        min: 8,
        max: 9,
        description:
          "One of your ancestors is rumored to have had an illegitimate child with an Emperor. While you may be able to link your heritage to the Imperial line, the disgrace of such an affair stains this joy.",
        modifier: "Increase your status by 5 and decrease your honor by 5.",
        effect: {
          intro:
            "Roll a ten-sided die to determine a skill that can aid you in discovering the truth about your lineage (",
          outro: ").",
          options: [
            {
              min: 1,
              max: 2,
              text: "Government",
            },
            {
              min: 3,
              max: 4,
              text: "Commerce",
            },
            {
              min: 5,
              max: 6,
              text: "Sentiment",
            },
            {
              min: 7,
              max: 8,
              text: "Meditation",
            },
            {
              min: 9,
              max: 10,
              text: "Theology",
            },
          ],
        },
      },
      {
        name: "Elegant Craftsman",
        min: 10,
        max: 10,
        description:
          "Your ancestor was a truly gifted artisan and produced in their lifetime a masterwork that is still renowned today. You now live in the shadow of this ancestor, and your clan expects your complete focus in bringing glory to your line once again.",
        modifier: "Increase your glory by 5.",
        effect:
          "You gain the Isolation anxiety (see page 103 of Courts of Stone). Choose one of your character’s rings; you may reduce the value of this ring by 1 to increase the value of your Fire or Air Ring by 1 (this still cannot raise it above 3). ",
      },
    ],
  },
};
