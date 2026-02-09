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

export default function CourseManager() {
  const [courses, setCourses] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form State
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [department, setDepartment] = useState('');

  const fetchCourses = async () => {
    try {
      const response = await api.get('/academics/courses');
      setCourses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async () => {
    try {
      await api.post('/academics/courses', {
        name,
        code,
        department
      });
      toast({
        title: "Course added.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchCourses();
    } catch (error) {
      toast({
        title: "Error adding course.",
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
          Courses
        </Text>
        <Button colorScheme="brand" onClick={onOpen}>
          Add Course
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {courses.map((course) => (
          <Card key={course.id} p="20px" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                {course.name}
              </Text>
              <Text fontSize="md" color="blue.500">
                {course.code}
              </Text>
            </Flex>
            <Text>Dept: {course.department}</Text>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px">
              <FormLabel>Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Code</FormLabel>
              <Input value={code} onChange={(e) => setCode(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Department</FormLabel>
              <Input value={department} onChange={(e) => setDepartment(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddCourse}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
