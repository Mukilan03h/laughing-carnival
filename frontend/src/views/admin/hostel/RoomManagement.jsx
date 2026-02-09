import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  useColorModeValue,
  SimpleGrid,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import api from 'api/axios';

export default function RoomManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form State
  const [roomNumber, setRoomNumber] = useState('');
  const [capacity, setCapacity] = useState(2);
  const [floor, setFloor] = useState(1);
  const [type, setType] = useState('Non-AC');
  const [rent, setRent] = useState(0);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/hostels/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleAddRoom = async () => {
    try {
      await api.post('/hostels/rooms', {
        room_number: roomNumber,
        capacity: parseInt(capacity),
        floor: parseInt(floor),
        type,
        rent: parseFloat(rent),
        hostel_id: 1 // Mock hostel ID
      });
      toast({
        title: "Room added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchRooms();
    } catch (error) {
      toast({
        title: "Error adding room.",
        description: error.response?.data?.detail,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardColor = useColorModeValue('white', 'navy.700');

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex justifyContent="space-between" mb="20px">
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Hostel Room Management
        </Text>
        <Button colorScheme="brand" onClick={onOpen}>
          Add Room
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {rooms.map((room) => (
          <Card key={room.id} p="20px" align="center" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                Room {room.room_number}
              </Text>
              <Text fontSize="sm" color="gray.500">
                Floor {room.floor}
              </Text>
            </Flex>
            <Flex justifyContent="space-between" w="100%" mb="5px">
               <Text>Type: {room.type}</Text>
               <Text>Rent: ${room.rent}</Text>
            </Flex>
            <Flex justifyContent="space-between" w="100%">
                <Text>Capacity: {room.capacity}</Text>
                {/* <Text color={room.beds.filter(b => b.is_occupied).length < room.capacity ? "green.500" : "red.500"}>
                    {room.beds.filter(b => b.is_occupied).length < room.capacity ? "Available" : "Full"}
                </Text> */}
                {/* We need to fetch beds to show availability properly, or include in list API */}
            </Flex>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Room</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px">
              <FormLabel>Room Number</FormLabel>
              <Input value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Capacity</FormLabel>
              <Input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Floor</FormLabel>
              <Input type="number" value={floor} onChange={(e) => setFloor(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Type</FormLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="Non-AC">Non-AC</option>
                <option value="AC">AC</option>
              </Select>
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Rent</FormLabel>
              <Input type="number" value={rent} onChange={(e) => setRent(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddRoom}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
