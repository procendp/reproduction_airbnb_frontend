import { Box, Grid, Skeleton, SkeletonText } from "@chakra-ui/react";
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
      <Box>
        <Skeleton height={280} rounded="2xl" mb={6} />
        <SkeletonText w="50%" noOfLines={2} mb={6} />
        <SkeletonText w="20%" noOfLines={1} />
      </Box>
      <Room />
    </Grid>
  );
}
