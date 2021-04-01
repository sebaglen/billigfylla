import {
  Text,
  Box,
  Heading,
  Spinner,
  Button,
  Stack,
  BoxProps,
} from '@chakra-ui/react';
import Image from 'next/image';
import React from 'react';

interface AlkoCardProps extends BoxProps {
  alko?: Alko;
}

const AlkoCard = ({ alko, ...rest }: AlkoCardProps) => {
  if (!alko) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        p="6"
        textAlign="center"
        {...rest}
      >
        <Spinner />
      </Box>
    );
  }

  return (
    <Box p="3" {...rest}>
      <Stack direction="row" alignItems="center">
        <Box padding="0 13px 0 13px">
          <Image
            src={`https://bilder.vinmonopolet.no/cache/300x300-0/${alko.productId}-1.jpg`}
            objectFit="contain"
            width={50}
            height={75}
          />
        </Box>
        <Box width="85%">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="baseline"
          >
            <Heading fontSize="lg">{alko.alkPerNOK.toFixed(0)} kr/l</Heading>
            <Text fontSize="lg">{alko.price.toFixed(0)} kr</Text>
          </Stack>
          <Text
            fontSize="sm"
            fontWeight="light"
            pr="70px"
            overflow="hidden"
            maxHeight="36px"
            white-space="nowrap"
            textOverflow="ellipsis"
          >
            {alko.name}
          </Text>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-end"
            marginTop="5px"
          >
            <Stack fontSize="sm" justifyContent="flex-end" spacing={0}>
              <Text>{alko.alcoholContent}%</Text>
              <Text mt="0px">{alko.volume}L</Text>
            </Stack>
            <Button
              variant="outline"
              borderColor="brand"
              size="sm"
              as="a"
              href={`http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-${alko.productId}`}
            >
              Kjøp
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default AlkoCard;
