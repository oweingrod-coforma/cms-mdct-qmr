import { screen, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { RouterWrappedComp } from "utils/testing";
import { MeasureWrapper } from "components/MeasureWrapper";
import { useApiMock } from "utils/testUtils/useApiMock";
import { useUser } from "hooks/authHooks";
import Measures from "measures";
import { Suspense } from "react";
import { MeasuresLoading } from "views";
import { measureDescriptions } from "measures/measureDescriptions";
import { renderWithHookForm } from "utils/testUtils/reactHookFormRenderer";
import { validationFunctions } from "./validation";
import {
  mockValidateAndSetErrors,
  clearMocks,
  validationsMockObj as V,
} from "utils/testUtils/validationsMock";
import { axe, toHaveNoViolations } from "jest-axe";
expect.extend(toHaveNoViolations);

// Test Setup
const measureAbbr = "AIF-HH";
const coreSet = "HHCS";
const state = "DC";
const year = 2022;
const description = measureDescriptions[`${year}`][measureAbbr];
const apiData: any = {};

jest.mock("hooks/authHooks");
const mockUseUser = useUser as jest.Mock;

describe(`Test FFY ${year} ${measureAbbr}`, () => {
  let component: JSX.Element;
  beforeEach(() => {
    clearMocks();
    apiData.useGetMeasureValues = {
      data: {
        Item: {
          compoundKey: `${state}${year}${coreSet}${measureAbbr}`,
          coreSet,
          createdAt: 1642517935305,
          description,
          lastAltered: 1642517935305,
          lastAlteredBy: "undefined",
          measure: measureAbbr,
          state,
          status: "incomplete",
          year,
          data: {},
        },
      },
      isLoading: false,
      refetch: jest.fn(),
      isError: false,
      error: undefined,
    };

    mockUseUser.mockImplementation(() => {
      return { isStateUser: false };
    });

    const measure = createElement(Measures[year][measureAbbr]);
    component = (
      <Suspense fallback={MeasuresLoading()}>
        <RouterWrappedComp>
          <MeasureWrapper
            measure={measure}
            name={description}
            year={`${year}`}
            measureId={measureAbbr}
          />
        </RouterWrappedComp>
      </Suspense>
    );
  });

  it("measure should render", async () => {
    useApiMock(apiData);
    renderWithHookForm(component);
    expect(screen.getByTestId("measure-wrapper-form")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(measureAbbr + " - " + description));
    });
  });

  /**
   * Render the measure and confirm that all expected components exist.
   * */
  it("Always shows Are you reporting question", async () => {
    useApiMock(apiData);
    renderWithHookForm(component);
    expect(screen.getByText("Are you reporting on this measure?"));
  });

  it("shows corresponding questions if yes to reporting then ", async () => {
    apiData.useGetMeasureValues.data.Item.data = completedMeasureData;
    useApiMock(apiData);
    renderWithHookForm(component);
    expect(screen.getByText("Status of Data Reported")).toBeInTheDocument();
    expect(screen.getByText("Measurement Specification")).toBeInTheDocument();
    expect(screen.getByText("Data Source")).toBeInTheDocument();
    expect(screen.getByText("Date Range")).toBeInTheDocument();
    expect(
      screen.getByText("Definition of Population Included in the Measure")
    ).toBeInTheDocument();
  });

  it("does not show corresponding questions if no to reporting then ", async () => {
    apiData.useGetMeasureValues.data.Item.data = notReportingData;
    useApiMock(apiData);
    renderWithHookForm(component);
    expect(
      screen.queryByText("Status of Data Reported")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Measurement Specification")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Data Source")).not.toBeInTheDocument();
    expect(screen.queryByText("Date Range")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Definition of Population Included in the Measure")
    ).not.toBeInTheDocument();
  });

  it("shows corresponding components and hides others when primary measure is selected", async () => {
    apiData.useGetMeasureValues.data.Item.data = completedMeasureData;
    useApiMock(apiData);
    renderWithHookForm(component);
    expect(screen.getByText("Performance Measure")).toBeInTheDocument();
    expect(
      screen.getByText("Deviations from Measure Specifications")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Other Performance Measure")
    ).not.toBeInTheDocument();
  });

  it("shows corresponding components and hides others when primary measure is NOT selected", async () => {
    apiData.useGetMeasureValues.data.Item.data = OPMData;
    useApiMock(apiData);
    renderWithHookForm(component);
    expect(screen.getByText("Other Performance Measure"));
    expect(
      screen.queryByLabelText("Performance Measure")
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText("Deviations from Measure Specifications")
    ).not.toBeInTheDocument();
  });

  it("shows OMS when performance measure data has been entered", async () => {
    apiData.useGetMeasureValues.data.Item.data = completedMeasureData;
    useApiMock(apiData);
    renderWithHookForm(component);
    expect(screen.getByText("Optional Measure Stratification"));
  });
  it("does not show OMS when performance measure data has been entered", async () => {
    apiData.useGetMeasureValues.data.Item.data = notReportingData;
    useApiMock(apiData);
    renderWithHookForm(component);
    expect(
      screen.queryByText("Optional Measure Stratification")
    ).not.toBeInTheDocument();
  });

  /** Validations Test
   *
   * Confirm that correct functions are called. Comprehensive testing of the validations is done in specific test files
   * for each validation function. See globalValidations directory.
   */
  it("(Not Reporting) validationFunctions should call all expected validation functions", async () => {
    mockValidateAndSetErrors(validationFunctions, notReportingData); // trigger validations
    expect(V.validateReasonForNotReporting).toHaveBeenCalled();
    expect(V.validateAtLeastOneRateComplete).not.toHaveBeenCalled();
    expect(V.ComplexValidateDualPopInformation).not.toHaveBeenCalled();
    expect(V.ComplexNoNonZeroNumOrDenom).not.toHaveBeenCalled();
    expect(V.validateRateZeroPM).not.toHaveBeenCalled();
    expect(
      V.validateRequiredRadioButtonForCombinedRates
    ).not.toHaveBeenCalled();
    expect(V.validateBothDatesCompleted).not.toHaveBeenCalled();
    expect(V.validateAtLeastOneDataSource).not.toHaveBeenCalled();
    expect(V.validateAtLeastOneDeviationFieldFilled).not.toHaveBeenCalled();
    expect(V.validateNumeratorLessThanDenominatorOMS).not.toHaveBeenCalled();
    expect(V.validateRateZeroOMS).not.toHaveBeenCalled();
    expect(V.validateRateNotZeroOMS).not.toHaveBeenCalled();
    expect(V.ComplexValidateNDRTotals).not.toHaveBeenCalled();
  });

  it("(Completed) validationFunctions should call all expected validation functions", async () => {
    mockValidateAndSetErrors(validationFunctions, completedMeasureData); // trigger validations
    expect(V.validateReasonForNotReporting).not.toHaveBeenCalled();
    expect(V.ComplexAtLeastOneRateComplete).toHaveBeenCalled();
    expect(V.ComplexNoNonZeroNumOrDenom).toHaveBeenCalled();
    expect(V.validateRequiredRadioButtonForCombinedRates).toHaveBeenCalled();
    expect(V.validateBothDatesCompleted).toHaveBeenCalled();
    expect(V.validateAtLeastOneDataSource).toHaveBeenCalled();
    expect(
      V.ComplexValidateAtLeastOneNDRInDeviationOfMeasureSpec
    ).toHaveBeenCalled();
    expect(V.ComplexValidateNDRTotals).toHaveBeenCalled();
  });

  jest.setTimeout(15000);
  it("should pass a11y tests", async () => {
    useApiMock(apiData);
    renderWithHookForm(component);
    const results = await axe(screen.getByTestId("measure-wrapper-form"));

    expect(results).toHaveNoViolations();
  });
});

const notReportingData = {
  DidReport: "no",
};

const OPMData = { MeasurementSpecification: "Other", DidReport: "yes" };

const completedMeasureData = {
  PerformanceMeasure: {
    rates: {
      singleCategory: [
        {
          fields: [
            {
              value: "1",
              label: "Number of Enrollee Months",
            },
            {
              value: "1",
              label: "Number of Short-Term Admissions",
            },
            {
              value: "1000.0",
              label: "Short-Term Admissions per 1,000 Enrollee Months",
            },
            {
              value: "1",
              label: "Number of Medium-Term Admissions",
            },
            {
              value: "1000.0",
              label: "Medium-Term Admissions per 1,000 Enrollee Months",
            },
            {
              value: "1",
              label: "Number of Long-Term Admissions",
            },
            {
              value: "1000.0",
              label: "Long-Term Admissions per 1,000 Enrollee Months",
            },
          ],
          label: "Ages 18 to 64",
        },
        {
          fields: [
            {
              value: "1",
              label: "Number of Enrollee Months",
            },
            {
              value: "1",
              label: "Number of Short-Term Admissions",
            },
            {
              value: "1000.0",
              label: "Short-Term Admissions per 1,000 Enrollee Months",
            },
            {
              value: "1",
              label: "Number of Medium-Term Admissions",
            },
            {
              value: "1000.0",
              label: "Medium-Term Admissions per 1,000 Enrollee Months",
            },
            {
              value: "1",
              label: "Number of Long-Term Admissions",
            },
            {
              value: "1000.0",
              label: "Long-Term Admissions per 1,000 Enrollee Months",
            },
          ],
          label: "Ages 65 to 74",
        },
        {
          fields: [
            {
              label: "Number of Enrollee Months",
            },
            {
              label: "Number of Short-Term Admissions",
            },
            {
              label: "Short-Term Admissions per 1,000 Enrollee Months",
            },
            {
              label: "Number of Medium-Term Admissions",
            },
            {
              label: "Medium-Term Admissions per 1,000 Enrollee Months",
            },
            {
              label: "Number of Long-Term Admissions",
            },
            {
              label: "Long-Term Admissions per 1,000 Enrollee Months",
            },
          ],
          label: "Ages 75 to 84",
        },
        {
          fields: [
            {
              label: "Number of Enrollee Months",
            },
            {
              label: "Number of Short-Term Admissions",
            },
            {
              label: "Short-Term Admissions per 1,000 Enrollee Months",
            },
            {
              label: "Number of Medium-Term Admissions",
            },
            {
              label: "Medium-Term Admissions per 1,000 Enrollee Months",
            },
            {
              label: "Number of Long-Term Admissions",
            },
            {
              label: "Long-Term Admissions per 1,000 Enrollee Months",
            },
          ],
          label: "Age 85 and older",
        },
        {
          fields: [
            {
              value: "2",
              label: "Number of Enrollee Months",
            },
            {
              value: 2,
              label: "Number of Short-Term Admissions",
            },
            {
              value: "1000.0",
              label: "Short-Term Admissions per 1,000 Enrollee Months",
            },
            {
              value: 2,
              label: "Number of Medium-Term Admissions",
            },
            {
              value: "1000.0",
              label: "Medium-Term Admissions per 1,000 Enrollee Months",
            },
            {
              value: 2,
              label: "Number of Long-Term Admissions",
            },
            {
              value: "1000.0",
              label: "Long-Term Admissions per 1,000 Enrollee Months",
            },
          ],
          isTotal: true,
          label: "Total",
        },
      ],
    },
  },
  MeasurementSpecification: "CMS",
  DidReport: "yes",
};
