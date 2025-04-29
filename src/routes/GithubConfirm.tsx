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

  console.log("[DEBUG] GithubConfirm 컴포넌트가 렌더링되었습니다");
  console.log("[DEBUG] 현재 URL:", window.location.href);
  console.log("[DEBUG] Search 파라미터:", search);

  const confirmLogin = async () => {
    try {
      const params = new URLSearchParams(search);
      const code = params.get("code");
      const error = params.get("error");

      console.log("[DEBUG] GitHub 인증 코드:", code);
      console.log("[DEBUG] GitHub 에러:", error);

      if (error) {
        console.error("[DEBUG] GitHub 인증 에러:", error);
        setError(`GitHub 인증 중 오류가 발생했습니다: ${error}`);
        return;
      }

      if (!code) {
        console.error("[DEBUG] 인증 코드가 없습니다");
        setError("잘못된 접근입니다. 인증 코드가 없습니다.");
        return;
      }

      console.log("[DEBUG] GitHub 로그인 시도 중...");
      const result = await githubLogIn(code);
      console.log("[DEBUG] 로그인 결과:", result);

      if (result.status === 200) {
        console.log("[DEBUG] 로그인 성공");
        toast({
          status: "success",
          title: "Welcome!",
          position: "bottom-right",
          description: "Happy to have you back!",
        });

        console.log("[DEBUG] 사용자 정보 새로고침 중...");
        await queryClient.refetchQueries(["me"]);

        console.log("[DEBUG] 홈으로 리다이렉트 중...");
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        console.error("[DEBUG] 로그인 실패:", result.error);
        setError(result.error || "로그인에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (e) {
      console.error("[DEBUG] 로그인 처리 중 에러:", e);
      setError("로그인 처리 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    console.log("[DEBUG] useEffect 실행됨");
    confirmLogin();
  }, []);

  return (
    <VStack justifyContent={"center"} mt={40}>
      <Heading>GitHub 로그인 처리 중...</Heading>
      {error ? (
        <>
          <Heading color="red.400">에러 발생</Heading>
          <Text>{error}</Text>
        </>
      ) : (
        <>
          <Text>잠시만 기다려주세요.</Text>
          <Spinner size="lg" />
        </>
      )}
    </VStack>
  );
}
