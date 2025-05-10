import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api";
import Cookie from "js-cookie";

export default function useUser() {
  const hasSession = Boolean(Cookie.get("sessionid"));
  const { isLoading, data, isError } = useQuery(["me"], getMe, {
    retry: 2,
    cacheTime: 0,
    enabled: hasSession,
  });
  return {
    userLoading: isLoading,
    user: data,
    isLoggedIn: !isError && !!data,
  };
}
