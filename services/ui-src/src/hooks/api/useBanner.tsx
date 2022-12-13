import { useMutation, useQuery } from "react-query";
import { AdminBannerData } from "types";
import { getBanner, writeBanner, deleteBanner } from "libs/api";

export const useDeleteBanner = () => {
  return useMutation((bannerKey: string) => deleteBanner(bannerKey));
};

export const useWriteBanner = () => {
  return useMutation((bannerData: AdminBannerData) => writeBanner(bannerData));
};

const _getBanner = async (bannerKey: string) => {
  return await getBanner(bannerKey);
};

export const useGetBanner = (bannerKey: string) => {
  return useQuery(bannerKey, () => _getBanner(bannerKey));
};
