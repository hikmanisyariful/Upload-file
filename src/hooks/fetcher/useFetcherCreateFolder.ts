import { fetchCreateFolder } from "@/services/file/file.services";
import { useAuthorizationHeaders } from "../useAuthorizationHeaders";
import { iReqBodyCreateFolder } from "@/services/file/file.services.type";
import useSWRMutation from "swr/mutation";

export function useFetcherCreateFolder() {
  const { getAuthorizationHeaders } = useAuthorizationHeaders();

  const createFolderMutation = useSWRMutation(
    "/file/folder/create",
    async (url, { arg }: { arg: iReqBodyCreateFolder }) => {
      const authorizationHeaders = await getAuthorizationHeaders();

      return fetchCreateFolder({
        url,
        body: arg,
        headers: {
          ...authorizationHeaders,
          token: "",
        },
      });
    }
  );

  return { createFolderMutation };
}
