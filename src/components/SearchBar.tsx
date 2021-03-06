import {
  Box,
  BoxProps,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { Search2Icon } from '@chakra-ui/icons';

interface SearchBarProps extends BoxProps {
  query: string;
  onSearch: (query: string) => void;
}

const SearchBar = ({ query, onSearch, ...rest }: SearchBarProps) => (
  <Box
    bg="white"
    borderWidth="1px"
    borderRadius="lg"
    p="10px"
    boxShadow="md"
    {...rest}
  >
    <InputGroup>
      <Input
        borderRadius={25}
        bg="lightGrey"
        borderColor="darkGrey"
        placeholder="Søk etter produkt"
        value={query}
        onChange={(e) => onSearch(e.target.value)}
      />
      <InputRightElement>
        <Search2Icon />
      </InputRightElement>
    </InputGroup>
  </Box>
);

export default SearchBar;
