import {
  Box,
  Heading,
  List,
  ListItem,
  SkeletonCircle,
  SkeletonText,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import { stringify } from 'query-string';
import React, { useEffect, useState } from 'react';
import AlkoCard from '../components/AlkoCard';
import { Container } from '../components/Container';
import Content from '../components/Content';
import ListHeader from '../components/ListHeader';
import { Main } from '../components/Main';
import SearchBar from '../components/SearchBar';
import StickyHeader from '../components/StickyHeader';
import TopAlko from '../components/TopAlko';
import useDebounce from '../hooks/useDebounce';

const fetchAlcohol = (
  searchQuery: string,
  alcoholTypes: string[]
): Promise<Alko[]> =>
  fetch(
    `/api/get-products?${stringify({ searchQuery, alcoholTypes, limit: 50 })}`
  ).then((res) => res.json());

const Index = () => {
  const [topAlko, setTopAlko] = useState<Alko>();
  const [alkohyler, setAlkohyler] = useState<Alko[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [alcoholTypes, setAlcoholTypes] = useState<string[]>([
    'Vin',
    'Øl',
    'Sprit',
  ]);
  // const [location, setLocation] = useState<GeolocationPosition>();
  const debouncedSearchQuery = useDebounce<string>(searchQuery, 400);
  const debouncedAlcoholTypes = useDebounce<string[]>(alcoholTypes, 400);

  useEffect(() => {
    setIsLoading(true);
    fetchAlcohol(searchQuery, alcoholTypes)
      .then((res) => {
        if (res.length) {
          setTopAlko(res[0]);
        }
        setAlkohyler(res.slice(1));
      })
      .finally(() => setIsLoading(false));
  }, [debouncedSearchQuery, debouncedAlcoholTypes]);

  /*useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setLocation);
    }
  }, []);*/

  if (!topAlko) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        justifyContent="space-around"
        alignItems="center"
      >
        <Spinner />
      </Box>
    );
  }

  return (
    <Container height="100vh">
      <StickyHeader>
        <Heading fontSize="lg">Billigfylla</Heading>
      </StickyHeader>
      <Main mt="2.5rem" alignItems="center" pb="5">
        <Stack bg="brand" width="full" alignItems="center" pb="45px" mb="-54px">
          <Content pt="1rem">
            <TopAlko alko={topAlko} />
            <SearchBar query={searchQuery} onSearch={setSearchQuery} />
          </Content>
        </Stack>
        <Content>
          <Box borderRadius="lg" borderWidth="1px" boxShadow="md" bg="white">
            <ListHeader
              p={3}
              tokens={['Vin', 'Øl', 'Sprit', 'Annet']}
              selectedTokens={alcoholTypes}
              setSelectedTokens={setAlcoholTypes}
              borderBottom="1px solid"
              borderColor="darkGrey"
            />
            <List spacing={0} my={0} display="relative" height="100%" px={3}>
              {alkohyler.map((alko, index) =>
                isLoading ? (
                  <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                    p="3"
                    borderTop={index === 0 ? 'none' : '1px'}
                    borderColor="darkGrey"
                  >
                    <SkeletonCircle size="10" />
                    <SkeletonText noOfLines={4} spacing="4" width="85%" />
                  </Stack>
                ) : (
                  <ListItem key={alko.productId}>
                    <AlkoCard
                      alko={alko}
                      borderTop={index === 0 ? 'none' : '1px'}
                      borderColor="darkGrey"
                    />
                  </ListItem>
                )
              )}
            </List>
          </Box>
        </Content>
      </Main>
    </Container>
  );
};

export default Index;
