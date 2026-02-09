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

export default function IssueReturn() {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [dueDate, setDueDate] = useState('');
  const toast = useToast();
  const { user } = useAuth();

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  useEffect(() => {
    fetchBooks();
    fetchUsers();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/library/books');
      setBooks(response.data);
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
  }

  const handleIssue = async () => {
    try {
      await api.post('/library/issue', {
        book_id: parseInt(selectedBook),
        student_id: parseInt(selectedStudent),
        due_date: new Date(dueDate).toISOString()
      });
      toast({
        title: "Book issued.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchBooks();
    } catch (error) {
      toast({
        title: "Error issuing book.",
        description: error.response?.data?.detail,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Card p="20px" direction="column">
        <Text fontSize="xl" fontWeight="bold" mb="20px" color={textColor}>
          Issue Book
        </Text>

        <FormControl mb="20px">
            <FormLabel>Select Book</FormLabel>
            <Select placeholder="Select book" onChange={(e) => setSelectedBook(e.target.value)}>
                {books.filter(b => b.available_copies > 0).map(b => (
                    <option key={b.id} value={b.id}>{b.title} (Copies: {b.available_copies})</option>
                ))}
            </Select>
        </FormControl>

        <FormControl mb="20px">
            <FormLabel>Select Student</FormLabel>
            <Select placeholder="Select student" onChange={(e) => setSelectedStudent(e.target.value)}>
                {users.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                ))}
            </Select>
        </FormControl>

        <FormControl mb="20px">
            <FormLabel>Due Date</FormLabel>
            <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </FormControl>

        <Button colorScheme="brand" onClick={handleIssue} disabled={!selectedBook || !selectedStudent}>
            Issue Book
        </Button>
      </Card>
    </Box>
  );
}
