import { Heading, Spinner, Text, useToast, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { githubLogIn } from "../api";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function GithubConfirm() {
  const { search } = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  console.log("[DEBUG] GithubConfirm 렌더링됨");
  const confirmLogin = async () => {
    const params = new URLSearchParams(search);
    const code = params.get("code");
    console.log("[GithubConfirm] confirmLogin called, code:", code);
    if (code) {
      const result = await githubLogIn(code);
      if (result.status === 200) {
        toast({
          status: "success",
          title: "Welcome!",
          position: "bottom-right",
          description: "Happy to have you back!",
        });
        await queryClient.refetchQueries(["me"]);
        console.log("[GithubConfirm] refetched me, navigating home");
        navigate("/");
      } else {
        setError(result.error || "로그인에 실패했습니다. 다시 시도해 주세요.");
      }
    } else {
      setError("잘못된 접근입니다. 인증 코드가 없습니다.");
    }
  };
  useEffect(() => {
    console.log("[GithubConfirm] useEffect triggered, search:", search);
    confirmLogin();
  }, []);
  return (
    <VStack justifyContent={"center"} mt={40}>
      <Heading color="red.500">[DEBUG] GithubConfirm 라우트 진입!</Heading>
      {error ? (
        <>
          <Heading color="red.400">에러 발생</Heading>
          <Text>{error}</Text>
        </>
      ) : (
        <>
          <Heading>Processing log in...</Heading>
          <Text>Don't go anywhere.</Text>
          <Spinner size="lg" />
        </>
      )}
    </VStack>
  );
}
