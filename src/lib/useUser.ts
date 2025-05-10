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
  // 세션이 없으면 로딩 중이 아님(비로그인 상태)
  if (!hasSession) {
    return {
      userLoading: false,
      user: null,
      isLoggedIn: false,
    };
  }
  return {
    userLoading: isLoading,
    user: data,
    isLoggedIn: !isError && !!data,
  };
}
