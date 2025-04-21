import { Heading, Spinner, Text, useToast, VStack } from "@chakra-ui/react";
import { useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { kakaoLogIn } from "../api";
import { useQueryClient } from "@tanstack/react-query";

export default function KakaoConfirm() {
  console.log("KakaoConfirm component rendered");
  const { search } = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  console.log("Current search params:", search);

  const confirmLogin = useCallback(async () => {
    console.log("confirmLogin function called");
    const params = new URLSearchParams(search);
    const code = params.get("code");
    console.log("Kakao auth code:", code);

    if (code) {
      try {
        console.log("Attempting Kakao login...");
        const status = await kakaoLogIn(code);
        console.log("Kakao login response status:", status);

        if (status === 200) {
          console.log("Login successful, redirecting...");
          await queryClient.invalidateQueries(["me"]);

          toast({
            status: "success",
            title: "Welcome!",
            position: "bottom-right",
            description: "Happy to have you back!",
          });

          navigate("/", { replace: true });
        }
      } catch (error: any) {
        console.error("Kakao login error details:", {
          error: error,
          response: error.response,
          data: error.response?.data,
          status: error.response?.status,
        });
        toast({
          status: "error",
          title: "Login failed",
          position: "bottom-right",
          description:
            error.response?.data?.error ||
            "Something went wrong during login. Please try again.",
        });
        navigate("/");
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
