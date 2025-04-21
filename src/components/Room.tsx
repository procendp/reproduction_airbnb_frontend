import { FaCamera, FaRegHeart, FaStar } from "react-icons/fa";
import {
  Box,
  Button,
  Grid,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import React from "react";

interface IRoomProps {
  imageUrl: string;
  name: string;
  rating: number;
  city: string;
  country: string;
  price: number;
  pk: number;
  isOwner: boolean;
}
export default function Room({
  pk,
  imageUrl,
  name,
  rating,
  city,
  country,
  price,
  isOwner,
}: IRoomProps) {
  const gray = useColorModeValue("gray.500", "gray.300");
  const navigate = useNavigate();
  const toast = useToast();

  const onCameraClick = () => {
    if (!isOwner) {
      toast({
        status: "error",
        title: "Permission denied",
        description: "You need to be the owner of this room to upload photos.",
      });
      return;
    }
    navigate(`/rooms/${pk}/photos`);
  };

  const onRoomClick = () => {
    navigate(`/rooms/${pk}`);
  };
  return (
    <VStack spacing={-0.5} alignItems={"flex-start"}>
      <Box
        onClick={onRoomClick}
        cursor="pointer"
        height="30vh"
        width="30vh"
        position="relative"
        overflow={"hidden"}
        mb={2}
        rounded="3xl"
      >
        {imageUrl ? (
          <Image
            objectFit={"cover"}
            w="100%"
            h="100%"
            minH="280"
            src={imageUrl}
          />
        ) : (
          <Image
            objectFit={"cover"}
            w="100%"
            h="100%"
            minH="280"
            src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&auto=format&fit=crop"
          />
        )}
        <Button
          variant={"unstyled"}
          position="absolute"
          top={0}
          right={0}
          onClick={(e) => {
            e.stopPropagation();
            onCameraClick();
          }}
          color="white"
          zIndex={1}
        >
          {isOwner ? <FaCamera size="20px" /> : <FaRegHeart size="20px" />}
        </Button>
      </Box>
      <Box onClick={onRoomClick} cursor="pointer" w="100%">
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
      </Box>
    </VStack>
  );
}
