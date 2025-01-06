import { FaRegHeart, FaStar } from "react-icons/fa";
import {
  Box,
  Button,
  Grid,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

export default function Room() {
  const gray = useColorModeValue("gray.500", "gray.300");
  return (
    <VStack spacing={-0.5} alignItems={"flex-start"}>
      <Box position="relative" overflow={"hidden"} mb={2} rounded="3xl">
        <Image
          minH="280"
          src="https://a0.muscache.com/im/pictures/miso/Hosting-946910670853213323/original/1b1f1341-4cae-4e8b-9ded-2007e703d746.jpeg?im_w=720&im_format=avif"
        />
        <Button
          variant={"unstyled"}
          position="absolute"
          top={0}
          right={0}
          color="white"
        >
          <FaRegHeart size="20px" />
        </Button>
      </Box>
      <Grid gap={2} templateColumns={"6fr 1fr"}>
        <Text as="b" noOfLines={1} fontSize="md">
          Fabulous river view luxury room
        </Text>
        <HStack spacing={1}>
          <FaStar size={15} />
          <Text>5.0</Text>
        </HStack>
      </Grid>
      <Text fontSize={"sm"} color={gray}>
        Bangkok, Thailand
      </Text>
      <Text fontSize={"sm"} color={gray}>
        <Text as="b">$8,215</Text> / night
      </Text>
    </VStack>
  );
}
