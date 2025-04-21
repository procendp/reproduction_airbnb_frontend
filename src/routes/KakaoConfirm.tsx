import { Heading, Spinner, Text, useToast, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { kakaoLogIn } from "../api";
import { useQueryClient } from "@tanstack/react-query";

export default function KakaoConfirm() {
  const { search } = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const confirmLogin = async () => {
    const params = new URLSearchParams(search);
    const code = params.get("code");
    if (code) {
      try {
        const status = await kakaoLogIn(code);
        if (status === 200) {
          toast({
            status: "success",
            title: "Welcome!",
            position: "bottom-right",
            description: "Happy to have you back!",
          });
          queryClient.refetchQueries(["me"]);
          navigate("/");
        }
      } catch (error) {
        console.error("Kakao login error:", error);
        toast({
          status: "error",
          title: "Login failed",
          position: "bottom-right",
          description: "Something went wrong during login. Please try again.",
        });
        navigate("/");
      }
    }
  };
  useEffect(() => {
    confirmLogin();
  }, []);
  return (
    <VStack justifyContent={"center"} mt={40}>
      <Heading>Processing log in...</Heading>
      <Text>Don't go anywhere.</Text>
      <Spinner size="lg" />
    </VStack>
  );
}
