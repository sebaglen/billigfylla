import { Text, Box, Heading, Button, Stack, BoxProps } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

interface AlkoCardProps extends BoxProps {
  alko?: Alko;
}

export const AlkoCard = ({ alko, ...rest }: AlkoCardProps) => (
  <Box padding={5} {...rest}>
    <Stack alignItems="center" spacing={0}>
      <Box textAlign="center">
        <Stack direction="row" alignItems="baseline" justifyContent="center">
          <Heading fontSize="2xl">{alko?.alkPerNOK.toFixed(0)}</Heading>
          <Heading fontSize="xl">kr/l</Heading>
        </Stack>
        <Text fontSize="sm" fontWeight="thin">
          {alko?.name}
        </Text>
        <Stack
          fontSize="md"
          direction="row"
          justifyContent="space-between"
          fontWeight="regular"
        >
          <Text>{alko?.price.toFixed(0)}kr</Text>
          <Text>{alko?.volume}L</Text>
          <Text>{alko?.alcoholContent}%</Text>
        </Stack>
      </Box>
      <Box
        alignItems="center"
        justifyContent="space-around"
        display="flex"
        padding={50}
      >
        <div className="sale-shape rotate" />
        <Image
          loading="eager"
          src={`https://bilder.vinmonopolet.no/cache/300x300-0/${alko.productId}-1.jpg`}
          objectFit="contain"
          width={100}
          height={150}
        />
      </Box>
      <Button
        as="a"
        href={`http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-${alko.productId}`}
      >
        Vis på Vinmonopolet
      </Button>
    </Stack>
  </Box>
);

export default AlkoCard;
