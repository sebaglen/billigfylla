import {
  Text,
  List,
  ListItem,
  Box,
  Spinner,
} from '@chakra-ui/react'

import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import React, { useEffect, useState } from 'react'
import AlkoCard from '../components/AlkoCard'


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

  return (<Container height="100vh">
    <Main maxHeight="100%" >
      <Text>
        Billigste alkis
      </Text>

      <AlkoCard alko={alkohyler[0]} isMain/>

      <List spacing={3} my={0} display="relative" height="100%" overflow="auto" >
        {alkohyler
          .slice(1)
          .map((alko => (
            <ListItem key={alko.productId}>
              <AlkoCard alko={alko} />
            </ListItem>
          )))}
      </List>
    </Main>

    <DarkModeSwitch />
  </Container>
  )
}

export default Index
