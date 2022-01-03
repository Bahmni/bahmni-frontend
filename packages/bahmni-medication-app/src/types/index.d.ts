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

export type DrugName = {
  name: String;
};
