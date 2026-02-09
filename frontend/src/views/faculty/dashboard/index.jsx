import React from "react";
import {
  Box,
  SimpleGrid,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import MiniStatistics from "components/card/MiniStatistics";
import IconBox from "components/icons/IconBox";
import {
  MdClass,
  MdFactCheck,
} from "react-icons/md";

export default function FacultyDashboard() {
  const brandColor = useColorModeValue("brand.500", "white");
  const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

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
                <Icon w='32px' h='32px' as={MdClass} color={brandColor} />
              }
            />
          }
          name='My Classes'
          value='3'
        />
        <MiniStatistics
          startContent={
            <IconBox
              w='56px'
              h='56px'
              bg={boxBg}
              icon={
                <Icon w='32px' h='32px' as={MdFactCheck} color={brandColor} />
              }
            />
          }
          name='Pending Attendance'
          value='1'
        />
      </SimpleGrid>
    </Box>
  );
}
