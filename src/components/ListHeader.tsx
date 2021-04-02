import React, { useState } from 'react';
import {
  Box,
  BoxProps,
  List,
  ListItem,
  Wrap,
  Text,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Stack,
} from '@chakra-ui/react';
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

  const [slider, setSlider] = useState<Number>(300);

  return (
    <Box {...rest}>
      <List alignItems="center" pt="10px" spacing={1}>
        <Wrap>
          {tokens.map((token) => (
            <ListItem key={token}>
              <ToggleToken
                title={token}
                isToggled={selectedTokens.includes(token)}
                onToggle={(isToggled) => handleChange(token, isToggled)}
              />
            </ListItem>
          ))}
        </Wrap>
      </List>
      <Stack direction="row" justifyContent="space-between" marginTop="15px">
        <Text fontSize="sm">Makspris for vare</Text>
        <Text fontSize="sm">{slider < 1000 ? `${slider} kr` : 'Viser alt'}</Text>
      </Stack>
      <Stack direction="row">
        <Slider colorScheme="blue" aria-label="slider-ex-2" marginTop="10px" min={0} max={1000} step={10} defaultValue={300} onChange={val => setSlider(val)}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </Stack>
    </Box>
  );
};

export default ListHeader;
