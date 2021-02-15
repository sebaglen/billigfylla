import React from 'react';
import { Box, BoxProps, List, ListItem, Stack, Text } from '@chakra-ui/react';
import ToggleToken from './ToggleToken';

interface ListHeaderProps extends BoxProps {
  tokens: string[];
  selectedTokens: string[];
  setSelectedTokens: (selectedTokens: string[]) => void;
}
const ListHeader = ({
  tokens,
  selectedTokens,
  setSelectedTokens,
  ...rest
}: ListHeaderProps) => {
  const handleChange = (token: string, isToggled: boolean) => {
    if (isToggled) {
      setSelectedTokens([...selectedTokens, token]);
    } else {
      setSelectedTokens([...selectedTokens.filter((t) => t !== token)]);
    }
  };

  return (
    <Box {...rest}>
      <Text fontSize="xs">Alternativer</Text>
      <List alignItems="center" pt="10px" spacing={1}>
        <Stack direction="row">
          {tokens.map((token) => (
            <ListItem key={token}>
              <ToggleToken
                title={token}
                isToggled={selectedTokens.includes(token)}
                onToggle={(isToggled) => handleChange(token, isToggled)}
              />
            </ListItem>
          ))}
        </Stack>
      </List>
    </Box>
  );
};

export default ListHeader;
