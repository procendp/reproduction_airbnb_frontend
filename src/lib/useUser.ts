import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api";

export default function useUser() {
  const { isLoading, data, isError } = useQuery(["me"], getMe, {
    retry: 1,
    staleTime: 300000, // 5분
  });
  return {
    userLoading: isLoading,
    user: data,
    isLoggedIn: !isError,
  };
}
