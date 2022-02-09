import uniqBy from 'lodash-es/uniqBy'
import {getDrugByName} from '../../api/api'
import {getCommonMedicationByUuid} from '../../types/common-medication'
import {OrderBasketItem} from '../../types/order-basket-item'
import {daysDurationUnit} from '../../utils/constants'
import {Drug} from '../../types/order'

export async function searchMedications(
  searchTerm: string,
  encounterUuid: string,
  abortController: AbortController,
) {
  const allSearchTerms = searchTerm.match(/\S+/g)
  const drugs = await searchDrugsInBackend(allSearchTerms, abortController)
  const explodedSearchResults = drugs.flatMap(drug => [
    ...explodeDrugResultWithCommonMedicationData(drug, encounterUuid),
  ])
  return filterExplodedResultsBySearchTerm(
    allSearchTerms,
    explodedSearchResults,
  )
}

async function searchDrugsInBackend(
  allSearchTerms: Array<string>,
  abortController: AbortController,
) {
  const resultsPerSearchTerm = await Promise.all(
    allSearchTerms.map(async searchTerm => {
      const res = await getDrugByName(searchTerm, abortController)
      return res.data.results
    }),
  )
  const results = resultsPerSearchTerm.flatMap(x => x)
  return uniqBy(results, 'uuid')
}

function* explodeDrugResultWithCommonMedicationData(
  drug: Drug,
  encounterUuid: string,
): Generator<OrderBasketItem> {
  const commonMedication = getCommonMedicationByUuid(drug.uuid)

  // If no common medication entry exists for the current drug, there is no point in displaying it in the search results,
  // because the user could not enter medication details anyway (the component requires a common medication entry
  // in order to work correctly).
  if (!commonMedication) {
    return
  }

  for (const dosageUnit of commonMedication.dosageUnits) {
    for (const dosage of commonMedication.commonDosages) {
      for (const frequency of commonMedication.commonFrequencies) {
        for (const route of commonMedication.route) {
          yield {
            action: 'NEW',
            drug,
            dosage,
            dosageUnit,
            frequency,
            route,
            encounterUuid,
            commonMedicationName: commonMedication.name,
            isFreeTextDosage: false,
            patientInstructions: '',
            asNeeded: false,
            asNeededCondition: '',
            startDate: new Date(),
            duration: null,
            durationUnit: daysDurationUnit,
            pillsDispensed: 0,
            numRefills: 0,
            freeTextDosage: '',
            indication: '',
          }
        }
      }
    }
  }
}

function filterExplodedResultsBySearchTerm(
  allSearchTerms: Array<string>,
  results: Array<OrderBasketItem>,
) {
  return results.filter(result =>
    allSearchTerms.every(
      searchTerm =>
        includesIgnoreCase(result.drug.name, searchTerm) ||
        includesIgnoreCase(result.dosageUnit.name, searchTerm) ||
        includesIgnoreCase(result.dosage.dosage, searchTerm) ||
        includesIgnoreCase(result.frequency.name, searchTerm) ||
        includesIgnoreCase(result.route.name, searchTerm),
    ),
  )
}

function includesIgnoreCase(a: string, b: string) {
  return a.toLowerCase().includes(b.toLowerCase())
}
