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

export default function MessMenu() {
  const [menus, setMenus] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form State
  const [date, setDate] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [items, setItems] = useState('');
  const [price, setPrice] = useState('');

  const fetchMenus = async () => {
    try {
      const response = await api.get('/mess/menu');
      setMenus(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleAddMenu = async () => {
    try {
      await api.post('/mess/menu', {
        date: new Date(date).toISOString(),
        meal_type: mealType,
        items,
        price: parseFloat(price)
      });
      toast({
        title: "Menu added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchMenus();
    } catch (error) {
      toast({
        title: "Error adding menu.",
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
          Mess Menu
        </Text>
        <Button colorScheme="brand" onClick={onOpen}>
          Add Menu
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {menus.map((menu) => (
          <Card key={menu.id} p="20px" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                {new Date(menu.date).toLocaleDateString()}
              </Text>
              <Text fontSize="md" color="brand.500">
                {menu.meal_type}
              </Text>
            </Flex>
            <Text mb="10px">
                {menu.items}
            </Text>
            <Text fontSize="sm" color="gray.500">
                Price: ${menu.price}
            </Text>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Menu Item</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px">
              <FormLabel>Date</FormLabel>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Meal Type</FormLabel>
              <Select value={mealType} onChange={(e) => setMealType(e.target.value)}>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snack">Snack</option>
                <option value="Dinner">Dinner</option>
              </Select>
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Items</FormLabel>
              <Input value={items} onChange={(e) => setItems(e.target.value)} placeholder="e.g. Eggs, Toast, Coffee" />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Price</FormLabel>
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddMenu}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
