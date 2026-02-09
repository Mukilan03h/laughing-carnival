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

export default function Staff() {
  const [staff, setStaff] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form State
  const [name, setName] = useState('');
  const [role, setRole] = useState('Cleaner');
  const [contact, setContact] = useState('');
  const [shift, setShift] = useState('Morning');
  const [assignedArea, setAssignedArea] = useState('');

  const fetchStaff = async () => {
    try {
      const response = await api.get('/hostels/staff');
      setStaff(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async () => {
    try {
      await api.post('/hostels/staff', {
        name,
        role,
        contact,
        shift,
        assigned_area: assignedArea
      });
      toast({
        title: "Staff added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchStaff();
    } catch (error) {
      toast({
        title: "Error adding staff.",
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
          Hostel Staff
        </Text>
        <Button colorScheme="brand" onClick={onOpen}>
          Add Staff
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {staff.map((member) => (
          <Card key={member.id} p="20px" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                {member.name}
              </Text>
              <Text fontSize="md" color="blue.500">
                {member.role}
              </Text>
            </Flex>
            <Text mb="5px">Contact: {member.contact}</Text>
            <Text mb="5px">Shift: {member.shift}</Text>
            <Text fontSize="xs" color="gray.400">
                Area: {member.assigned_area}
            </Text>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Register Staff</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px">
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Role</FormLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="Cleaner">Cleaner</option>
                <option value="Guard">Guard</option>
                <option value="Cook">Cook</option>
                <option value="Warden">Warden</option>
              </Select>
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Contact</FormLabel>
              <Input value={contact} onChange={(e) => setContact(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Shift</FormLabel>
              <Select value={shift} onChange={(e) => setShift(e.target.value)}>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Night">Night</option>
              </Select>
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Assigned Area</FormLabel>
              <Input value={assignedArea} onChange={(e) => setAssignedArea(e.target.value)} placeholder="e.g. Block A Ground Floor" />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddStaff}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
