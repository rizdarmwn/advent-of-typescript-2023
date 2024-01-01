type Presents = ["🛹", "🚲", "🛴", "🏄"];

type CreatePresentsArray<
  T extends number,
  U extends any[],
  Res extends any[] = []
> = U extends [infer Head, ...infer Rest]
  ? Res["length"] extends T
    ? Res
    : CreatePresentsArray<T, [...Rest, Head], [...Res, Head]>
  : Res;

type PresentsMultiplier<
  T extends string,
  U extends number,
  Acc extends T[] = []
> = Acc["length"] extends U ? Acc : PresentsMultiplier<T, U, [T, ...Acc]>;

type Rebuild<
  T extends number[],
  Acc extends string[] = [],
  Boxed extends string[] = CreatePresentsArray<T["length"], Presents>
> = T extends [infer Head extends number, ...infer Rest extends number[]]
  ? Boxed extends [infer Head2 extends string, ...infer Rest2 extends string[]]
    ? Rebuild<
        Rest,
        [...Acc, ...PresentsMultiplier<Head2, Head>] extends [
          ...infer Acc2 extends string[]
        ]
          ? Acc2
          : never,
        Rest2
      >
    : Acc
  : Acc;

import { Expect, Equal } from "type-testing";

type test_0_actual = Rebuild<[2, 1, 3, 3, 1, 1, 2]>;
//   ^?
type test_0_expected = [
  "🛹",
  "🛹",
  "🚲",
  "🛴",
  "🛴",
  "🛴",
  "🏄",
  "🏄",
  "🏄",
  "🛹",
  "🚲",
  "🛴",
  "🛴"
];
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = Rebuild<[3, 3, 2, 1, 2, 1, 2]>;
//   ^?
type test_1_expected = [
  "🛹",
  "🛹",
  "🛹",
  "🚲",
  "🚲",
  "🚲",
  "🛴",
  "🛴",
  "🏄",
  "🛹",
  "🛹",
  "🚲",
  "🛴",
  "🛴"
];
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = Rebuild<[2, 3, 3, 5, 1, 1, 2]>;
//   ^?
type test_2_expected = [
  "🛹",
  "🛹",
  "🚲",
  "🚲",
  "🚲",
  "🛴",
  "🛴",
  "🛴",
  "🏄",
  "🏄",
  "🏄",
  "🏄",
  "🏄",
  "🛹",
  "🚲",
  "🛴",
  "🛴"
];
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;
