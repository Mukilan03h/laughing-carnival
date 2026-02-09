import React, { useState, useEffect } from "react";
import {
  Box,
  SimpleGrid,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import {
  MdAttachMoney,
  MdBarChart,
  MdFileCopy,
} from "react-icons/md";
import api from 'api/axios';

export default function StudentDashboard() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
        try {
            const response = await api.get('/users/dashboard');
            setStats(response.data);
        } catch (error) {
            console.error(error);
        }
    }
    fetchStats();
  }, []);

  return (
    <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 3 }}
        gap='20px'
        mb='20px'>
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name='Fees Due'
          value={`$${stats?.fee_due || 0}`}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor} />
              }
            />
          }
          name='Hostel Allocated'
          value={stats?.hostel_allocated ? "Yes" : "No"}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor} />
              }
            />
          }
          name='Books Issued'
          value={stats?.books_issued || 0}
        />
      </SimpleGrid>
    </Box>
  );
}
