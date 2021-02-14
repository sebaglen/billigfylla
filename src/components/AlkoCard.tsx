import { Text, Box, Heading, Spinner, Button, Stack } from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

interface AlkoCardProps {
  alko?: Alko;
  isMain?: boolean;
}

const AlkoCard = ({ alko, isMain = false }: AlkoCardProps) => {
  if (!alko) {
    return (
      <Box borderWidth="1px" borderRadius="lg" p="6" textAlign="center">
        <Spinner />
      </Box>
    );
  }

  return (
    <Box borderTop="1px" borderColor="darkGrey" p="3">
      <Stack direction="row" alignItems="center">
        <Box padding="0 20px 0 20px">
          <Image
            src={`https://bilder.vinmonopolet.no/cache/300x300-0/${alko.productId}-1.jpg`}
            objectFit="contain"
            width={isMain ? 50 : 35}
            height={isMain ? 150 : 75}
          />
        </Box>
        <Box>
          <Heading size={isMain ? 'lg' : 'md'}>{alko.name}</Heading>
          <Text>NOK pr alkoliter: {alko.alkPerNOK.toFixed(2)},-</Text>
          <Text>{alko.type}</Text>
          <Button
            as="a"
            href={`http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-${alko.productId}`}
          >
            Vis på Vinmonopolet
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default AlkoCard;
