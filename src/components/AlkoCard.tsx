import { Text, Box, Heading, Spinner, Button } from "@chakra-ui/react"
import React from "react";

export const AlkoCard = ({ alko, isMain = false }: { alko?: Alko, isMain?: boolean }) => {

    if (!alko) {
        return <Box borderWidth="1px" borderRadius="lg" p="6" textAlign="center">
            <Spinner />
        </Box>
    }

    return <Box borderWidth="1px" borderRadius="lg" p="6" boxShadow={isMain ? "lg" : "sm"}>
        <Heading size={isMain ? "lg" : "md"}>{alko.name}</Heading>
        <Text>NOK pr alkoliter: {alko.alkPerNOK.toFixed(2)},-</Text>
        <Button as="a" href={`http://www.vinmonopolet.no/vareutvalg/varedetaljer/sku-${alko.productId}`}>Vis på Vinmonopolet</Button>
    </Box>
};

export default AlkoCard;