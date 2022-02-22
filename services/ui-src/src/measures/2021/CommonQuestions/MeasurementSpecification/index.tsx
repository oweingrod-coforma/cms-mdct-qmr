import * as CUI from "@chakra-ui/react";
import * as QMR from "components";
import { useCustomRegister } from "hooks/useCustomRegister";
import * as Types from "../types";

const HEDISChildren = () => {
  const register = useCustomRegister<Types.MeasurementSpecification>();

  return (
    <>
      <CUI.Text key="measureSpecDescriptor" size="sm" pb="3">
        NCQA, the measure steward, changed its naming convention. HEDIS MY 2020
        refers to a different federal fiscal year (FFY) than HEDIS 2020. Please
        note the FFY Core Set specification above.
      </CUI.Text>
      <QMR.Select
        {...register("MeasurementSpecification-HEDISVersion")}
        label="Specify the version of HEDIS measurement year used:"
        placeholder="Select option"
        options={[
          {
            displayValue: "HEDIS MY 2020 (FFY 2021 Core Set Reporting)",
            value: "HEDIS MY 2020",
          },
          {
            displayValue: "HEDIS 2020 (FFY 2020 Core Set Reporting)",
            value: "HEDIS 2020",
          },
          {
            displayValue: "HEDIS 2019 (FFY 2019 Core Set Reporting)",
            value: "HEDIS 2019",
          },
        ]}
      />
    </>
  );
};

interface Props {
  type: "HEDIS" | "OPA" | "AHRQ" | "CMS";
}

const specifications = {
  HEDIS: {
    displayValue:
      "National Committee for Quality Assurance (NCQA)/Healthcare Effectiveness Data and Information Set (HEDIS)",
    value: "NCQA/HEDIS",
    children: [<HEDISChildren />],
  },
  OPA: {
    displayValue: "HHS Office of Population Affairs (OPA)",
    value: "OPA",
  },
  AHRQ: {
    displayValue:
      "Agency for Healthcare Research and Quality (AHRQ) (survey instrument) and National Committee for Quality Assurance (survey administrative protocol)",
    value: "AHRQ/HEDIS",
  },
  CMS: {
    displayValue: "Centers for Medicare & Medicaid Services (CMS)",
    value: "CMS",
  },
};

export const MeasurementSpecification = ({ type }: Props) => {
  const register = useCustomRegister<Types.MeasurementSpecification>();

  return (
    <QMR.CoreQuestionWrapper label="Measurement Specification">
      <QMR.RadioButton
        {...register("MeasurementSpecification")}
        options={[
          specifications[type],
          {
            displayValue: "Other",
            value: "Other",
            children: [
              <QMR.TextArea
                textAreaProps={{ marginBottom: "10" }}
                {...register(
                  "MeasurementSpecification-OtherMeasurementSpecificationDescription"
                )}
                label="Describe the specifications that were used to calculate the measure and explain how they deviated from Core Set specifications:"
              />,
              <QMR.Upload
                label="If you need additional space to describe your state's methodology, please attach further documentation below."
                {...register(
                  "MeasurementSpecification-OtherMeasurementSpecificationDescription-Upload"
                )}
              />,
            ],
          },
        ]}
      />
    </QMR.CoreQuestionWrapper>
  );
};
