import { Text, Box, Heading, Button, Stack, BoxProps } from "@chakra-ui/react"
import Image from 'next/image';
import React from "react";

interface AlkoCardProps extends BoxProps {
    alko: Alko;
}

export const AlkoCard = ({ alko, ...rest }: AlkoCardProps) => {
    return <Box padding={5} {...rest}>
        <Stack alignItems={'center'} spacing={0}>
            <Box textAlign="center">
                <Heading fontSize="2xl">{alko.alkPerNOK.toFixed(0)} kr/l</Heading>
                <Text fontSize="sm">{alko.name}</Text>
                <Text fontSize="sm">{alko.type}</Text>
                <Stack fontSize="xl" direction="row" justifyContent="space-between">
                    <Text>{alko.price.toFixed(0)},-</Text>
                    <Text>{alko.volume}L</Text>
                    <Text>{alko.alcoholContent}%</Text>
                </Stack>
            </Box>
            <Box alignItems="center" justifyContent="space-around" display="flex" padding={50}>
                <div className="sale-shape rotate" />
                <Image loading="eager" src={`https://bilder.vinmonopolet.no/cache/300x300-0/${alko.productId}-1.jpg`} objectFit={'contain'} width={100} height={150}/>
            </Box>
            <Button as="a" href={`http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-${alko.productId}`}>Vis på Vinmonopolet</Button>
        </Stack>
    </Box>
};

export default AlkoCard;
