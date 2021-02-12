import {
  Text,
  List,
  ListItem,
} from '@chakra-ui/react'

import { Container } from '../components/Container'
import { Main } from '../components/Main'
import { DarkModeSwitch } from '../components/DarkModeSwitch'
import React, { useEffect, useState } from 'react'
import AlkoCard from '../components/AlkoCard'


const Index = () => {
  const [alkohyler, setAlkohyler] = useState<Alko[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/get-products')
      .then(res => res.json())
      .then(res => setAlkohyler(res))
      .then(() => setIsLoading(false))
  }, [])

  return (<Container height="100vh">
    <Main>
      <Text>
        Billigste alkis
      </Text>

      <AlkoCard alko={alkohyler[0]} isMain/>

      <List spacing={3} my={0} >
        {alkohyler
          .slice(1)
          .map((alko => (
            <ListItem>
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
