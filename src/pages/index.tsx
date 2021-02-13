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


const Index = () => {
  const [alkohyler, setAlkohyler] = useState<Alko[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
        <Stack bg="brand" width="full" alignItems="center">
          <Content pt="4.5rem" >
            <TopAlko alko={alkohyler[0]}/>
          </Content>
        </Stack>
        <Content>
          <List spacing={3} my={0} display="relative" height="100%" >
            {alkohyler
              .slice(1)
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

export default Index
