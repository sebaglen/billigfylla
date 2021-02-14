import { chakra, BoxProps, Stack } from '@chakra-ui/react';
import { useViewportScroll } from 'framer-motion';
import React from 'react';

const Header = (props: BoxProps) => {
  const { children } = props;
  const ref = React.useRef<HTMLHeadingElement>(null);
  const [y, setY] = React.useState(0);
  const { height = 0 } = ref.current?.getBoundingClientRect() ?? {};

  const { scrollY } = useViewportScroll();
  React.useEffect(() => scrollY.onChange(() => setY(scrollY.get())), [scrollY]);

  return (
    <chakra.header
      ref={ref}
      shadow={y > height ? 'sm' : undefined}
      transition="box-shadow 0.2s"
      pos="fixed"
      top="0"
      zIndex="3"
      left="0"
      right="0"
      width="full"
      background="brand"
      {...props}
    >
      <chakra.div height="4.5rem" mx="auto" maxW="1200px">
        <Stack alignItems="center" justifyContent="space-around" height="100%">
          {children}
        </Stack>
      </chakra.div>
    </chakra.header>
  );
};

export default Header;
