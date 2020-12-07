import { replaceRerollsOfType, replaceRerolls } from "./utils";

describe("replaceRerollsOfType", () => {
  describe("current", () => {
    const roll = {
      dices: [
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "rerolled",
          metadata: { end: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "rerolled",
          metadata: { end: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: {
            end: "shadow",
            source: "distinction",
          },
        },
        {
          type: "skill",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: {
            end: "shadow",
            source: "distinction",
          },
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: { source: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: { source: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: { source: "shadow" },
        },
      ],
      metadata: { rerolls: ["distinction", "shadow"] },
      parameters: {
        tn: 3,
        ring: 3,
        skill: 3,
        modifiers: ["distinction", "shadow"],
      },
    };
    const dices = roll.dices;
    const basePool = roll.parameters.ring + roll.parameters.skill;

    test("filter first depth of reroll properly", () => {
      expect(
        replaceRerollsOfType({ dices, rerollType: "distinction", basePool })
      ).toStrictEqual([
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "rerolled",
          metadata: { end: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: {
            end: "shadow",
            source: "distinction",
          },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: {
            end: "shadow",
            source: "distinction",
          },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: [],
        },
      ]);
    });

    test("filter second depth of reroll properly", () => {
      expect(
        replaceRerollsOfType({
          dices,
          rerollType: "shadow",
          basePool,
          previousRerollTypes: ["distinction"],
        })
      ).toStrictEqual([
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: { source: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: { source: "shadow" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: { source: "shadow" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: [],
        },
      ]);
    });
  });

  describe("legacy", () => {
    const roll = {
      dices: [
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "rerolled",
          metadata: { modifier: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "rerolled",
          metadata: { modifier: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 1 },
          status: "kept",
          metadata: { modifier: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: { modifier: "distinction" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
      ],
      metadata: { rerolls: ["distinction"] },
      parameters: { tn: 3, ring: 2, skill: 3, modifiers: ["distinction"] },
    };
    const dices = roll.dices;

    test("filter simple legacy roll properly", () => {
      expect(
        replaceRerollsOfType({ dices, rerollType: "distinction", basePool: 5 })
      ).toStrictEqual([
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 1 },
          status: "kept",
          metadata: { modifier: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: { modifier: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
      ]);
    });
  });
});

describe("replaceRerolls", () => {
  test("order is consistent", () => {
    const roll = {
      dices: [
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "kept",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "distinction" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 0, opportunity: 1 },
          status: "rerolled",
          metadata: { end: "distinction" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "shadow" },
        },
        {
          type: "skill",
          value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 1, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: { end: "distinction" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "rerolled",
          metadata: { end: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "rerolled",
          metadata: {
            end: "shadow",
            source: "distinction",
          },
        },
        {
          type: "skill",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: { source: "distinction" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
          status: "kept",
          metadata: { source: "distinction" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: { source: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 1, success: 0, explosion: 0, opportunity: 1 },
          status: "dropped",
          metadata: { source: "shadow" },
        },
        {
          type: "skill",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: { source: "shadow" },
        },
        {
          type: "ring",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: { source: "shadow" },
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 1, opportunity: 0 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
          status: "kept",
          metadata: [],
        },
        {
          type: "skill",
          value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
          status: "dropped",
          metadata: [],
        },
      ],
      metadata: { rerolls: ["distinction", "shadow"] },
      parameters: {
        tn: 5,
        ring: 5,
        skill: 5,
        modifiers: ["distinction", "void", "stirring", "shadow"],
      },
    };
    const {
      dices,
      metadata: { rerolls },
      parameters: { ring, skill },
    } = roll;
    const basePool = ring + skill + 1;

    expect(
      replaceRerolls({
        dices,
        rerollTypes: rerolls,
        basePool,
      })
    ).toStrictEqual([
      {
        type: "ring",
        value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
        status: "kept",
        metadata: [],
      },
      {
        type: "ring",
        value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
        status: "dropped",
        metadata: { source: "shadow" },
      },
      {
        type: "ring",
        value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
        status: "dropped",
        metadata: [],
      },
      {
        type: "ring",
        value: { strife: 1, success: 0, explosion: 0, opportunity: 1 },
        status: "dropped",
        metadata: { source: "shadow" },
      },
      {
        type: "ring",
        value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
        status: "kept",
        metadata: { source: "distinction" },
      },
      {
        type: "ring",
        value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
        status: "dropped",
        metadata: { source: "shadow" },
      },
      {
        type: "skill",
        value: { strife: 1, success: 0, explosion: 1, opportunity: 0 },
        status: "kept",
        metadata: [],
      },
      {
        type: "skill",
        value: { strife: 0, success: 0, explosion: 1, opportunity: 0 },
        status: "kept",
        metadata: [],
      },
      {
        type: "skill",
        value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
        status: "kept",
        metadata: { source: "distinction" },
      },
      {
        type: "skill",
        value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
        status: "kept",
        metadata: [],
      },
      {
        type: "skill",
        value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
        status: "dropped",
        metadata: { source: "shadow" },
      },
      {
        type: "skill",
        value: { strife: 0, success: 0, explosion: 1, opportunity: 0 },
        status: "kept",
        metadata: [],
      },
      {
        type: "skill",
        value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
        status: "kept",
        metadata: [],
      },
      {
        type: "skill",
        value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
        status: "dropped",
        metadata: [],
      },
    ]);
  });
});
