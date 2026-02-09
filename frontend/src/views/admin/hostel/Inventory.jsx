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

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [rooms, setRooms] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Furniture');
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState('Good');
  const [roomId, setRoomId] = useState('');

  const fetchInventory = async () => {
    try {
      const response = await api.get('/hostels/inventory');
      setItems(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchRooms = async () => {
    try {
      const response = await api.get('/hostels/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchRooms();
  }, []);

  const handleAddItem = async () => {
    try {
      await api.post('/hostels/inventory', {
        name,
        category,
        quantity: parseInt(quantity),
        condition,
        room_id: roomId ? parseInt(roomId) : null
      });
      toast({
        title: "Item added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchInventory();
    } catch (error) {
      toast({
        title: "Error adding item.",
        description: error.response?.data?.detail,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex justifyContent="space-between" mb="20px">
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Hostel Inventory
        </Text>
        <Button colorScheme="brand" onClick={onOpen}>
          Add Item
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {items.map((item) => (
          <Card key={item.id} p="20px" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                {item.name}
              </Text>
              <Text fontSize="md" color="brand.500">
                Qty: {item.quantity}
              </Text>
            </Flex>
            <Text mb="5px">Category: {item.category}</Text>
            <Text mb="5px">Condition: {item.condition}</Text>
            {item.room_id && (
                <Text fontSize="xs" color="gray.400">
                    Assigned to Room ID: {item.room_id}
                </Text>
            )}
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Inventory Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px">
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Category</FormLabel>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Furniture">Furniture</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Quantity</FormLabel>
              <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Condition</FormLabel>
              <Select value={condition} onChange={(e) => setCondition(e.target.value)}>
                <option value="Good">Good</option>
                <option value="Damaged">Damaged</option>
                <option value="Repair Needed">Repair Needed</option>
              </Select>
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Assign to Room (Optional)</FormLabel>
              <Select placeholder="General Stock" onChange={(e) => setRoomId(e.target.value)}>
                {rooms.map(room => (
                    <option key={room.id} value={room.id}>Room {room.room_number}</option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddItem}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
