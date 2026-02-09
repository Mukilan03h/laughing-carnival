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
import { useAuth } from 'contexts/AuthContext';

export default function GatePassManager() {
  const [gatepasses, setGatepasses] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();

  // Form State
  const [reason, setReason] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');

  const fetchGatePasses = async () => {
    try {
      const endpoint = user.is_superuser ? '/security/gatepass/pending' : '/security/gatepass/my';
      const response = await api.get(endpoint);
      setGatepasses(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchGatePasses();
  }, [user]);

  const handleRequest = async () => {
    try {
      await api.post('/security/gatepass/request', {
        reason,
        departure_time: new Date(departureTime).toISOString(),
        expected_return: new Date(expectedReturn).toISOString()
      });
      toast({
        title: "Request submitted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchGatePasses();
    } catch (error) {
      toast({
        title: "Error submitting request.",
        description: error.response?.data?.detail,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleApprove = async (id, status) => {
      try {
        await api.put(`/security/gatepass/approve/${id}?status=${status}`);
        toast({
            title: `Request ${status}.`,
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        fetchGatePasses();
      } catch (error) {
        console.error(error);
      }
  }

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex justifyContent="space-between" mb="20px">
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Gate Passes
        </Text>
        <Button colorScheme="brand" onClick={onOpen}>
          Request Pass
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {gatepasses.map((pass) => (
          <Card key={pass.id} p="20px" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                Pass #{pass.id}
              </Text>
              <Text fontSize="sm" color={pass.status === "Approved" ? "green.500" : pass.status === "Rejected" ? "red.500" : "orange.500"}>
                {pass.status}
              </Text>
            </Flex>
            <Text mb="5px">Reason: {pass.reason}</Text>
            <Text fontSize="xs" color="gray.400">
                Out: {new Date(pass.departure_time).toLocaleString()}
            </Text>
            <Text fontSize="xs" color="gray.400" mb="10px">
                In: {new Date(pass.expected_return).toLocaleString()}
            </Text>

            <Flex gap="10px">
                {user.is_superuser && pass.status === "Pending" && (
                    <>
                        <Button size="sm" colorScheme="green" onClick={() => handleApprove(pass.id, "Approved")}>Approve</Button>
                        <Button size="sm" colorScheme="red" onClick={() => handleApprove(pass.id, "Rejected")}>Reject</Button>
                    </>
                )}
                <Button size="sm" colorScheme="blue" onClick={async () => {
                     try {
                        const response = await api.get(`/security/gatepass/${pass.id}/pdf`, {
                            responseType: 'blob',
                        });
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `gatepass_${pass.id}.pdf`);
                        document.body.appendChild(link);
                        link.click();
                      } catch (error) {
                          console.error("Error downloading PDF", error);
                      }
                }}>
                    PDF
                </Button>
            </Flex>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Request Gate Pass</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px">
              <FormLabel>Reason</FormLabel>
              <Textarea value={reason} onChange={(e) => setReason(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Departure Time</FormLabel>
              <Input type="datetime-local" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Expected Return</FormLabel>
              <Input type="datetime-local" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleRequest}>
              Request
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
