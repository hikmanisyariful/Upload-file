import { useCallback } from "react";

export function useAuthorizationHeaders() {
  const getAuthorizationHeaders = useCallback(async () => {
    return {
      email: "mercas870@gmail.com",
      deviceUUID: "def",
      workspaceId: "2e721e3a-6904-4884-99e8-48c08a1e60de",
      teamId: "51c4804b-5ea0-4073-affb-95f6280c65c6",
    };
  }, []);

  return { getAuthorizationHeaders };
}
