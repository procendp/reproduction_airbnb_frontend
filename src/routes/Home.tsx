import {
  Box,
  Button,
  Grid,
  Heading,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaRegHeart, FaStar } from "react-icons/fa";
import Room from "../components/Room";

export default function Home() {
  return (
    <Grid
      mt={10}
      px={{
        base: 10, //on mobile
        lg: 40, //on desktop
      }}
      columnGap={4}
      rowGap={8}
      templateColumns={{
        sm: "1fr",
        md: "1fr 1fr",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
        "2xl": "repeat(5, 1fr)",
      }}
    >
      {[
        1, 2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 8, 9, 8, 2, 2, 2, 2, 2, 2, 2, 2, 5,
        5, 6, 7, 8, 99, 8, 3, 5, 4,
      ].map((index) => (
        <Room key={index} />
      ))}
    </Grid>
  );
}
