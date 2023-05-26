// src/pages/funcionario.tsx
import React, { useState, useEffect }  from 'react';

import {
  Box,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Heading,
  Text,
} from '@chakra-ui/react';

const FuncionarioPage = () => {
  // aqui você pode obter o nome do funcionário logado e a data/hora atual
  const funcionarioNome = 'João';
  const [currentDate, setCurrentDate] = useState<string | null>(null);
  useEffect(() => {
    setCurrentDate(new Date().toLocaleString('pt-BR'));
  }, []);


  return (
    <Box p="6">
      <Heading mb="4">Bem-vindo, {funcionarioNome}</Heading>
      <Text mb="8">Data e hora: {currentDate}</Text>

      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>Atividades para o empregado do salão</Tab>
          <Tab>Atividades para a cozinha</Tab>
          <Tab>Atividades administrativas</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Heading size="lg" mb="4">Atividades para o empregado do salão</Heading>
            {/* Adicione aqui os componentes de consulta de reservas, atribuição de mesa, adição/remoção de pedidos */}
          </TabPanel>
          <TabPanel>
            <Heading size="lg" mb="4">Atividades para a cozinha</Heading>
            {/* Adicione aqui os componentes relevantes para a cozinha */}
          </TabPanel>
          <TabPanel>
            <Heading size="lg" mb="4">Atividades administrativas</Heading>
            {/* Adicione aqui os componentes relevantes para as atividades administrativas */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default FuncionarioPage;
