import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  SimpleGrid,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import api from 'api/axios';

export default function MyFees() {
  const [invoices, setInvoices] = useState([]);
  const textColor = useColorModeValue('secondaryGray.900', 'white');

  useEffect(() => {
    const fetchInvoices = async () => {
        try {
            const response = await api.get('/fees/invoices/my');
            setInvoices(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    fetchInvoices();
  }, []);

  const downloadPdf = async (id, invoiceNumber) => {
      try {
        const response = await api.get(`/fees/invoices/${id}/pdf`, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${invoiceNumber}.pdf`);
        document.body.appendChild(link);
        link.click();
      } catch (error) {
          console.error("Error downloading PDF", error);
      }
  }

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <Flex justifyContent="space-between" mb="20px">
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          My Fees
        </Text>
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

            <Button size="sm" colorScheme="blue" onClick={() => downloadPdf(invoice.id, invoice.invoice_number)}>
                Download PDF
            </Button>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
