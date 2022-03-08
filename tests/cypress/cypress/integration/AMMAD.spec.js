describe("Measure: AMM-AD", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.login();
    cy.goToAdultMeasures();
    cy.goToMeasure("AMM-AD");
  });

  it("Ensure correct sections display if user is/not reporting", () => {
    cy.displaysSectionsWhenUserNotReporting();
    cy.displaysSectionsWhenUserIsReporting();
  });

  it("If not reporting and not why not -> show error", () => {
    cy.get('[data-cy="DidReport1"]').click();
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get(
      '[data-cy="Why Are You Not Reporting On This Measure Error"]'
    ).should("have.text", "Why Are You Not Reporting On This Measure Error");
  });

  it("should show correct data source options", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="DataSource0"]').should("be.visible");
    cy.get('[data-cy="DataSource1"]').should("be.visible");
    cy.get('[data-cy="DataSource2"]').should("be.visible");
  });

  it("if primary measurement spec is selected -> show performance measures", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get("#MeasurementSpecification-NCQAHEDIS").should(
      "have.text",
      "National Committee for Quality Assurance (NCQA)/Healthcare Effectiveness Data and Information Set (HEDIS)"
    );
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[data-cy="MeasurementSpecification-HEDISVersion"]').select(
      "HEDIS MY 2020"
    );
    cy.get('[data-cy="Performance Measure"]').should("be.visible");
    cy.get(":nth-child(6) > :nth-child(1) > .chakra-text").should(
      "have.text",
      "Effective Acute Phase Treatment"
    );
    cy.get(':nth-child(1) > :nth-child(2) > [data-cy="Ages 18 to 64"]').should(
      "have.text",
      "Ages 18 to 64"
    );
    cy.get(
      ':nth-child(1) > :nth-child(3) > [data-cy="Age 65 and older"]'
    ).should("have.text", "Age 65 and older");
    cy.get(":nth-child(6) > :nth-child(2) > .chakra-text").should(
      "have.text",
      "Effective Continuation Phase Treatment"
    );
  });

  it("if other measurement spec is selected -> show other performance measures", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification1"]').click();
    cy.get(
      '[data-cy="MeasurementSpecification-OtherMeasurementSpecificationDescription"]'
    ).should("be.visible");
    cy.get('[data-cy="Other Performance Measure"]').should("be.visible");
  });

  it("if only admin data cannot override, if anything else, rate is editable", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get('[data-cy="DataSource0"] > .chakra-checkbox__control').click();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.EffectiveAcutePhaseTreatment.0.numerator"]'
    ).type("56");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.EffectiveAcutePhaseTreatment.0.denominator"]'
    ).type("56");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.EffectiveAcutePhaseTreatment.0.rate"]'
    ).should("have.attr", "aria-readonly", "true");
    cy.get('[data-cy="DataSource1"] > .chakra-checkbox__control').click();
    cy.get(
      ':nth-child(1) > :nth-child(3) > [data-cy="Age 65 and older"]'
    ).click();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.EffectiveAcutePhaseTreatment.0.rate"]'
    ).click();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.EffectiveAcutePhaseTreatment.0.rate"]'
    ).type("10.5");
  });

  it("should have adult eligibility group in OMS", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.EffectiveAcutePhaseTreatment.0.numerator"]'
    ).type("6");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.EffectiveAcutePhaseTreatment.0.denominator"]'
    ).type("6");
  });

  it("at least one dnr set if reporting and measurement spec or error.", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get('[data-cy="At least one NDR Set must be completed"]').should(
      "be.visible"
    );
    cy.get('[data-cy="MeasurementSpecification1"]').click();
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get('[data-cy="Performance Measure Error"]').should("be.visible");
  });
  it("denominator need to be the same for both stratifications", () => {
    cy.get('[data-cy="DidReport0"]').click();
    cy.get('[data-cy="MeasurementSpecification0"]').click();
    cy.get(
      '[data-cy="PerformanceMeasure.rates.EffectiveAcutePhaseTreatment.0.numerator"]'
    ).type("7");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.EffectiveAcutePhaseTreatment.0.denominator"]'
    ).type("7");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.EffectiveContinuationPhaseTreatment.0.numerator"]'
    ).type("7");
    cy.get(
      '[data-cy="PerformanceMeasure.rates.EffectiveContinuationPhaseTreatment.0.denominator"]'
    ).type("8");
    cy.get('[data-cy="Validate Measure"]').click();
    cy.get(
      '[data-cy="Denominators must be the same for each category of performance measures for Ages 18 to 64"]'
    ).should(
      "have.text",
      "Denominators must be the same for each category of performance measures for Ages 18 to 64"
    );
  });
  it("if yes for combined rates → and no additional selection → show warning", () => {});
});

/*
describe("Measure: AMM-AD", () => {
  before(() => {
    cy.visit("/");
    cy.login();
    cy.goToAdultMeasures();
    cy.goToMeasure("AMM-AD");
  });

  it("Ensure correct sections display if user is/not reporting", () => {
    cy.displaysSectionsWhenUserNotReporting();
    cy.displaysSectionsWhenUserIsReporting();
  });

  it("If not reporting and not why not -> show error", () => {});
  it("should show correct data source options", () => {});
  it("if primary measurement spec is selected -> show performance measures", () => {});
  it("if other measurement spec is selected -> show other performance measures", () => {});
  it("if yes for combined rates → and no additional selection → show warning", () => {});
  it("if only admin data cannot override, if anything else, rate is editable", () => {});
  it("should have adult eligibility group in OMS", () => {});
  it("at least one dnr set if reporting and measurement spec or error.", () => {});
  it("denominator need to be the same for both stratifications", () => {});
});

*/
