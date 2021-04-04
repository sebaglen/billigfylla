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
  setSelectedSlider: (selectedSlider: number) => void;
}
const ListHeader = ({
  tokens,
  selectedTokens,
  setSelectedTokens,
  setSelectedSlider,
  ...rest
}: ListHeaderProps) => {
  const handleTokenChange = (token: string, isToggled: boolean) => {
    if (isToggled) {
      setSelectedTokens([...selectedTokens, token]);
    } else {
      setSelectedTokens([...selectedTokens.filter((t) => t !== token)]);
    }
  };
  const handleSliderChange = (value: number) => {
    setSelectedSlider(value === 1000 ? 999999 : value);
  };

  const [slider, setSlider] = useState<number>(700);

  return (
    <Box {...rest}>
      <List alignItems="center" pt="10px" spacing={1}>
        <Wrap>
          {tokens.map((token) => (
            <ListItem key={token}>
              <ToggleToken
                title={token}
                isToggled={selectedTokens.includes(token)}
                onToggle={(isToggled) => handleTokenChange(token, isToggled)}
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
        <Slider colorScheme="blue" aria-label="slider-ex-2" marginTop="10px" min={0} max={1000} step={10} defaultValue={700} onChange={val => setSlider(val)} onChangeEnd={val => handleSliderChange(val)}>
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
