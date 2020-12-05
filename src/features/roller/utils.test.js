import { replaceRerollsOfType } from "./utils";

const roll = {
  dices: [
    {
      type: "ring",
      value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
      status: "rerolled",
      metadata: { end: "shadow", modifier: "shadow" },
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
      metadata: { end: "distinction", modifier: "distinction" },
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
      metadata: { end: "distinction", modifier: "distinction" },
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
      metadata: { end: "shadow", source: "distinction", modifier: "shadow" },
    },
    {
      type: "skill",
      value: { strife: 1, success: 1, explosion: 0, opportunity: 0 },
      status: "rerolled",
      metadata: { end: "shadow", source: "distinction", modifier: "shadow" },
    },
    {
      type: "skill",
      value: { strife: 0, success: 0, explosion: 0, opportunity: 0 },
      status: "kept",
      metadata: { source: "shadow", modifier: "shadow" },
    },
    {
      type: "ring",
      value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
      status: "dropped",
      metadata: { source: "shadow", modifier: "shadow" },
    },
    {
      type: "ring",
      value: { strife: 0, success: 1, explosion: 0, opportunity: 0 },
      status: "kept",
      metadata: { source: "shadow", modifier: "shadow" },
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
const basePool = 6;

test("filter first depth of reroll properly", () => {
  expect(
    replaceRerollsOfType({ dices, rerollType: "distinction", basePool })
  ).toStrictEqual([
    {
      type: "ring",
      value: { strife: 0, success: 0, explosion: 0, opportunity: 1 },
      status: "rerolled",
      metadata: { end: "shadow", modifier: "shadow" },
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
      metadata: { end: "shadow", source: "distinction", modifier: "shadow" },
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
      metadata: { end: "shadow", source: "distinction", modifier: "shadow" },
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
      metadata: { source: "shadow", modifier: "shadow" },
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
      metadata: { source: "shadow", modifier: "shadow" },
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
      metadata: { source: "shadow", modifier: "shadow" },
    },
    {
      type: "skill",
      value: { strife: 0, success: 1, explosion: 0, opportunity: 1 },
      status: "dropped",
      metadata: [],
    },
  ]);
});
