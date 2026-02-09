import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import api from 'api/axios';

export default function ExamResults() {
  const [results, setResults] = useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  useEffect(() => {
    const fetchResults = async () => {
        try {
            const response = await api.get('/academics/results/my');
            setResults(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    fetchResults();
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex justifyContent="space-between" mb="20px">
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          My Grades
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {results.map((result) => (
          <Card key={result.id} p="20px" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                Exam ID: {result.exam_id}
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {result.marks_obtained}
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.500">
                Remarks: {result.remarks || "No remarks"}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
