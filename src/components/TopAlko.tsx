import { Text, Box, Heading, Stack, BoxProps } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

interface AlkoCardProps extends BoxProps {
  alko?: Alko;
}

export const AlkoCard = ({ alko, ...rest }: AlkoCardProps) => (
  <Box padding={5} {...rest}>
    <Stack alignItems="center" spacing={0}>
      <Box textAlign="center">
        <Text fontSize="xl" fontWeight="thin">
          {alko?.name}
        </Text>
      </Box>
      <Stack direction="row" alignItems="baseline" justifyContent="center">
        <Heading fontSize="2xl">{alko?.alkPerNOK.toFixed(0)}</Heading>
        <Heading fontSize="xl">kr</Heading>
      </Stack>
      <Text fontSize="md" fontWeight="thin">per 1 liter ren alkohol.</Text>
      <Box
        alignItems="center"
        justifyContent="space-around"
        display="flex"
        padding={50}
      >
        <div className="sale-shape rotate" />
        <Image
          loading="eager"
          src={`https://bilder.vinmonopolet.no/cache/300x300-0/${alko?.productId}-1.jpg`}
          objectFit="contain"
          width={100}
          height={150}
        />
      </Box>
    </Stack>
  </Box>
);

export default AlkoCard;
