import React from "react";
import { Box, BoxProps, List, ListItem, Stack, Text } from "@chakra-ui/react"
import ToggleToken from "./ToggleToken";

interface ListHeaderProps extends BoxProps {
    tokens: string[];
}
export const ListHeader = ({ tokens, ...rest }: ListHeaderProps) => {
    return (
        <Box {...rest}>
            <Text fontSize="xs">Alternativer</Text>
            <List alignItems={'center'} p="10px 0" spacing={1}>
                <Stack direction="row">
                    {tokens.map(token =>
                        <ListItem>
                            <ToggleToken title={token} />
                        </ListItem>
                    )}
                </Stack>
            </List>
        </Box>
    )
};

export default ListHeader;
