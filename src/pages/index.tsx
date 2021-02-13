import {
  List,
  ListItem,
  Box,
  Spinner,
  Heading,
  Stack
} from '@chakra-ui/react'

import { Container } from '../components/Container'
import { Main } from '../components/Main'
import React, { useEffect, useState } from 'react'
import AlkoCard from '../components/AlkoCard'
import TopAlko from '../components/TopAlko'
import StickyHeader from '../components/StickyHeader'
import Content from '../components/Content'
import SearchBar from '../components/SearchBar'


const Index = () => {
  const [alkohyler, setAlkohyler] = useState<Alko[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/get-products?limit=50')
      .then(res => res.json())
      .then(res => setAlkohyler(res))
      .then(() => setIsLoading(false))
  }, [])

  if(isLoading) {
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
    )
  }

  return (
    <Container height="100vh">
      <StickyHeader>
        <Heading size="md">
          Billigfylla
        </Heading>
      </StickyHeader>
      <Main mt="4.5rem" alignItems="center">
        <Stack bg="brand" width="full" alignItems="center" pb="20" mb="-20">
          <Content pt="4.5rem" >
            <TopAlko alko={alkohyler[0]}/>
            <SearchBar query={searchQuery} onSearch={setSearchQuery} />
          </Content>
        </Stack>
        <Content>
          <List spacing={3} my={0} display="relative" height="100%" pb="10">
            {alkohyler
              .slice(1)
              .filter(alko => alko.name.match(new RegExp(searchQuery, 'gi')))
              .map((alko => (
                <ListItem key={alko.productId}>
                  <AlkoCard alko={alko} />
                </ListItem>
              )))}
          </List>
        </Content>
      </Main>
    </Container>
  )
}

export default Index;
