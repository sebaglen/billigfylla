import {
  Box,
  BoxProps,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import useDebounce from '../hooks/useDebounce';

interface SearchBarProps extends BoxProps {
  query: string;
  onSearch: (query: string) => void;
}

const SearchBar = ({ query, onSearch, ...rest }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState<string>(query);
  const debouncedSearch = useDebounce<string>(inputValue, 250);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  return (
    <Box
      bg="white"
      borderWidth="1px"
      borderRadius="lg"
      p="3"
      boxShadow="md"
      {...rest}
    >
      <InputGroup>
        <Input
          borderRadius={25}
          bg="lightGrey"
          borderColor="darkGrey"
          placeholder="Søk etter produkt"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <InputRightElement>
          <Search2Icon />
        </InputRightElement>
      </InputGroup>
    </Box>
  );
};

export default SearchBar;
