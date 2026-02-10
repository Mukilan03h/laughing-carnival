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

export default function LeaveApplication() {
  const [leaves, setLeaves] = useState([]); // Mock pending/approved history if endpoint existed
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Form State
  const [leaveType, setLeaveType] = useState('Casual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const handleApply = async () => {
    try {
      await api.post('/hr/leave', {
        leave_type: leaveType,
        start_date: new Date(startDate).toISOString(),
        end_date: new Date(endDate).toISOString(),
        reason
      });
      toast({
        title: "Leave application submitted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error submitting application.",
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
          Leave Management
        </Text>
        <Button colorScheme="brand" onClick={onOpen}>
          Apply for Leave
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 1 }} spacing="20px">
        <Card p="20px">
            <Text>Your Leave History (Coming Soon)</Text>
        </Card>
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Apply for Leave</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px">
              <FormLabel>Leave Type</FormLabel>
              <Select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
                <option value="Casual">Casual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Earned">Earned Leave</option>
              </Select>
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Start Date</FormLabel>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>End Date</FormLabel>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Reason</FormLabel>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleApply}>
              Submit
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
