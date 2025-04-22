import { Heading, Spinner, Text, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { kakaoLogin } from "../api";
import { useQueryClient } from "@tanstack/react-query";

export default function KakaoConfirm() {
  console.log("KakaoConfirm component rendered");
  const { search } = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  console.log("Current search params:", search);
  console.log("Current location:", window.location.href);

  const confirmLogin = useCallback(async () => {
    console.log("confirmLogin function called");
    const params = new URLSearchParams(search);
    const code = params.get("code");
    console.log("Kakao auth code:", code);

    if (code) {
      try {
        console.log("Attempting Kakao login...");
        const status = await kakaoLogin(code);
        console.log("Kakao login response status:", status);

        if (status === 200) {
          console.log("Login successful");

          // 먼저 토스트 메시지를 표시
          toast({
            status: "success",
            title: "Welcome!",
            position: "bottom-right",
            description: "Happy to have you back!",
            duration: 3000,
          });

          // 쿼리 무효화를 기다림
          await queryClient.invalidateQueries(["me"]);

          // 짧은 지연 후 리다이렉트
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      } catch (error: any) {
        console.error("Kakao login error details:", {
          error: error,
          response: error.response,
          data: error.response?.data,
          message: error.message,
          stack: error.stack,
        });
        toast({
          status: "error",
          title: "Login failed",
          position: "bottom-right",
          description:
            error.response?.data?.error ||
            error.message ||
            "Something went wrong during login.",
          duration: 3000,
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } else {
      console.error("No code found in URL parameters");
      navigate("/");
    }
  }, [search, toast, queryClient, navigate]);

  useEffect(() => {
    console.log("useEffect triggered");
    confirmLogin();
  }, [confirmLogin]);

  return (
    <VStack justifyContent={"center"} mt={40}>
      <Heading>Processing log in...</Heading>
      <Text>Don't go anywhere.</Text>
      <Spinner size="lg" />
    </VStack>
  );
}
