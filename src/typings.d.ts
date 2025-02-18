import type { AggregateField, AggregateQuerySnapshot } from "firebase/firestore/lite";

declare module "rxfire/firestore/lite/interfaces" {
  export type CountSnapshot = AggregateQuerySnapshot<{ count: AggregateField<number> }>;
}
