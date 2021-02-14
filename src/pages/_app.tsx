import { ChakraProvider } from '@chakra-ui/react';
import '../../global-styles.css';

import { AppProps } from 'next/app';
import theme from '../theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

export default MyApp;
