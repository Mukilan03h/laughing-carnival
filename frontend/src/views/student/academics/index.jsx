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

export default function MyAcademics() {
  const [attendance, setAttendance] = useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  useEffect(() => {
    const fetchAttendance = async () => {
        try {
            const response = await api.get('/academics/attendance/my');
            setAttendance(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    fetchAttendance();
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex justifyContent="space-between" mb="20px">
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          My Attendance
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {attendance.map((record) => (
          <Card key={record.id} p="20px" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                {new Date(record.date).toLocaleDateString()}
              </Text>
              <Text fontSize="md" color={record.status === "Present" ? "green.500" : "red.500"}>
                {record.status}
              </Text>
            </Flex>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
