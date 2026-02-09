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
import { useAuth } from 'contexts/AuthContext';

export default function AttendanceSheet() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [status, setStatus] = useState('Present');
  const toast = useToast();
  const { user } = useAuth();

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  useEffect(() => {
    if (user.is_superuser) {
        fetchStudents();
    }
    fetchAttendance();
  }, [user]);

  const fetchStudents = async () => {
    try {
      const response = await api.get('/users/');
      setStudents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttendance = async () => {
    try {
        const response = await api.get('/academics/attendance/my');
        setAttendance(response.data);
    } catch (error) {
        console.error(error);
    }
  }

  const handleMarkAttendance = async () => {
    try {
      await api.post('/academics/attendance', {
        student_id: parseInt(selectedStudent),
        subject_id: 1, // Mock subject
        date: new Date().toISOString(),
        status
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
      {user.is_superuser && (
        <Card p="20px" direction="column" mb="20px">
            <Text fontSize="xl" fontWeight="bold" mb="20px" color={textColor}>
            Mark Attendance
            </Text>

            <FormControl mb="20px">
                <FormLabel>Select Student</FormLabel>
                <Select placeholder="Select student" onChange={(e) => setSelectedStudent(e.target.value)}>
                    {students.map(u => (
                        <option key={u.id} value={u.id}>{u.full_name}</option>
                    ))}
                </Select>
            </FormControl>

            <FormControl mb="20px">
                <FormLabel>Status</FormLabel>
                <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                </Select>
            </FormControl>

            <Button colorScheme="brand" onClick={handleMarkAttendance} disabled={!selectedStudent}>
                Mark
            </Button>
        </Card>
      )}

      <Text fontSize="xl" fontWeight="bold" mb="20px" color={textColor}>
          My Attendance History
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {attendance.map((record) => (
            <Card key={record.id} p="20px">
                <Flex justifyContent="space-between">
                    <Text>{new Date(record.date).toLocaleDateString()}</Text>
                    <Text color={record.status === "Present" ? "green.500" : "red.500"}>{record.status}</Text>
                </Flex>
            </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
