import * as CUI from "@chakra-ui/react";
import { CreateBannerForm } from "./CreateBannerForm";

export const CreateBanner = (props: any) => {
  return (
    <>
      <CUI.Text sx={props.sx.sectionHeader}>Create a New Banner</CUI.Text>
      <CreateBannerForm onSubmit={props.onSubmit}></CreateBannerForm>
    </>
  );
};
