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
  Textarea,
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

export default function FeeStructure() {
  const [structures, setStructures] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form State
  const [name, setName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [description, setDescription] = useState('');

  const fetchStructures = async () => {
    try {
      const response = await api.get('/fees/structures');
      setStructures(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStructures();
  }, []);

  const handleAddStructure = async () => {
    try {
      await api.post('/fees/structures', {
        name,
        academic_year: academicYear,
        total_amount: parseFloat(totalAmount),
        description
      });
      toast({
        title: "Fee Structure added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchStructures();
    } catch (error) {
      toast({
        title: "Error adding structure.",
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
          Fee Structures
        </Text>
        <Button colorScheme="brand" onClick={onOpen}>
          Add Structure
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {structures.map((structure) => (
          <Card key={structure.id} p="20px" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                {structure.name}
              </Text>
              <Text fontSize="lg" fontWeight="bold" color="green.500">
                ${structure.total_amount}
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.500" mb="5px">
               Year: {structure.academic_year}
            </Text>
            <Text>
                {structure.description}
            </Text>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Fee Structure</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px">
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. B.Tech 1st Year" />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Academic Year</FormLabel>
              <Input value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="2023-2024" />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Total Amount</FormLabel>
              <Input type="number" value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Description</FormLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddStructure}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
