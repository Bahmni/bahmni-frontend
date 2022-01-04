export type Drug = {
  uuid: string;
  name: string;
  strength: string;
  concept: any;
  dosageForm: any;
};

export type DrugResult = {
  results: Drug[];
};
export type Unit = {
  name: string;
  rootConcept: any;
};

export type Route = {
  name: string;
  rootConcept: any;
};

export type Frequency = {
  uuid: string;
  frequencyPerDay: number;
  name: string;
};

export type DrugOrderConfig = {
  doseUnits: Unit[];
  durationUnits: Unit[];
  routes: Route[];
  frequencies: Frequency[];
};
