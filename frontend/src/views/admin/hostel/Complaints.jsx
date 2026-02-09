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
import { useAuth } from 'contexts/AuthContext';

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Maintenance');
  const [priority, setPriority] = useState('Medium');
  const [files, setFiles] = useState(null);

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/hostels/complaints');
      setComplaints(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleAddComplaint = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('priority', priority);
    if (files) {
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
    }

    try {
      await api.post('/hostels/complaints', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });
      toast({
        title: "Complaint submitted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchComplaints();
    } catch (error) {
      toast({
        title: "Error submitting complaint.",
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
          Complaints
        </Text>
        <Button colorScheme="brand" onClick={onOpen}>
          New Complaint
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {complaints.map((complaint) => (
          <Card key={complaint.id} p="20px" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                {complaint.title}
              </Text>
              <Text fontSize="sm" color={complaint.status === "Open" ? "red.500" : "green.500"}>
                {complaint.status}
              </Text>
            </Flex>
            <Text fontSize="sm" color="gray.500" mb="10px">
                Category: {complaint.category} | Priority: {complaint.priority}
            </Text>
            <Text mb="10px">
                {complaint.description}
            </Text>
            {complaint.attachments && complaint.attachments.length > 0 && (
                <Text fontSize="xs" color="blue.500">
                    {complaint.attachments.length} attachment(s)
                </Text>
            )}
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Submit Complaint</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px">
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Description</FormLabel>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Category</FormLabel>
              <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Maintenance">Maintenance</option>
                <option value="Food">Food</option>
                <option value="Wifi">Wifi</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Priority</FormLabel>
              <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Attachments</FormLabel>
              <Input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddComplaint}>
              Submit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
