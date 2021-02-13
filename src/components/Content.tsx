import { Box, BoxProps } from "@chakra-ui/react";

const Content = ({children, ...rest}: BoxProps) => (
  <Box 
    width="100%" 
    maxWidth="40rem" 
    paddingX={5} 
    {...rest}
  >
    {children}
  </Box>
);

export default Content;
