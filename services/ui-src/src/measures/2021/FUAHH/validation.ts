import * as DC from "dataConstants";
import * as GV from "measures/globalValidations";
import * as PMD from "./data";
import { FormData } from "./types";
import { OMSData } from "measures/CommonQuestions/OptionalMeasureStrat/data";

const FUAHHValidation = (data: FormData) => {
  const ageGroups = PMD.qualifiers;
  const dateRange = data[DC.DATE_RANGE];
  const DefinitionOfDenominator = data[DC.DEFINITION_OF_DENOMINATOR];
  const deviationArray = GV.getDeviationNDRArray(
    data.DeviationOptions,
    data.Deviations,
    true
  );
  const didCalculationsDeviate = data[DC.DID_CALCS_DEVIATE] === DC.YES;
  const OPM = data[DC.OPM_RATES];
  const performanceMeasureArray = GV.getPerfMeasureRateArray(data, PMD.data);
  const sixtyDaysIndex = 2;
  const validateDualPopInformationArray = [performanceMeasureArray?.[1]];
  const whyNotReporting = data[DC.WHY_ARE_YOU_NOT_REPORTING];

  let errorArray: any[] = [];
  if (data[DC.DID_REPORT] === DC.NO) {
    errorArray = [...GV.validateReasonForNotReporting(whyNotReporting)];
    return errorArray;
  }

  let sameDenominatorError = [
    ...GV.validateEqualDenominators(performanceMeasureArray, ageGroups),
  ];
  sameDenominatorError =
    sameDenominatorError.length > 0 ? [...sameDenominatorError] : [];
  errorArray = [
    ...GV.ensureBothDatesCompletedInRange(dateRange),
    ...GV.atLeastOneRateComplete(performanceMeasureArray, OPM, ageGroups),
    ...GV.validateOneDataSource(data),

    // Performance Measure Validations
    ...GV.validateDualPopInformation(
      validateDualPopInformationArray,
      OPM,
      sixtyDaysIndex,
      DefinitionOfDenominator
    ),
    ...GV.validateRequiredRadioButtonForCombinedRates(data),
    ...GV.validateAtLeastOneNDRInDeviationOfMeasureSpec(
      performanceMeasureArray,
      PMD.qualifiers,
      deviationArray,
      didCalculationsDeviate
    ),
    ...GV.validateNumeratorsLessThanDenominators(
      performanceMeasureArray,
      OPM,
      ageGroups
    ),
    ...sameDenominatorError,
    ...GV.validateTotalNDR(performanceMeasureArray),
    ...GV.validateNoNonZeroNumOrDenom(
      performanceMeasureArray,
      OPM,
      ageGroups,
      data
    ),
    ...GV.validateOneRateHigherThanOther(data, PMD.data),

    // OMS Validations
    ...GV.omsValidations({
      data,
      qualifiers: PMD.qualifiers,
      categories: PMD.categories,
      locationDictionary: GV.omsLocationDictionary(
        OMSData(true),
        PMD.qualifiers,
        PMD.categories
      ),
      validationCallbacks: [
        GV.validateDenominatorGreaterThanNumerator,
        GV.validateDenominatorsAreTheSame,
        GV.validateOneRateLessThanOther,
        GV.validateOMSTotalNDR,
        GV.validateRateZero,
        GV.validateRateNotZero,
      ],
    }),
  ];

  return errorArray;
};

export const validationFunctions = [FUAHHValidation];
