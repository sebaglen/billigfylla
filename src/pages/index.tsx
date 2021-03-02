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
import SearchBar from '../components/SearchBar';
import StickyHeader from '../components/StickyHeader';
import TopAlko from '../components/TopAlko';
import useDebounce from '../hooks/useDebounce';
import { useViewportScroll } from 'framer-motion';

const fetchAlcohol = (
  searchQuery: string,
  alcoholTypes: string[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  offset: number
): Promise<Alko[]> =>
  fetch(
    `/api/get-products?${stringify({
      searchQuery,
      alcoholTypes,
      limit: 40,
      offset,
    })}`
  ).then((res) => res.json());

const Index = () => {
  const [topAlko, setTopAlko] = useState<Alko>();
  const [alkohyler, setAlkohyler] = useState<Alko[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [offset, setOffset] = useState<number>(0);
  const [yScrolled, setYScrolled] = useState<number>(0);

  const ref = React.useRef<HTMLDivElement>(null);
  const { height = 0 } = ref.current?.getBoundingClientRect() ?? {};
  const { scrollY } = useViewportScroll();

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
    fetchAlcohol(searchQuery, alcoholTypes, offset)
      .then((res) => {
        if (res.length) {
          if (alkohyler.length === 0) {
            setTopAlko(res[0]);
            setAlkohyler(res.slice(1));
          } else {
            setAlkohyler(alkohyler.concat(res));
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, [debouncedSearchQuery, debouncedAlcoholTypes, offset]);

  useEffect(() => scrollY.onChange(() => setYScrolled(scrollY.get())), [
    scrollY,
  ]);

  useEffect(() => {
    if (height > 0 && isLoading === false) {
      const headerHeight = 40;
      const margin = 300; // pixel margin where we load new items
      if (
        headerHeight + height - margin <=
        yScrolled +
          Math.max(
            document.documentElement.clientHeight || 0,
            window.innerHeight || 0
          )
      ) {
        setOffset(offset + 40);
      }
    }
  }, [yScrolled, height]);

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
      <Stack
        spacing="1.5rem"
        width="100%"
        mt="2.5rem"
        alignItems="center"
        pb="5"
        ref={ref}
      >
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
            <List
              spacing={0}
              my={0}
              display="relative"
              height="100%"
              px={3}
              id="app"
            >
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
      </Stack>
    </Container>
  );
};

export default Index;
