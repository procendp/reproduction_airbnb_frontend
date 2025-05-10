import {
  Button,
  Heading,
  Spinner,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
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
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [retryCount, setRetryCount] = React.useState(0);
  const MAX_RETRIES = 3;

  console.log("[DEBUG] GithubConfirm 컴포넌트가 렌더링되었습니다");
  console.log("[DEBUG] 현재 URL:", window.location.href);
  console.log("[DEBUG] Search 파라미터:", search);

  const confirmLogin = async (isRetry = false) => {
    try {
      if (isRetry) {
        setIsRetrying(true);
        setRetryCount((prev) => prev + 1);
        console.log(
          "[DEBUG] 재시도 중... (시도 횟수:",
          retryCount + 1,
          "/",
          MAX_RETRIES,
          ")"
        );
      }

      const params = new URLSearchParams(search);
      const code = params.get("code");
      const errorParam = params.get("error");

      console.log("[DEBUG] GitHub 인증 코드:", code);
      console.log("[DEBUG] GitHub 에러:", errorParam);

      if (errorParam) {
        console.error("[DEBUG] GitHub 인증 에러:", errorParam);
        setError(`GitHub 인증 중 오류가 발생했습니다: ${errorParam}`);
        await new Promise<void>((resolve) => {
          toast({
            status: "error",
            title: "Login failed",
            position: "bottom-right",
            description: errorParam,
            duration: 3000,
            onCloseComplete: () => resolve(),
          });
          setTimeout(() => resolve(), 1000);
        });
        navigate("/", { replace: true });
        return;
      }

      if (!code) {
        console.error("[DEBUG] 인증 코드가 없습니다");
        setError("잘못된 접근입니다. 인증 코드가 없습니다.");
        await new Promise<void>((resolve) => {
          toast({
            status: "error",
            title: "Login failed",
            position: "bottom-right",
            description: "잘못된 접근입니다. 인증 코드가 없습니다.",
            duration: 3000,
            onCloseComplete: () => resolve(),
          });
          setTimeout(() => resolve(), 1000);
        });
        navigate("/", { replace: true });
        return;
      }

      console.log("[DEBUG] GitHub 로그인 시도 중...");
      const result = await githubLogIn(code);
      console.log("[DEBUG] 로그인 결과:", result);

      if (result.status === 200) {
        console.log("[DEBUG] 로그인 성공");
        setIsRetrying(false);

        await queryClient.invalidateQueries(["me"]);
        await new Promise<void>((resolve) => {
          toast({
            status: "success",
            title: "Welcome!",
            position: "bottom-right",
            description: "Happy to have you back!",
            duration: 3000,
            onCloseComplete: () => resolve(),
          });
          setTimeout(() => resolve(), 1000);
        });

        console.log("[DEBUG] 홈으로 리다이렉트 준비 중...");
        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log("[DEBUG] 홈으로 리다이렉트 및 새로고침");
        navigate("/", { replace: true });
      } else {
        throw new Error(result.error || "로그인에 실패했습니다.");
      }
    } catch (e: any) {
      console.error("[DEBUG] 로그인 처리 중 에러:", e);

      // 504 에러나 네트워크 에러인 경우 재시도 로직 실행
      if (
        retryCount < MAX_RETRIES &&
        (e.message?.includes("504") ||
          e.message?.includes("timeout") ||
          e.message?.includes("network"))
      ) {
        setError(
          `서버 응답 지연... 자동으로 재시도합니다. (${
            retryCount + 1
          }/${MAX_RETRIES})`
        );
        // 지수 백오프를 사용하여 재시도 간격을 점진적으로 늘림
        const retryDelay = Math.min(1000 * Math.pow(2, retryCount), 8000);
        setTimeout(() => confirmLogin(true), retryDelay);
      } else {
        setIsRetrying(false);
        setError("로그인 처리 중 오류가 발생했습니다. 다시 시도해 주세요.");
        await new Promise<void>((resolve) => {
          toast({
            status: "error",
            title: "Login failed",
            position: "bottom-right",
            description:
              e?.response?.data?.error ||
              e.message ||
              "Something went wrong during login.",
            duration: 3000,
            onCloseComplete: () => resolve(),
          });
          setTimeout(() => resolve(), 1000);
        });
        navigate("/", { replace: true });
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    setRetryCount(0);
    setIsRetrying(false);
    confirmLogin();
  };

  useEffect(() => {
    window.alert("GithubConfirm mounted");
    confirmLogin();
    // eslint-disable-next-line
  }, []);

  return (
    <VStack justifyContent={"center"} mt={40} spacing={4}>
      <Heading>GitHub 로그인 처리 중...</Heading>
      {error ? (
        <>
          <Heading size="md" color="red.400">
            에러 발생
          </Heading>
          <Text>{error}</Text>
          {!isRetrying && (
            <Button
              colorScheme="blue"
              onClick={handleRetry}
              isLoading={isRetrying}
            >
              다시 시도
            </Button>
          )}
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
