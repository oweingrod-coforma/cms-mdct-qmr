import * as CUI from "@chakra-ui/react";
import * as QMR from "components";
import { measuresList } from "measures/measuresList";
import { useParams, useNavigate } from "react-router-dom";
import { Params } from "Routes";
import { AddCoreSetCards } from "./AddCoreSetCards";
import { TiArrowUnsorted } from "react-icons/ti";
import { useGetCoreSets } from "hooks/api/useGetCoreSets";
import { formatTableItems } from "./helpers";

const ReportingYear = () => {
  const navigate = useNavigate();
  const { state, year } = useParams<Params>();
  const reportingYears = Object.keys(measuresList);

  const reportingyearOptions = reportingYears.map((year: string) => ({
    displayValue: year + " Core Set",
    value: year,
  }));

  return (
    <CUI.Box w={{ base: "full", md: "48" }}>
      <CUI.Text fontSize="sm" fontWeight="600" mb="2">
        Reporting Year
      </CUI.Text>
      <CUI.Select
        data-testid="select"
        borderRadius="sm"
        icon={<TiArrowUnsorted />}
        value={year}
        onChange={(e) => {
          navigate(`/${state}/${e.target.value}`);
        }}
      >
        {reportingyearOptions.map(({ displayValue, value }) => (
          <option value={value} key={value}>
            {displayValue}
          </option>
        ))}
      </CUI.Select>
    </CUI.Box>
  );
};

const Heading = () => {
  const { year } = useParams<Params>();
  return (
    <CUI.Box display={{ base: "block", md: "flex" }}>
      <CUI.Box maxW="3xl" pb="6">
        <CUI.Heading size="lg">
          {`FFY ${year} Core Set Measures Reporting`}
        </CUI.Heading>
        <CUI.Text fontWeight="bold" py="6">
          Complete each group of Core Set Measures below. Once a group is
          completed it can be submitted to CMS for review.
        </CUI.Text>
      </CUI.Box>
      <CUI.Spacer />
      <ReportingYear />
    </CUI.Box>
  );
};

export const StateHome = () => {
  const { state, year } = useParams<Params>();
  const { data, error, isLoading } = useGetCoreSets();

  if (isLoading || error) {
    return null;
  }

  // if data.Items is an empty array no coresets exist
  // In that case we crete an adult coreset and refetch the data
  // for now lets just display a message
  if (data.Items.length === 0) {
    return <CUI.Text>No Coresets exist for this state yet</CUI.Text>;
  }

  const formattedTableItems = formatTableItems(data.Items);

  return (
    <QMR.StateLayout
      breadcrumbItems={[
        { path: `/${state}/${year}`, name: "Core Set Measures" },
      ]}
    >
      <Heading />
      <QMR.Table data={formattedTableItems} columns={QMR.coreSetColumns} />
      <CUI.HStack spacing="6">
        <AddCoreSetCards />
      </CUI.HStack>
    </QMR.StateLayout>
  );
};
