import React from 'react';
import {
  Box,
  Text,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import {
  MdBarChart,
  MdPieChart,
} from 'react-icons/md';

export default function Analytics() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Text fontSize="2xl" fontWeight="bold" mb="20px" color={textColor}>
        Reports & Analytics
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="20px">
        <Card p="20px" minH="300px">
            <Text fontSize="lg" fontWeight="bold" mb="10px">Fee Collection Trend</Text>
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <MdBarChart size="100px" color="gray" />
                <Text color="gray.500">Chart Visualization Placeholder</Text>
            </Box>
        </Card>
        <Card p="20px" minH="300px">
            <Text fontSize="lg" fontWeight="bold" mb="10px">Hostel Occupancy</Text>
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                <MdPieChart size="100px" color="gray" />
                <Text color="gray.500">Chart Visualization Placeholder</Text>
            </Box>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
