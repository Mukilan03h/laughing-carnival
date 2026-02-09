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

export default function BookCatalog() {
  const [books, setBooks] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');
  const [copies, setCopies] = useState(1);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/library/books');
      setBooks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async () => {
    try {
      await api.post('/library/books', {
        title,
        author,
        isbn,
        total_copies: parseInt(copies)
      });
      toast({
        title: "Book added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchBooks();
    } catch (error) {
      toast({
        title: "Error adding book.",
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
          Book Catalog
        </Text>
        <Button colorScheme="brand" onClick={onOpen}>
          Add Book
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {books.map((book) => (
          <Card key={book.id} p="20px" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                {book.title}
              </Text>
              <Text fontSize="sm" color={book.available_copies > 0 ? "green.500" : "red.500"}>
                {book.available_copies} Available
              </Text>
            </Flex>
            <Text>Author: {book.author}</Text>
            <Text fontSize="sm" color="gray.500">ISBN: {book.isbn}</Text>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Book</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px">
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Author</FormLabel>
              <Input value={author} onChange={(e) => setAuthor(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>ISBN</FormLabel>
              <Input value={isbn} onChange={(e) => setIsbn(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Copies</FormLabel>
              <Input type="number" value={copies} onChange={(e) => setCopies(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddBook}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
