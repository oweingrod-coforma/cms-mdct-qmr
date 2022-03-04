import { DataDrivenTypes } from "measures/CommonQuestions/types";

export const qualifiers = ["Ages 18 to 64", "Age 65 and older"];
export const categories = [
  "Initiation of AOD Treatment: Alcohol Abuse or Dependence",
  "Engagement of AOD Treatment: Alcohol Abuse or Dependence",
  "Initiation of AOD Treatment: Opioid Abuse or Dependence",
  "Engagement of AOD Treatment: Opioid Abuse or Dependence",
  "Initiation of AOD Treatment: Other Drug Abuse or Dependence",
  "Engagement of AOD Treatment: Other Drug Abuse or Dependence",
  "Initiation of AOD Treatment: Total AOD Abuse or Dependence",
  "Engagement of AOD Treatment: Total AOD Abuse or Dependence",
];

export const data: DataDrivenTypes.PerformanceMeasure = {
  questionText:
    "The percentage of beneficiaries age 18 and older with a new episode of alcohol or other drug (AOD) abuse or dependence who received the following",
  questionListItems: [
    "Initiation of AOD Treatment: Percentage of beneficiaries who initiate treatment through an inpatient AOD admission, outpatient visit, intensive outpatient encounter, or partial hospitalization, telehealth, or medication assisted treatment within 14 days of the diagnosis.",
    "Engagement of AOD Treatment: Percentage of beneficiaries who initiated treatment and who were engaged in ongoing AOD treatment within 34 days of the initiation visit.",
  ],
  categories,
  qualifiers,
};

export const dataSourceData: DataDrivenTypes.DataSource = {
  optionsLabel:
    "If reporting entities (e.g., health plans) used different data sources, please select all applicable data sources used below.",
  options: [
    {
      value: "Administrative Data",
      subOptions: {
        label: "What is the Administrative Data Source?",
        options: [
          {
            value: "Medicaid Management Information System (MMIS)",
          },
          {
            value: "Administrative Data Other",
            description: true,
          },
        ],
      },
    },
    {
      value: "Electronic Health Records",
    },
    {
      value: "Other Data Source",
      description: true,
    },
  ],
};
