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
    redirect_url: "http://127.0.0.1:3000/social/kakao",
    response_type: "code",
  };
  const params = new URLSearchParams(kakaoParams).toString();
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
          <Button
            as="a"
            href="https://github.com/login/oauth/authorize?client_id=Ov23liPfh3H8KNxVkYCb&scope=read:user,user:email"
            w="100%"
            leftIcon={<FaGithub />}
          >
            Continue with Github
          </Button>
          <Button
            as="a"
            href={`https://kauth.kakao.com/oauth/authorize?${params}`}
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
