import { Box, BoxProps } from "@chakra-ui/react";

const Content = ({children, ...rest}: BoxProps) => (
  <Box 
    maxWidth="48rem" 
    paddingX={5} 
    {...rest}
  >
    {children}
  </Box>
);

export default Content;
