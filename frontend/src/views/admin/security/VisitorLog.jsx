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

export default function VisitorLog() {
  const [visitors, setVisitors] = useState([]);
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form State
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [purpose, setPurpose] = useState('');
  const [studentId, setStudentId] = useState('');

  const fetchVisitors = async () => {
    try {
      const response = await api.get('/security/visitors');
      setVisitors(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchVisitors();
    fetchUsers();
  }, []);

  const handleEntry = async () => {
    try {
      await api.post('/security/visitors/entry', {
        name,
        contact,
        purpose,
        student_id: parseInt(studentId)
      });
      toast({
        title: "Visitor entry recorded.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchVisitors();
    } catch (error) {
      toast({
        title: "Error recording entry.",
        description: error.response?.data?.detail,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleExit = async (id) => {
    try {
        await api.put(`/security/visitors/exit/${id}`);
        toast({
            title: "Visitor exit recorded.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        fetchVisitors();
    } catch (error) {
        console.error(error);
    }
  }

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex justifyContent="space-between" mb="20px">
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Visitor Log
        </Text>
        <Button colorScheme="brand" onClick={onOpen}>
          New Visitor
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {visitors.map((visitor) => (
          <Card key={visitor.id} p="20px" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                {visitor.name}
              </Text>
              <Text fontSize="sm" color={visitor.exit_time ? "green.500" : "red.500"}>
                {visitor.exit_time ? "Checked Out" : "Checked In"}
              </Text>
            </Flex>
            <Text mb="5px">Contact: {visitor.contact}</Text>
            <Text mb="5px">Purpose: {visitor.purpose}</Text>
            <Text fontSize="xs" color="gray.400">
                In: {new Date(visitor.entry_time).toLocaleString()}
            </Text>
            {visitor.exit_time && (
                <Text fontSize="xs" color="gray.400">
                    Out: {new Date(visitor.exit_time).toLocaleString()}
                </Text>
            )}
            {!visitor.exit_time && (
                <Button size="sm" colorScheme="red" mt="10px" onClick={() => handleExit(visitor.id)}>
                    Mark Exit
                </Button>
            )}
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Record Visitor Entry</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px">
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Contact</FormLabel>
              <Input value={contact} onChange={(e) => setContact(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Purpose</FormLabel>
              <Input value={purpose} onChange={(e) => setPurpose(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Visiting Student</FormLabel>
              <Select placeholder="Select student" onChange={(e) => setStudentId(e.target.value)}>
                {users.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name}</option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleEntry}>
              Record Entry
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
