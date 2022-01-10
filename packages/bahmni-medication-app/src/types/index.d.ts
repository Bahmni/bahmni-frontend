export type Drug = {
  uuid: string
  name: string
  strength: string
  concept: any
  dosageForm: any
}

export type NonCodedDrug = {
  name: String
}

export type DrugResult = {
  results: Drug[]
}
