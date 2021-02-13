import { Text, Box, Heading, Button, Stack, useColorModeValue } from "@chakra-ui/react"
import Image from 'next/image';
import React from "react";

export const AlkoCard = ({ alko }: { alko: Alko}) => {
    const bg = useColorModeValue("green.200", "green.800")

    return <Box background={bg} padding={5}>
        <Stack alignItems={'center'} spacing={0}>
            <Box textAlign="center">
                <Heading size="xl">{alko.alkPerNOK.toFixed(0)} kr/l</Heading>
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
                <Image src={`https://bilder.vinmonopolet.no/cache/300x300-0/${alko.productId}-1.jpg`} objectFit={'contain'} width={100} height={150}/>
            </Box>
            <Button as="a" href={`http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-${alko.productId}`}>Vis på Vinmonopolet</Button>
        </Stack>
    </Box>
};

export default AlkoCard;
