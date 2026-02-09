import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Select,
  useToast,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import api from 'api/axios';

export default function Allocation() {
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedBed, setSelectedBed] = useState('');
  const toast = useToast();

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  useEffect(() => {
    fetchRooms();
    fetchUsers();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/hostels/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
        // Assuming admin can list all users
      const response = await api.get('/users/');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAllocation = async () => {
    try {
      await api.post('/hostels/allocate', {
        student_id: parseInt(selectedStudent),
        bed_id: parseInt(selectedBed)
      });
      toast({
        title: "Allocation successful.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchRooms(); // Refresh to update bed status
    } catch (error) {
      toast({
        title: "Allocation failed.",
        description: error.response?.data?.detail,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Flatten beds for selection
  const availableBeds = rooms.flatMap(room =>
    room.beds.filter(bed => !bed.is_occupied).map(bed => ({
        ...bed,
        room_number: room.room_number
    }))
  );

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card p="20px" direction="column">
        <Text fontSize="xl" fontWeight="bold" mb="20px" color={textColor}>
          Allocate Bed
        </Text>

        <FormControl mb="20px">
            <FormLabel>Select Student</FormLabel>
            <Select placeholder="Select student" onChange={(e) => setSelectedStudent(e.target.value)}>
                {users.map(user => (
                    <option key={user.id} value={user.id}>{user.full_name} ({user.email})</option>
                ))}
            </Select>
        </FormControl>

        <FormControl mb="20px">
            <FormLabel>Select Bed</FormLabel>
            <Select placeholder="Select bed" onChange={(e) => setSelectedBed(e.target.value)}>
                {availableBeds.map(bed => (
                    <option key={bed.id} value={bed.id}>
                        Room {bed.room_number} - Bed {bed.bed_number}
                    </option>
                ))}
            </Select>
        </FormControl>

        <Button colorScheme="brand" onClick={handleAllocation} disabled={!selectedStudent || !selectedBed}>
            Allocate
        </Button>
      </Card>
    </Box>
  );
}
