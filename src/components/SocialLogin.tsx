import { FaComment, FaGithub } from "react-icons/fa";
import {
  Box,
  Button,
  Divider,
  HStack,
  LightMode,
  Text,
  VStack,
} from "@chakra-ui/react";

export default function SocialLogin() {
  const kakaoParams = {
    client_id: "49680a104a0135230f503a6343d1b368",
    redirect_uri:
      process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:3000/social/kakao"
        : "https://airbnb-frontend-u9m8.onrender.com/social/kakao",
    response_type: "code",
  };
  const params = new URLSearchParams(kakaoParams).toString();

  const githubParams = {
    client_id: "Ov23liPfh3H8KNxVkYCb",
    redirect_uri:
      process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:3000/social/github"
        : "https://airbnb-frontend-u9m8.onrender.com/social/github",
    scope: "read:user,user:email",
  };
  const githubUrl = `https://github.com/login/oauth/authorize?${new URLSearchParams(
    githubParams
  ).toString()}`;

  console.log("[DEBUG] Social Login Component Rendered");
  console.log("[DEBUG] GitHub URL:", githubUrl);
  console.log(
    "[DEBUG] Kakao URL:",
    `https://kauth.kakao.com/oauth/authorize?${params}`
  );

  const handleGithubLogin = () => {
    console.log("[DEBUG] GitHub login button clicked");
    console.log("[DEBUG] Redirecting to:", githubUrl);
    window.location.href = githubUrl;
  };

  const handleKakaoLogin = () => {
    console.log("[DEBUG] Kakao login button clicked");
    console.log(
      "[DEBUG] Redirecting to:",
      `https://kauth.kakao.com/oauth/authorize?${params}`
    );
    window.location.href = `https://kauth.kakao.com/oauth/authorize?${params}`;
  };

  return (
    <Box mb={4}>
      <HStack my={8}>
        <Divider />
        <Text textTransform={"uppercase"} color="gray.500" fontSize="xs" as="b">
          Or
        </Text>
        <Divider />
      </HStack>
      <VStack>
        <LightMode>
          <Button onClick={handleGithubLogin} w="100%" leftIcon={<FaGithub />}>
            Continue with Github
          </Button>
          <Button
            onClick={handleKakaoLogin}
            w="100%"
            leftIcon={<FaComment />}
            colorScheme={"yellow"}
          >
            Continue with Kakao
          </Button>
        </LightMode>
      </VStack>
    </Box>
  );
}
