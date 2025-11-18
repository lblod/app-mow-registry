type ObjectToBind = Record<string, unknown>;
type BindingObject<Obj extends ObjectToBind = ObjectToBind> = {
  [Prop in keyof Obj]: {
    type: string;
    value: string;
  };
};

export function objectify<Obj extends ObjectToBind>(
  binding: BindingObject<Obj>
) {
  return Object.fromEntries(
    Object.entries(binding).map(([key, term]) => [key, term.value])
    // TS doesn't give us 'keyof' from Object.entries() as a subclass could have extra fields,
    // making this technically not true, but for us we don't care as we'll put it through zod
  ) as { [Prop in keyof Obj]: string };
}
