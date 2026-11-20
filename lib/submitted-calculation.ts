type FormInputs = Readonly<Record<string, string>>;

export function calculateSubmission<Inputs extends FormInputs, Value>(inputs: Inputs, calculate: (snapshot: Inputs) => Value) {
  const snapshot = { ...inputs };
  return { inputs: snapshot, value: calculate(snapshot) };
}

export function currentSubmission<Inputs extends FormInputs, Value>(
  submission: { inputs: Inputs; value: Value } | null, draft: Inputs,
) {
  if (!submission || !Object.keys(draft).every(key => draft[key] === submission.inputs[key])) return null;
  return submission;
}
