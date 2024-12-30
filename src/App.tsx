// import * as React from "react";
import React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
} from "@chakra-ui/react";
// import { ColorModeSwitcher } from "./ColorModeSwitcher";
// import { Logo } from "./Logo";

function App() {
  return (
    <div>
      <Text color={"red.600"} fontSize={"6xl"}>
        It works!
      </Text>
    </div>
  );
}
// export const App = () => (
//   <div>
//     <Text>It works!</Text>
//   </div>
// );

// export const App = () => (
//   <ChakraProvider theme={theme}>
//     <Box textAlign="center" fontSize="xl">
//       <Grid minH="100vh" p={3}>
//         <ColorModeSwitcher justifySelf="flex-end" />
//         <VStack spacing={8}>
//           {/* <Logo h="40vmin" pointerEvents="none" /> */}
//           <Text>
//             Edit <Code fontSize="xl">src/App.tsx</Code> and save to reload.
//           </Text>
//           <Link
//             color="teal.500"
//             href="https://chakra-ui.com"
//             fontSize="2xl"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Learn Chakra
//           </Link>
//         </VStack>
//       </Grid>
//     </Box>
//   </ChakraProvider>
// );

// function App() {
//   return <div />;
// }

export default App;
