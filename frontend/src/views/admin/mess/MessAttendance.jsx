import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import api from 'api/axios';

export default function MessAttendance() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const toast = useToast();

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/users/');
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      await api.post('/mess/attendance', {
        student_id: parseInt(selectedStudent),
        meal_type: mealType
      });
      toast({
        title: "Attendance marked.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error marking attendance.",
        description: error.response?.data?.detail,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card p="20px" direction="column">
        <Text fontSize="xl" fontWeight="bold" mb="20px" color={textColor}>
          Mess Attendance
        </Text>

        <FormControl mb="20px">
            <FormLabel>Select Student</FormLabel>
            <Select placeholder="Select student" onChange={(e) => setSelectedStudent(e.target.value)}>
                {students.map(user => (
                    <option key={user.id} value={user.id}>{user.full_name} ({user.email})</option>
                ))}
            </Select>
        </FormControl>

        <FormControl mb="20px">
            <FormLabel>Meal Type</FormLabel>
            <Select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snack">Snack</option>
                <option value="Dinner">Dinner</option>
            </Select>
        </FormControl>

        <Button colorScheme="brand" onClick={handleMarkAttendance} disabled={!selectedStudent}>
            Mark Present
        </Button>
      </Card>
    </Box>
  );
}
