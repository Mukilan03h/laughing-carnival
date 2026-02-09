import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import NFTMarketplace from 'views/admin/marketplace';
import Profile from 'views/admin/profile';
import DataTables from 'views/admin/dataTables';
import RTL from 'views/admin/rtl';

// Hostel Imports
import RoomManagement from 'views/admin/hostel/RoomManagement';
import Allocation from 'views/admin/hostel/Allocation';
import Complaints from 'views/admin/hostel/Complaints';
import Inventory from 'views/admin/hostel/Inventory';
import Staff from 'views/admin/hostel/Staff';

// Communication Imports
import NoticeManager from 'views/admin/communication/NoticeManager';

// Fee Imports
import FeeStructure from 'views/admin/fee/FeeStructure';
import Invoices from 'views/admin/fee/Invoices';

// Mess Imports
import MessMenu from 'views/admin/mess/MessMenu';
import MessAttendance from 'views/admin/mess/MessAttendance';

// Security Imports
import VisitorLog from 'views/admin/security/VisitorLog';
import GatePassManager from 'views/admin/security/GatePassManager';

// Academics Imports
import CourseManager from 'views/admin/academics/CourseManager';
import AttendanceSheet from 'views/admin/academics/AttendanceSheet';

// Library Imports
import BookCatalog from 'views/admin/library/BookCatalog';
import IssueReturn from 'views/admin/library/IssueReturn';

// Student Imports
import StudentDashboard from 'views/student/dashboard';
import MyFees from 'views/student/fees';
import MyAcademics from 'views/student/academics';

// Faculty Imports
import FacultyDashboard from 'views/faculty/dashboard';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import { MdBed, MdAssignment, MdReport, MdAttachMoney, MdReceipt, MdRestaurant, MdFactCheck, MdSecurity, MdDoorFront, MdBook, MdLibraryBooks, MdClass, MdDashboard, MdSchool, MdInventory, MdPeople, MdAnnouncement } from 'react-icons/md';

const adminRoutes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: <MainDashboard />,
  },
  {
    name: 'Hostel Rooms',
    layout: '/admin',
    path: '/hostel/rooms',
    icon: <Icon as={MdBed} width="20px" height="20px" color="inherit" />,
    component: <RoomManagement />,
  },
  {
    name: 'Allocation',
    layout: '/admin',
    path: '/hostel/allocation',
    icon: <Icon as={MdAssignment} width="20px" height="20px" color="inherit" />,
    component: <Allocation />,
  },
  {
    name: 'Complaints',
    layout: '/admin',
    path: '/hostel/complaints',
    icon: <Icon as={MdReport} width="20px" height="20px" color="inherit" />,
    component: <Complaints />,
  },
  {
    name: 'Inventory',
    layout: '/admin',
    path: '/hostel/inventory',
    icon: <Icon as={MdInventory} width="20px" height="20px" color="inherit" />,
    component: <Inventory />,
  },
  {
    name: 'Staff',
    layout: '/admin',
    path: '/hostel/staff',
    icon: <Icon as={MdPeople} width="20px" height="20px" color="inherit" />,
    component: <Staff />,
  },
  {
    name: 'Notices',
    layout: '/admin',
    path: '/communication/notices',
    icon: <Icon as={MdAnnouncement} width="20px" height="20px" color="inherit" />,
    component: <NoticeManager />,
  },
  {
    name: 'Fee Structures',
    layout: '/admin',
    path: '/fee/structures',
    icon: <Icon as={MdAttachMoney} width="20px" height="20px" color="inherit" />,
    component: <FeeStructure />,
  },
  {
    name: 'Invoices',
    layout: '/admin',
    path: '/fee/invoices',
    icon: <Icon as={MdReceipt} width="20px" height="20px" color="inherit" />,
    component: <Invoices />,
  },
  {
    name: 'Mess Menu',
    layout: '/admin',
    path: '/mess/menu',
    icon: <Icon as={MdRestaurant} width="20px" height="20px" color="inherit" />,
    component: <MessMenu />,
  },
  {
    name: 'Mess Attendance',
    layout: '/admin',
    path: '/mess/attendance',
    icon: <Icon as={MdFactCheck} width="20px" height="20px" color="inherit" />,
    component: <MessAttendance />,
  },
  {
    name: 'Visitor Log',
    layout: '/admin',
    path: '/security/visitors',
    icon: <Icon as={MdSecurity} width="20px" height="20px" color="inherit" />,
    component: <VisitorLog />,
  },
  {
    name: 'Gate Passes',
    layout: '/admin',
    path: '/security/gatepass',
    icon: <Icon as={MdDoorFront} width="20px" height="20px" color="inherit" />,
    component: <GatePassManager />,
  },
  {
    name: 'Courses',
    layout: '/admin',
    path: '/academics/courses',
    icon: <Icon as={MdClass} width="20px" height="20px" color="inherit" />,
    component: <CourseManager />,
  },
  {
    name: 'Class Attendance',
    layout: '/admin',
    path: '/academics/attendance',
    icon: <Icon as={MdFactCheck} width="20px" height="20px" color="inherit" />,
    component: <AttendanceSheet />,
  },
  {
    name: 'Library Catalog',
    layout: '/admin',
    path: '/library/books',
    icon: <Icon as={MdLibraryBooks} width="20px" height="20px" color="inherit" />,
    component: <BookCatalog />,
  },
  {
    name: 'Issue Book',
    layout: '/admin',
    path: '/library/issue',
    icon: <Icon as={MdBook} width="20px" height="20px" color="inherit" />,
    component: <IssueReturn />,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: <Profile />,
  },
];

const studentRoutes = [
  {
    name: 'Student Dashboard',
    layout: '/student',
    path: '/dashboard',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: <StudentDashboard />,
  },
  {
    name: 'My Fees',
    layout: '/student',
    path: '/fees',
    icon: <Icon as={MdAttachMoney} width="20px" height="20px" color="inherit" />,
    component: <MyFees />,
  },
  {
    name: 'My Academics',
    layout: '/student',
    path: '/academics',
    icon: <Icon as={MdSchool} width="20px" height="20px" color="inherit" />,
    component: <MyAcademics />,
  },
  {
    name: 'Gate Passes',
    layout: '/student',
    path: '/gatepass',
    icon: <Icon as={MdDoorFront} width="20px" height="20px" color="inherit" />,
    component: <GatePassManager />,
  },
   {
    name: 'Complaints',
    layout: '/student',
    path: '/complaints',
    icon: <Icon as={MdReport} width="20px" height="20px" color="inherit" />,
    component: <Complaints />,
  },
];

const facultyRoutes = [
  {
    name: 'Faculty Dashboard',
    layout: '/faculty',
    path: '/dashboard',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    component: <FacultyDashboard />,
  },
  {
    name: 'Mark Attendance',
    layout: '/faculty',
    path: '/attendance',
    icon: <Icon as={MdFactCheck} width="20px" height="20px" color="inherit" />,
    component: <AttendanceSheet />,
  },
];

const authRoutes = [
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: <SignInCentered />,
  },
];

export { adminRoutes, studentRoutes, facultyRoutes, authRoutes };
export default [...adminRoutes, ...studentRoutes, ...facultyRoutes, ...authRoutes];
