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

export default function ExamManager() {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form State
  const [name, setName] = useState('');
  const [subjectId, setSubjectId] = useState(''); // Just using course ID for mock simplicity as "Subject"
  const [date, setDate] = useState('');
  const [totalMarks, setTotalMarks] = useState(100);

  const fetchExams = async () => {
    try {
      const response = await api.get('/academics/exams');
      setExams(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCourses = async () => {
      try {
          const response = await api.get('/academics/courses');
          setCourses(response.data);
      } catch (error) {
          console.error(error);
      }
  }

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, []);

  const handleScheduleExam = async () => {
    try {
      await api.post('/academics/exams', {
        name,
        subject_id: parseInt(subjectId), // Mocking course as subject
        date: new Date(date).toISOString(),
        total_marks: parseInt(totalMarks)
      });
      toast({
        title: "Exam scheduled.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchExams();
    } catch (error) {
      toast({
        title: "Error scheduling exam.",
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
          Exam Schedule
        </Text>
        <Button colorScheme="brand" onClick={onOpen}>
          Schedule Exam
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {exams.map((exam) => (
          <Card key={exam.id} p="20px" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                {exam.name}
              </Text>
              <Text fontSize="md" color="blue.500">
                {new Date(exam.date).toLocaleDateString()}
              </Text>
            </Flex>
            <Text mb="5px">Total Marks: {exam.total_marks}</Text>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Schedule Exam</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px">
              <FormLabel>Exam Name</FormLabel>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Mid Term" />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Subject/Course</FormLabel>
              <Select placeholder="Select Course" onChange={(e) => setSubjectId(e.target.value)}>
                  {courses.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
              </Select>
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Date</FormLabel>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Total Marks</FormLabel>
              <Input type="number" value={totalMarks} onChange={(e) => setTotalMarks(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleScheduleExam}>
              Schedule
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
