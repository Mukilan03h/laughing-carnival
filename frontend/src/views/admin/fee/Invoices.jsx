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
import { useAuth } from 'contexts/AuthContext';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [structures, setStructures] = useState([]);
  const [users, setUsers] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isPayOpen, onOpen: onPayOpen, onClose: onPayClose } = useDisclosure();
  const toast = useToast();
  const { user } = useAuth();

  // Create Invoice State
  const [studentId, setStudentId] = useState('');
  const [structureId, setStructureId] = useState('');
  const [amountDue, setAmountDue] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Payment State
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');

  const fetchInvoices = async () => {
    try {
      const endpoint = user.is_superuser ? '/fees/invoices/all' : '/fees/invoices/my';
      const response = await api.get(endpoint);
      setInvoices(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStructures = async () => {
    try {
      const response = await api.get('/fees/structures');
      setStructures(response.data);
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
    fetchInvoices();
    if (user.is_superuser) {
        fetchStructures();
        fetchUsers();
    }
  }, [user]);

  const handleCreateInvoice = async () => {
    try {
      await api.post('/fees/invoices/generate', {
        student_id: parseInt(studentId),
        fee_structure_id: parseInt(structureId),
        amount_due: parseFloat(amountDue),
        due_date: new Date(dueDate).toISOString()
      });
      toast({
        title: "Invoice generated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchInvoices();
    } catch (error) {
      toast({
        title: "Error generating invoice.",
        description: error.response?.data?.detail,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handlePayment = async () => {
      try {
        await api.post('/fees/pay', {
            invoice_id: selectedInvoice.id,
            amount: parseFloat(paymentAmount),
            payment_method: paymentMethod
        });
        toast({
            title: "Payment recorded.",
            status: "success",
            duration: 3000,
            isClosable: true,
        });
        onPayClose();
        fetchInvoices();
      } catch (error) {
        toast({
            title: "Error recording payment.",
            description: error.response?.data?.detail,
            status: "error",
            duration: 3000,
            isClosable: true,
        });
      }
  }

  const openPaymentModal = (invoice) => {
      setSelectedInvoice(invoice);
      setPaymentAmount(invoice.amount_due - invoice.amount_paid);
      onPayOpen();
  }

  const textColor = useColorModeValue('secondaryGray.900', 'white');

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex justifyContent="space-between" mb="20px">
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Invoices
        </Text>
        {user.is_superuser && (
            <Button colorScheme="brand" onClick={onOpen}>
            Generate Invoice
            </Button>
        )}
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} spacing="20px">
        {invoices.map((invoice) => (
          <Card key={invoice.id} p="20px" direction="column" w="100%">
            <Flex justifyContent="space-between" w="100%" mb="10px">
              <Text fontSize="xl" fontWeight="bold">
                #{invoice.invoice_number}
              </Text>
              <Text fontSize="sm" color={invoice.status === "Paid" ? "green.500" : "red.500"}>
                {invoice.status}
              </Text>
            </Flex>
            <Text fontSize="lg" fontWeight="bold" mb="5px">
               Due: ${invoice.amount_due}
            </Text>
            <Text fontSize="sm" color="gray.500" mb="10px">
               Paid: ${invoice.amount_paid}
            </Text>
            <Text fontSize="xs" color="gray.400" mb="15px">
                Due Date: {new Date(invoice.due_date).toLocaleDateString()}
            </Text>
            <Flex gap="10px">
                {user.is_superuser && invoice.status !== "Paid" && (
                    <Button size="sm" colorScheme="green" onClick={() => openPaymentModal(invoice)}>
                        Record Payment
                    </Button>
                )}
                <Button size="sm" colorScheme="blue" onClick={async () => {
                     try {
                        const response = await api.get(`/fees/invoices/${invoice.id}/pdf`, {
                            responseType: 'blob',
                        });
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', `invoice_${invoice.invoice_number}.pdf`);
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

      {/* Generate Invoice Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Generate Invoice</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb="15px">
              <FormLabel>Student</FormLabel>
              <Select placeholder="Select student" onChange={(e) => setStudentId(e.target.value)}>
                {users.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Fee Structure</FormLabel>
              <Select placeholder="Select structure" onChange={(e) => {
                  setStructureId(e.target.value);
                  const struct = structures.find(s => s.id === parseInt(e.target.value));
                  if (struct) setAmountDue(struct.total_amount);
              }}>
                {structures.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (${s.total_amount})</option>
                ))}
              </Select>
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Amount Due</FormLabel>
              <Input type="number" value={amountDue} onChange={(e) => setAmountDue(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Due Date</FormLabel>
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCreateInvoice}>
              Generate
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Payment Modal */}
      <Modal isOpen={isPayOpen} onClose={onPayClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Record Payment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb="10px">Invoice: {selectedInvoice?.invoice_number}</Text>
            <FormControl mb="15px">
              <FormLabel>Amount</FormLabel>
              <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} />
            </FormControl>
            <FormControl mb="15px">
              <FormLabel>Method</FormLabel>
              <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                  <option value="Cash">Cash</option>
                  <option value="Online">Online</option>
                  <option value="Cheque">Cheque</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handlePayment}>
              Pay
            </Button>
            <Button onClick={onPayClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
