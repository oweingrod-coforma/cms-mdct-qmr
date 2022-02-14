import * as QMR from "components";
import * as CUI from "@chakra-ui/react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { AddAnotherButton, SubCatSection } from "./subCatClassification";
import { NDRSets } from "./ndrSets";

interface AdditonalCategoryProps {
  /** name for react-hook-form registration */
  name: string;
  /** name of parent category for additional text */
  parentName: string;
  /** should the additional categories have a subCat option? */
  flagSubCat: boolean;
}

/**
 * Additional [Race/Sex/Language/Etc] Category Section
 */
export const AddAnotherSection = ({
  name,
  parentName,
  flagSubCat,
}: AdditonalCategoryProps) => {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    name: `${name}.additionalSelections`,
    control,
    shouldUnregister: true,
  });

  return (
    <CUI.Box key={`${name}.additionalCategoriesWrapper`}>
      {fields.map((field: any, idx: number) => (
        <QMR.DeleteWrapper
          allowDeletion
          onDelete={() => remove(idx)}
          key={field.id}
        >
          <CUI.Box ml="6" key={field.id}>
            <CUI.Text
              size={"xl"}
              ml="-6"
              my="3"
              onClick={() => remove(idx)}
            >{`Additional ${parentName}`}</CUI.Text>
            <QMR.TextInput
              name={`${name}.additionalSelections.${idx}.description`}
              label={`Define the additional ${parentName}`}
              rules={{ required: true }}
            />
            <NDRSets
              name={`${name}.additionalSelections.${idx}.ageRangeRates`}
            />
            {flagSubCat && (
              <SubCatSection name={`${name}.additionalSelections.${idx}`} />
            )}
          </CUI.Box>
        </QMR.DeleteWrapper>
      ))}
      <AddAnotherButton
        onClick={() => append({})}
        additionalText={parentName}
        key={`${name}.additionalCategoriesButton`}
      />
    </CUI.Box>
  );
};
