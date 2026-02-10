import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Select,
  useToast,
  SimpleGrid,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import api from 'api/axios';

export default function UserManagement() {
  const toast = useToast();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');

  const handleCreateUser = async () => {
    try {
      await api.post('/hr/users', {
        email,
        password,
        full_name: fullName,
        role_name: role
      });
      toast({
        title: "User created successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Reset form
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (error) {
      toast({
        title: "Error creating user.",
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
          User Onboarding
        </Text>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} spacing="20px">
        <Card p="20px" direction="column">
            <FormControl mb="15px">
              <FormLabel>Full Name</FormLabel>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Password</FormLabel>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Role</FormLabel>
              <Select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="warden">Warden</option>
                <option value="admin">Admin</option>
              </Select>
            </FormControl>
            <Button colorScheme="brand" mt="10px" onClick={handleCreateUser}>
                Create User
            </Button>
        </Card>
      </SimpleGrid>
    </Box>
  );
}
