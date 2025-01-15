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
import { Link } from "react-router-dom";

interface IRoomProps {
  imageUrl: string;
  name: string;
  rating: number;
  city: string;
  country: string;
  price: number;
  pk: number;
}
export default function Room({
  pk,
  imageUrl,
  name,
  rating,
  city,
  country,
  price,
}: IRoomProps) {
  const gray = useColorModeValue("gray.500", "gray.300");
  return (
    <Link to={`/rooms/${pk}`}>
      <VStack spacing={-0.5} alignItems={"flex-start"}>
        <Box
          height="30vh"
          width="30vh"
          position="relative"
          overflow={"hidden"}
          mb={2}
          rounded="3xl"
        >
          <Image
            objectFit={"cover"}
            w="100%"
            h="100%"
            minH="280"
            src={imageUrl}
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
        <Grid gap={5} templateColumns={"6fr 1fr"}>
          <Text as="b" noOfLines={1} fontSize="md">
            {name}
          </Text>

          <HStack spacing={3.5}>
            <FaStar size={15} />
            <Text>{rating}</Text>
          </HStack>
        </Grid>
        <Text fontSize={"sm"} color={gray}>
          {city}, {country}
        </Text>
        <Text fontSize={"sm"} color={gray}>
          <Text as="b">${price}</Text> / night
        </Text>
      </VStack>
    </Link>
  );
}
