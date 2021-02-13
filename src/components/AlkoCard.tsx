import { Text, Box, Heading, Spinner, Button, Stack } from "@chakra-ui/react"
import Image from 'next/image';
import React from "react";

export const AlkoCard = ({ alko, isMain = false }: { alko?: Alko, isMain?: boolean }) => {

    if (!alko) {
        return <Box borderWidth="1px" borderRadius="lg" p="6" textAlign="center">
            <Spinner />
        </Box>
    }

    return <Box borderWidth="1px" borderRadius="lg" p="3" boxShadow={isMain ? "lg" : "sm"}>
        <Stack direction="row" alignItems={'center'}>
            <Box padding='0 20px 0 20px'>
                <Image src={`https://bilder.vinmonopolet.no/cache/300x300-0/${alko.productId}-1.jpg`} objectFit={'contain'} width={isMain ? 50 : 35} height={isMain ? 150 : 75}/>
            </Box>
            <Box>
                <Heading size={isMain ? "lg" : "md"}>{alko.name}</Heading>
                <Text>NOK pr alkoliter: {alko.alkPerNOK.toFixed(2)},-</Text>
                <Button as="a" href={`http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-${alko.productId}`}>Vis på Vinmonopolet</Button>
            </Box>
        </Stack>
    </Box>
};

export default AlkoCard;