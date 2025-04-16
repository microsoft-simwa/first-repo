"use client"

import { useState, useEffect } from "react"
import { SelectBox } from "@/components/SelectBox"
import Header from "@/components/Header"
import Sidebar from "@/components/Sidebar"
import RightSidebar from "@/components/RightSidebar"
import {
  Box,
  Heading,
  Image,
  Flex,
  Text,
  useBreakpointValue,
  Button,
  useDisclosure,
  IconButton,
  Tooltip,
  HStack,
  Avatar,
  AvatarGroup,
  Badge,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Divider,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react"
import {
  Calendar,
  ChevronDown,
  Search,
  Users,
  UserPlus,
  Mail,
  MessageSquare,
  Phone,
  MoreVertical,
  Filter,
  Briefcase,
  Check,
} from "lucide-react"

// Initialize localStorage if it doesn't exist
const initializeLocalStorage = () => {
  if (typeof window !== "undefined") {
    // Initialize team members data
    if (!localStorage.getItem("teamMembersData")) {
      localStorage.setItem("teamMembersData", JSON.stringify(teamMembersData))
    }

    // Initialize department data
    if (!localStorage.getItem("departmentsData")) {
      localStorage.setItem("departmentsData", JSON.stringify(departmentsData))
    }
  }
}

// Sample team members data
const teamMembersData = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@peakanddale.com",
    role: "Project Manager",
    department: "SOFTWARE DEVELOPMENT",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Jan 15, 2023",
    status: "Active",
    phone: "+1 (555) 123-4567",
    projects: ["Bulk SMS Platform", "Peak and Dale HRMS"],
    tasks: ["Create API documentation", "Design user interface"],
    isOnline: true,
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@peakanddale.com",
    role: "Senior Developer",
    department: "SOFTWARE DEVELOPMENT",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Feb 3, 2023",
    status: "Active",
    phone: "+1 (555) 234-5678",
    projects: ["Bulk SMS Platform", "Village Hopecore LMS"],
    tasks: ["Setup database schema", "Implement offline sync"],
    isOnline: true,
  },
  {
    id: 3,
    name: "Michael Chen",
    email: "michael.chen@peakanddale.com",
    role: "UI/UX Designer",
    department: "WEB DEVELOPMENT",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Mar 10, 2023",
    status: "Active",
    phone: "+1 (555) 345-6789",
    projects: ["APAD Website", "Unga Corporate Website"],
    tasks: ["Design homepage layout", "Create wireframes"],
    isOnline: false,
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily.davis@peakanddale.com",
    role: "Frontend Developer",
    department: "WEB DEVELOPMENT",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Apr 5, 2023",
    status: "Active",
    phone: "+1 (555) 456-7890",
    projects: ["Mhasibu Website", "Kimisitu Website"],
    tasks: ["Implement responsive design", "Create financial calculators"],
    isOnline: true,
  },
  {
    id: 5,
    name: "David Wilson",
    email: "david.wilson@peakanddale.com",
    role: "IT Support Specialist",
    department: "TECH SUPPORT",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "May 12, 2023",
    status: "Active",
    phone: "+1 (555) 567-8901",
    projects: ["IT Helpdesk System", "Network Infrastructure Upgrade"],
    tasks: ["Design ticket workflow", "Audit current infrastructure"],
    isOnline: false,
  },
  {
    id: 6,
    name: "Jessica Brown",
    email: "jessica.brown@peakanddale.com",
    role: "Business Analyst",
    department: "BUSINESS DEVELOPMENT",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Jun 20, 2023",
    status: "Active",
    phone: "+1 (555) 678-9012",
    projects: ["Market Expansion Strategy", "Partnership Development Program"],
    tasks: ["Conduct market research", "Identify potential partners"],
    isOnline: true,
  },
  {
    id: 7,
    name: "Robert Taylor",
    email: "robert.taylor@peakanddale.com",
    role: "Strategy Consultant",
    department: "STRATEGY DEVELOPMENT",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Jul 8, 2023",
    status: "Active",
    phone: "+1 (555) 789-0123",
    projects: ["Digital Transformation Roadmap", "Product Diversification Plan"],
    tasks: ["Assess current digital maturity", "Research market opportunities"],
    isOnline: false,
  },
  {
    id: 8,
    name: "Amanda Martinez",
    email: "amanda.martinez@peakanddale.com",
    role: "Social Media Manager",
    department: "INFLUENCER & REPUTATION MANAGEMENT",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Aug 15, 2023",
    status: "Active",
    phone: "+1 (555) 890-1234",
    projects: ["Social Media Influencer Program", "KTB Influencer Campaign"],
    tasks: ["Define program objectives", "Identify target influencers"],
    isOnline: true,
  },
  {
    id: 9,
    name: "Daniel Lee",
    email: "daniel.lee@peakanddale.com",
    role: "Creative Director",
    department: "CREATIVE",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Sep 3, 2023",
    status: "Active",
    phone: "+1 (555) 901-2345",
    projects: ["Peak and Dale Brand Identity", "Unga Limited Brand Refresh"],
    tasks: ["Conduct brand workshop", "Develop brand strategy"],
    isOnline: false,
  },
  {
    id: 10,
    name: "Sophia Garcia",
    email: "sophia.garcia@peakanddale.com",
    role: "Production Manager",
    department: "PRODUCTION",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Oct 12, 2023",
    status: "Active",
    phone: "+1 (555) 012-3456",
    projects: ["Product Photography Session", "Indomie TVC Production"],
    tasks: ["Prepare shot list", "Create storyboard"],
    isOnline: true,
  },
  {
    id: 11,
    name: "James Wilson",
    email: "james.wilson@peakanddale.com",
    role: "PR Specialist",
    department: "PUBLIC RELATIONS & COMMUNICATIONS",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Nov 5, 2023",
    status: "Active",
    phone: "+1 (555) 123-4567",
    projects: ["Press Release Campaign", "Corporate Crisis Management Plan"],
    tasks: ["Develop press release schedule", "Identify potential crisis scenarios"],
    isOnline: false,
  },
  {
    id: 12,
    name: "Olivia Thompson",
    email: "olivia.thompson@peakanddale.com",
    role: "Event Coordinator",
    department: "EVENT MANAGEMENT & TRAINING",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Dec 10, 2023",
    status: "Active",
    phone: "+1 (555) 234-5678",
    projects: ["Annual Corporate Conference", "Sales Team Training Program"],
    tasks: ["Select venue", "Develop training materials"],
    isOnline: true,
  },
  {
    id: 13,
    name: "William Clark",
    email: "william.clark@peakanddale.com",
    role: "Marketing Manager",
    department: "MARKETING",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Jan 8, 2024",
    status: "Active",
    phone: "+1 (555) 345-6789",
    projects: ["Product Launch Campaign", "Email Marketing Automation"],
    tasks: ["Develop campaign strategy", "Design email templates"],
    isOnline: false,
  },
  {
    id: 14,
    name: "Emma Rodriguez",
    email: "emma.rodriguez@peakanddale.com",
    role: "Financial Analyst",
    department: "ACCOUNTS",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Feb 15, 2024",
    status: "Active",
    phone: "+1 (555) 456-7890",
    projects: ["Financial Reporting System", "Budget Planning Process"],
    tasks: ["Define reporting requirements", "Create budget templates"],
    isOnline: true,
  },
  {
    id: 15,
    name: "Alexander White",
    email: "alexander.white@peakanddale.com",
    role: "HR Specialist",
    department: "HUMAN RESOURCES",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Mar 3, 2024",
    status: "Active",
    phone: "+1 (555) 567-8901",
    projects: ["Employee Onboarding System", "Performance Review Framework"],
    tasks: ["Map onboarding process", "Define performance metrics"],
    isOnline: false,
  },
  {
    id: 16,
    name: "Natalie Green",
    email: "natalie.green@peakanddale.com",
    role: "Office Manager",
    department: "ADMINISTRATION",
    avatar: "/placeholder.svg?height=40&width=40",
    dateAdded: "Apr 10, 2024",
    status: "Active",
    phone: "+1 (555) 678-9012",
    projects: ["Office Relocation Project", "Document Management System"],
    tasks: ["Create relocation timeline", "Define document categories"],
    isOnline: true,
  },
]

// Sample departments data
const departmentsData = [
  {
    id: 1,
    name: "SOFTWARE DEVELOPMENT",
    description: "Develops software applications and systems",
    memberCount: 2,
    projectCount: 4,
    taskCount: 8,
    lead: "John Smith",
  },
  {
    id: 2,
    name: "WEB DEVELOPMENT",
    description: "Creates and maintains websites and web applications",
    memberCount: 2,
    projectCount: 4,
    taskCount: 6,
    lead: "Michael Chen",
  },
  {
    id: 3,
    name: "TECH SUPPORT",
    description: "Provides technical assistance and support",
    memberCount: 1,
    projectCount: 2,
    taskCount: 5,
    lead: "David Wilson",
  },
  {
    id: 4,
    name: "BUSINESS DEVELOPMENT",
    description: "Identifies growth opportunities and builds partnerships",
    memberCount: 1,
    projectCount: 2,
    taskCount: 6,
    lead: "Jessica Brown",
  },
  {
    id: 5,
    name: "STRATEGY DEVELOPMENT",
    description: "Develops long-term strategic plans and initiatives",
    memberCount: 1,
    projectCount: 2,
    taskCount: 6,
    lead: "Robert Taylor",
  },
  {
    id: 6,
    name: "INFLUENCER & REPUTATION MANAGEMENT",
    description: "Manages brand reputation and influencer relationships",
    memberCount: 1,
    projectCount: 2,
    taskCount: 4,
    lead: "Amanda Martinez",
  },
  {
    id: 7,
    name: "CREATIVE",
    description: "Handles creative design and branding",
    memberCount: 1,
    projectCount: 2,
    taskCount: 6,
    lead: "Daniel Lee",
  },
  {
    id: 8,
    name: "PRODUCTION",
    description: "Manages production of media and content",
    memberCount: 1,
    projectCount: 2,
    taskCount: 4,
    lead: "Sophia Garcia",
  },
  {
    id: 9,
    name: "PUBLIC RELATIONS & COMMUNICATIONS",
    description: "Manages public relations and communications",
    memberCount: 1,
    projectCount: 2,
    taskCount: 5,
    lead: "James Wilson",
  },
  {
    id: 10,
    name: "EVENT MANAGEMENT & TRAINING",
    description: "Organizes events and training programs",
    memberCount: 1,
    projectCount: 2,
    taskCount: 5,
    lead: "Olivia Thompson",
  },
  {
    id: 11,
    name: "MARKETING",
    description: "Develops and implements marketing strategies",
    memberCount: 1,
    projectCount: 2,
    taskCount: 6,
    lead: "William Clark",
  },
  {
    id: 12,
    name: "ACCOUNTS",
    description: "Manages financial accounts and reporting",
    memberCount: 1,
    projectCount: 2,
    taskCount: 5,
    lead: "Emma Rodriguez",
  },
  {
    id: 13,
    name: "HUMAN RESOURCES",
    description: "Manages employee relations and recruitment",
    memberCount: 1,
    projectCount: 2,
    taskCount: 6,
    lead: "Alexander White",
  },
  {
    id: 14,
    name: "ADMINISTRATION",
    description: "Handles administrative tasks and office management",
    memberCount: 1,
    projectCount: 2,
    taskCount: 6,
    lead: "Natalie Green",
  },
]

// Dropdown options
const dropDownOptions = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "this-week" },
  { label: "This Month", value: "this-month" },
  { label: "This Quarter", value: "this-quarter" },
]

// Custom checkbox component
const CustomCheckbox = ({ isChecked, onChange }) => {
  return (
    <Box
      onClick={onChange}
      position="relative"
      width="20px"
      height="20px"
      borderRadius="6px"
      border="2px solid"
      borderColor={isChecked ? "#81BE41" : "gray.300"}
      bg={isChecked ? "#81BE41" : "white"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      cursor="pointer"
      transition="all 0.3s"
      mr="12px"
      _hover={{
        borderColor: isChecked ? "#81BE41" : "#81BE41",
        transform: "scale(1.05)",
      }}
    >
      {isChecked && <Box as={Check} size={14} color="white" />}
    </Box>
  )
}

// Define theme colors and styles
const theme = {
  colors: {
    primary: "#81BE41",
    primaryHover: "#6ca32e",
    primaryLight: "rgba(129, 190, 65, 0.1)",
    primaryLighter: "rgba(129, 190, 65, 0.05)",
    textColor: "#000000",
    textMuted: "#4A5568",
    borderColor: "#E2E8F0",
    borderColorDarker: "#CBD5E0",
  },
  fontSizes: {
    xs: "13px", // Increased by 1px
    sm: "15px", // Increased by 1px
    md: "17px", // Increased by 1px
    lg: "19px", // Increased by 1px
    xl: "21px", // Increased by 1px
    "2xl": "25px", // Increased by 1px
    "3xl": "31px", // Increased by 1px
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  borderRadius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 3px rgba(0,0,0,0.1)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
    lg: "0 10px 15px rgba(0,0,0,0.1)",
  },
  transitions: {
    fast: "0.2s",
    normal: "0.3s",
    slow: "0.5s",
  },
}

export default function TeamsPage() {
  // State variables
  const [teamMembers, setTeamMembers] = useState([])
  const [departments, setDepartments] = useState([])
  const [userDepartment, setUserDepartment] = useState("SOFTWARE DEVELOPMENT") // Default department for the current user
  const [filteredMembers, setFilteredMembers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartments, setSelectedDepartments] = useState([])
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)
  const [activeView, setActiveView] = useState("team") // team, departments
  const [projectsData, setProjectsData] = useState([])
  const [tasksData, setTasksData] = useState([])

  // Modal states
  const { isOpen: isInviteOpen, onOpen: onInviteOpen, onClose: onInviteClose } = useDisclosure()
  const { isOpen: isMemberDetailsOpen, onOpen: onMemberDetailsOpen, onClose: onMemberDetailsClose } = useDisclosure()
  const {
    isOpen: isDepartmentDetailsOpen,
    onOpen: onDepartmentDetailsOpen,
    onClose: onDepartmentDetailsClose,
  } = useDisclosure()
  const [selectedDepartment, setSelectedDepartment] = useState(null)

  // Toast for notifications
  const toast = useToast()

  // Responsive variables
  const mainContentWidth = useBreakpointValue({ base: "100%", md: "69%" })

  // Initialize localStorage on component mount
  useEffect(() => {
    initializeLocalStorage()

    // Load data from localStorage
    if (typeof window !== "undefined") {
      // Load team members
      const teamMembersData = localStorage.getItem("teamMembersData")
      if (teamMembersData) {
        const members = JSON.parse(teamMembersData)
        setTeamMembers(members)

        // Filter members based on user's department
        const filtered = members.filter((member) => member.department === userDepartment)
        setFilteredMembers(filtered)
      }

      // Load departments
      const departmentsData = localStorage.getItem("departmentsData")
      if (departmentsData) {
        setDepartments(JSON.parse(departmentsData))
      }

      // Load projects
      const projectsData = localStorage.getItem("projectsData")
      if (projectsData) {
        setProjectsData(JSON.parse(projectsData))
      }

      // Load tasks
      const tasksData = localStorage.getItem("tasksData")
      if (tasksData) {
        setTasksData(JSON.parse(tasksData))
      }
    }
  }, [userDepartment])

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)

    if (query === "") {
      // If search is cleared, show members from user's department
      const filtered = teamMembers.filter((member) =>
        selectedDepartments.length === 0
          ? member.department === userDepartment
          : selectedDepartments.includes(member.department),
      )
      setFilteredMembers(filtered)
    } else {
      // Filter based on search query and selected departments
      const filtered = teamMembers.filter((member) => {
        const matchesSearch =
          member.name.toLowerCase().includes(query) ||
          member.email.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query)

        const matchesDepartment =
          selectedDepartments.length === 0
            ? member.department === userDepartment
            : selectedDepartments.includes(member.department)

        return matchesSearch && matchesDepartment
      })
      setFilteredMembers(filtered)
    }
  }

  // Handle department selection for filtering
  const handleDepartmentSelection = (department) => {
    if (department === "ALL DEPARTMENTS") {
      setSelectedDepartments([])

      // Show only members from user's department when "All Departments" is selected
      const filtered = teamMembers.filter((member) => member.department === userDepartment)
      setFilteredMembers(filtered)
    } else {
      // Toggle the selected department
      const newSelection = [...selectedDepartments]

      if (newSelection.includes(department)) {
        // Remove department if already selected
        const updatedSelection = newSelection.filter((dep) => dep !== department)
        setSelectedDepartments(updatedSelection)

        // If no departments are selected, show only user's department
        if (updatedSelection.length === 0) {
          const filtered = teamMembers.filter((member) => member.department === userDepartment)
          setFilteredMembers(filtered)
        } else {
          // Filter based on selected departments
          const filtered = teamMembers.filter((member) => updatedSelection.includes(member.department))
          setFilteredMembers(filtered)
        }
      } else {
        // Add department to selection
        newSelection.push(department)
        setSelectedDepartments(newSelection)

        // Filter based on selected departments
        const filtered = teamMembers.filter((member) => newSelection.includes(member.department))
        setFilteredMembers(filtered)
      }
    }
  }

  // Handle member click to show details
  const handleMemberClick = (member) => {
    setSelectedMember(member)
    onMemberDetailsOpen()
  }

  // Handle department click to show details
  const handleDepartmentClick = (department) => {
    setSelectedDepartment(department)
    onDepartmentDetailsOpen()
  }

  // Handle invite new member
  const handleInviteMember = (e) => {
    e.preventDefault()

    // Get form data
    const formData = new FormData(e.target)
    const name = formData.get("name")
    const email = formData.get("email")
    const role = formData.get("role")
    const department = formData.get("department")

    // Create new member
    const newMember = {
      id: teamMembers.length + 1,
      name,
      email,
      role,
      department,
      avatar: "/placeholder.svg?height=40&width=40",
      dateAdded: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Pending",
      phone: "",
      projects: [],
      tasks: [],
      isOnline: false,
    }

    // Add new member to state
    const updatedMembers = [...teamMembers, newMember]
    setTeamMembers(updatedMembers)

    // Update filtered members if the new member belongs to the user's department
    // or one of the selected departments
    if (department === userDepartment || (selectedDepartments.length > 0 && selectedDepartments.includes(department))) {
      setFilteredMembers([...filteredMembers, newMember])
    }

    // Update localStorage
    localStorage.setItem("teamMembersData", JSON.stringify(updatedMembers))

    // Update department member count
    const updatedDepartments = departments.map((dept) => {
      if (dept.name === department) {
        return {
          ...dept,
          memberCount: dept.memberCount + 1,
        }
      }
      return dept
    })
    setDepartments(updatedDepartments)
    localStorage.setItem("departmentsData", JSON.stringify(updatedDepartments))

    // Close modal and show success message
    onInviteClose()
    toast({
      title: "Invitation sent",
      description: `Invitation sent to ${name} (${email})`,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top-right",
      variant: "solid",
      containerStyle: {
        borderRadius: "10px",
        background: "#81BE41",
        color: "white",
      },
    })
  }

  // Get department projects
  const getDepartmentProjects = (departmentName) => {
    return projectsData.filter((project) => project.department === departmentName)
  }

  // Get department tasks
  const getDepartmentTasks = (departmentName) => {
    return tasksData.filter((task) => task.department === departmentName)
  }

  // Get member projects
  const getMemberProjects = (memberProjects) => {
    return projectsData.filter((project) => memberProjects.includes(project.buttonText))
  }

  // Get member tasks
  const getMemberTasks = (memberTasks) => {
    return tasksData.filter((task) => memberTasks.includes(task.taskName))
  }

  // Add a click handler to close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isFilterDropdownOpen && !event.target.closest("[data-filter-dropdown]")) {
        setIsFilterDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isFilterDropdownOpen])

  return (
    <Box bg="white" w="100%" overflowX="hidden">
      <Flex alignItems="flex-start" flexDirection={{ base: "column", md: "row" }}>
        {/* Left Sidebar */}
        <Box position={{ md: "sticky" }} top={{ md: "0" }} height={{ md: "100vh" }} zIndex={{ md: 10 }}>
          <Sidebar />
        </Box>

        <Box flex={1} position="relative" minH={{ base: "auto", md: "100vh" }}>
          {/* Header Section */}
          <Box
            bgGradient={`linear-gradient(180deg, ${theme.colors.primary} 0%, rgba(129, 190, 65, 0) 100%)`}
            w="100%"
            px={{ base: "20px", md: "28px" }}
            py={{ base: "20px", md: "24px" }}
          >
            <Header mb="20px" flexDirection={{ base: "column", md: "row" }} />
          </Box>

          {/* Main Content Area */}
          <Flex flexDirection={{ base: "column", md: "row" }}>
            {/* Main Content */}
            <Box
              w={{ base: "100%", md: mainContentWidth }}
              borderColor={theme.colors.borderColor}
              borderRightWidth={{ md: "1px" }}
              borderStyle="solid"
              bg="white"
              order={{ base: 2, md: 1 }}
            >
              {/* Page Title and Filters */}
              <Flex
                px={{ base: "20px", md: "28px" }}
                py={{ base: "24px", md: "24px" }}
                justifyContent="space-between"
                alignItems={{ base: "flex-start", md: "center" }}
                flexDirection={{ base: "column", md: "row" }}
                gap={{ base: "20px", md: "0" }}
              >
                <Flex flexDirection="column" alignItems="flex-start" mt="0">
                  <Heading
                    as="h1"
                    letterSpacing="1.50px"
                    fontSize={theme.fontSizes["2xl"]}
                    fontWeight={700}
                    color={theme.colors.textColor}
                    mb="4px"
                  >
                    Collaborate with Your Team
                  </Heading>
                  <Heading as="h6" fontSize={theme.fontSizes.lg} fontWeight={500} color={theme.colors.textColor}>
                    Teams
                  </Heading>
                </Flex>

                <Flex
                  gap={{ base: "16px", md: "20px" }}
                  w={{ base: "100%", md: "auto" }}
                  justifyContent={{ base: "space-between", md: "flex-end" }}
                  alignItems="center"
                >
                  {/* View toggle buttons */}
                  <HStack spacing={3} mr={3}>
                    <Tooltip label="Team View" placement="top" hasArrow bg={theme.colors.primary}>
                      <IconButton
                        aria-label="Team View"
                        icon={<Users size={22} />}
                        size="md"
                        variant={activeView === "team" ? "solid" : "ghost"}
                        colorScheme={activeView === "team" ? "green" : "gray"}
                        onClick={() => setActiveView("team")}
                        _hover={{ bg: activeView === "team" ? "" : theme.colors.primaryLighter }}
                        color={activeView === "team" ? "white" : theme.colors.textColor}
                        bg={activeView === "team" ? theme.colors.primary : ""}
                        boxShadow={activeView === "team" ? theme.shadows.sm : "none"}
                        transition={theme.transitions.normal}
                      />
                    </Tooltip>
                    <Tooltip label="Departments View" placement="top" hasArrow bg={theme.colors.primary}>
                      <IconButton
                        aria-label="Departments View"
                        icon={<Briefcase size={22} />}
                        size="md"
                        variant={activeView === "departments" ? "solid" : "ghost"}
                        colorScheme={activeView === "departments" ? "green" : "gray"}
                        onClick={() => setActiveView("departments")}
                        _hover={{ bg: activeView === "departments" ? "" : theme.colors.primaryLighter }}
                        color={activeView === "departments" ? "white" : theme.colors.textColor}
                        bg={activeView === "departments" ? theme.colors.primary : ""}
                        boxShadow={activeView === "departments" ? theme.shadows.sm : "none"}
                        transition={theme.transitions.normal}
                      />
                    </Tooltip>
                  </HStack>

                  {/* Invite Member Button */}
                  <Button
                    onClick={onInviteOpen}
                    bg={theme.colors.primary}
                    color="white"
                    _hover={{ bg: theme.colors.primaryHover, transform: "translateY(-2px)" }}
                    fontSize={theme.fontSizes.sm}
                    fontWeight={600}
                    h={{ base: "40px", md: "44px" }}
                    px={{ base: "16px", md: "20px" }}
                    py="0"
                    borderRadius={theme.borderRadius.md}
                    leftIcon={<UserPlus size={18} />}
                    boxShadow={theme.shadows.sm}
                    transition={theme.transitions.normal}
                  >
                    Invite team member
                  </Button>

                  <SelectBox
                    shape="round"
                    indicator={<Image src="images/img_arrowdown_black_900_01.svg" alt="Arrow Down" w="24px" h="24px" />}
                    getOptionLabel={(e) => (
                      <Box display="flex" alignItems="center">
                        <Image src="images/img_uilcalender_gray_500.svg" alt="Uil:calender" w="20px" h="20px" />
                        <span
                          style={{ marginLeft: "8px", fontSize: theme.fontSizes.sm, color: theme.colors.textColor }}
                        >
                          {e.label}
                        </span>
                      </Box>
                    )}
                    name="uilcalender"
                    placeholder={`Today`}
                    options={dropDownOptions}
                    style={{
                      fontWeight: 500,
                      fontSize: theme.fontSizes.sm,
                      gap: "8px",
                      borderColor: theme.colors.borderColorDarker,
                      borderWidth: "1px",
                      borderStyle: "solid",
                      borderRadius: theme.borderRadius.md,
                      w: { base: "48%", md: "130px" },
                      h: "44px",
                      transition: theme.transitions.normal,
                    }}
                  />
                  <Box position="relative" w={{ base: "48%", md: "130px" }} data-filter-dropdown>
                    <Button
                      onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      w="100%"
                      h="44px"
                      px="16px"
                      border="1px solid"
                      borderColor={theme.colors.borderColorDarker}
                      borderRadius={theme.borderRadius.md}
                      bg="white"
                      _hover={{ bg: theme.colors.primaryLighter, borderColor: theme.colors.primary }}
                      transition={theme.transitions.normal}
                    >
                      <Flex alignItems="center" gap="8px">
                        <Filter size={18} color={theme.colors.textColor} />
                        <Text fontWeight={500} fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                          Filter
                        </Text>
                      </Flex>
                      <Box as={ChevronDown} size={18} color={theme.colors.textColor} />
                    </Button>

                    {isFilterDropdownOpen && (
                      <Box
                        position="absolute"
                        top="48px"
                        left="0"
                        right="0"
                        zIndex="10"
                        bg="white"
                        boxShadow={theme.shadows.lg}
                        borderRadius={theme.borderRadius.md}
                        border="1px solid"
                        borderColor={theme.colors.borderColor}
                        maxH="350px"
                        overflowY="auto"
                        w="280px"
                        animation="fadeIn 0.3s ease-in-out"
                      >
                        <Box p="14px 18px" borderBottom="1px solid" borderColor={theme.colors.borderColor}>
                          <Text fontWeight="600" fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                            Filter by Department
                          </Text>
                        </Box>
                        <Box p="12px">
                          <Flex
                            align="center"
                            p="10px 14px"
                            cursor="pointer"
                            borderRadius={theme.borderRadius.sm}
                            _hover={{ bg: theme.colors.primaryLighter }}
                            onClick={() => handleDepartmentSelection("ALL DEPARTMENTS")}
                            transition={theme.transitions.fast}
                          >
                            <CustomCheckbox
                              isChecked={selectedDepartments.length === 0}
                              onChange={() => handleDepartmentSelection("ALL DEPARTMENTS")}
                            />
                            <Text fontSize={theme.fontSizes.sm} fontWeight="500" color={theme.colors.textColor}>
                              All Departments
                            </Text>
                          </Flex>
                          {departments.map((department) => (
                            <Flex
                              key={department.id}
                              align="center"
                              p="10px 14px"
                              cursor="pointer"
                              borderRadius={theme.borderRadius.sm}
                              _hover={{ bg: theme.colors.primaryLighter }}
                              onClick={() => handleDepartmentSelection(department.name)}
                              transition={theme.transitions.fast}
                            >
                              <CustomCheckbox
                                isChecked={selectedDepartments.includes(department.name)}
                                onChange={() => handleDepartmentSelection(department.name)}
                              />
                              <Text fontSize={theme.fontSizes.sm} fontWeight="500" color={theme.colors.textColor}>
                                {department.name.charAt(0) + department.name.slice(1).toLowerCase()}
                              </Text>
                            </Flex>
                          ))}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Flex>
              </Flex>

              {/* Search Bar */}
              <Box px={{ base: "20px", md: "28px" }} pb="20px">
                <InputGroup size="lg">
                  <InputLeftElement pointerEvents="none" h="100%" pl="2">
                    <Search color={theme.colors.textMuted} size={22} />
                  </InputLeftElement>
                  <Input
                    placeholder="Search team members..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    borderRadius={theme.borderRadius.md}
                    borderColor={theme.colors.borderColorDarker}
                    _focus={{ borderColor: theme.colors.primary, boxShadow: `0 0 0 1px ${theme.colors.primary}` }}
                    _hover={{ borderColor: theme.colors.primary }}
                    fontSize={theme.fontSizes.sm}
                    h="50px"
                    pl="45px"
                    color={theme.colors.textColor}
                    transition={theme.transitions.normal}
                  />
                </InputGroup>
              </Box>

              {/* Team Content */}
              <Box
                borderColor={theme.colors.borderColor}
                borderTopWidth="1px"
                borderStyle="solid"
                bg="white"
                px={{ base: "20px", md: "28px" }}
                py={{ base: "24px", md: "28px" }}
              >
                {/* Add new employee-focused features */}
                {/* Add a "Quick Actions" section at the top of the content area */}
                <Box
                  mb="28px"
                  px={{ base: "20px", md: "24px" }}
                  py="20px"
                  bg={theme.colors.primaryLighter}
                  borderRadius={theme.borderRadius.md}
                  borderLeft={`4px solid ${theme.colors.primary}`}
                  boxShadow={theme.shadows.sm}
                >
                  <Heading size="sm" mb="16px" color={theme.colors.textColor} fontSize={theme.fontSizes.md}>
                    Quick Actions
                  </Heading>
                  <Flex flexWrap="wrap" gap="10px">
                    <Button
                      size="md"
                      leftIcon={<MessageSquare size={16} />}
                      variant="outline"
                      borderColor={theme.colors.primary}
                      color={theme.colors.textColor}
                      _hover={{ bg: theme.colors.primaryLighter, transform: "translateY(-2px)" }}
                      fontSize={theme.fontSizes.sm}
                      px="16px"
                      py="8px"
                      borderRadius={theme.borderRadius.md}
                      transition={theme.transitions.normal}
                    >
                      Message Team
                    </Button>
                    <Button
                      size="md"
                      leftIcon={<Calendar size={16} />}
                      variant="outline"
                      borderColor={theme.colors.primary}
                      color={theme.colors.textColor}
                      _hover={{ bg: theme.colors.primaryLighter, transform: "translateY(-2px)" }}
                      fontSize={theme.fontSizes.sm}
                      px="16px"
                      py="8px"
                      borderRadius={theme.borderRadius.md}
                      transition={theme.transitions.normal}
                    >
                      Team Calendar
                    </Button>
                    <Button
                      size="md"
                      leftIcon={<Users size={16} />}
                      variant="outline"
                      borderColor={theme.colors.primary}
                      color={theme.colors.textColor}
                      _hover={{ bg: theme.colors.primaryLighter, transform: "translateY(-2px)" }}
                      fontSize={theme.fontSizes.sm}
                      px="16px"
                      py="8px"
                      borderRadius={theme.borderRadius.md}
                      transition={theme.transitions.normal}
                    >
                      Team Directory
                    </Button>
                    <Button
                      size="md"
                      leftIcon={<Briefcase size={16} />}
                      variant="outline"
                      borderColor={theme.colors.primary}
                      color={theme.colors.textColor}
                      _hover={{ bg: theme.colors.primaryLighter, transform: "translateY(-2px)" }}
                      fontSize={theme.fontSizes.sm}
                      px="16px"
                      py="8px"
                      borderRadius={theme.borderRadius.md}
                      transition={theme.transitions.normal}
                    >
                      Department Projects
                    </Button>
                  </Flex>
                </Box>

                {activeView === "team" ? (
                  <>
                    {/* Team Members View */}
                    {/* Add a "Team Announcements" section */}
                    <Box mb="28px" display={activeView === "team" ? "block" : "none"}>
                      <Flex alignItems="center" mb="16px">
                        <Heading size="sm" fontSize={theme.fontSizes.md} color={theme.colors.textColor}>
                          Team Announcements
                        </Heading>
                        <Button
                          size="sm"
                          ml="auto"
                          variant="ghost"
                          color={theme.colors.primary}
                          _hover={{ bg: theme.colors.primaryLighter }}
                          fontSize={theme.fontSizes.xs}
                        >
                          View All
                        </Button>
                      </Flex>
                      <Box
                        p="20px"
                        borderRadius={theme.borderRadius.md}
                        border="1px solid"
                        borderColor={theme.colors.borderColor}
                        bg="white"
                        boxShadow={theme.shadows.sm}
                        _hover={{ boxShadow: theme.shadows.md, borderColor: theme.colors.primary }}
                        transition={theme.transitions.normal}
                      >
                        <Flex alignItems="center" mb="12px">
                          <Avatar
                            size="md"
                            name="John Smith"
                            src="/placeholder.svg?height=40&width=40"
                            mr="12px"
                            border="2px solid white"
                            boxShadow={theme.shadows.sm}
                          />
                          <Box>
                            <Text fontWeight="600" fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                              John Smith
                            </Text>
                            <Text fontSize={theme.fontSizes.xs} color={theme.colors.textColor}>
                              2 days ago
                            </Text>
                          </Box>
                        </Flex>
                        <Text fontSize={theme.fontSizes.sm} mb="16px" color={theme.colors.textColor} lineHeight="1.6">
                          Team meeting scheduled for Friday at 10:00 AM to discuss the upcoming Bulk SMS Platform
                          project milestones.
                        </Text>
                        <Flex justifyContent="space-between">
                          <Button
                            size="sm"
                            leftIcon={<Calendar size={14} />}
                            variant="ghost"
                            color={theme.colors.textColor}
                            _hover={{ bg: theme.colors.primaryLighter, color: theme.colors.primary }}
                            fontSize={theme.fontSizes.xs}
                          >
                            Add to Calendar
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            color={theme.colors.textColor}
                            _hover={{ bg: theme.colors.primaryLighter, color: theme.colors.primary }}
                            fontSize={theme.fontSizes.xs}
                          >
                            Reply
                          </Button>
                        </Flex>
                      </Box>
                    </Box>

                    <Tabs variant="line" mb={{ base: "28px", md: "32px" }} colorScheme="green">
                      <TabList mb="20px">
                        <Tab
                          fontWeight="600"
                          _selected={{
                            color: theme.colors.primary,
                            borderColor: theme.colors.primary,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                          }}
                          mx="2px"
                          px="28px"
                          py="14px"
                          borderRadius="4px 4px 0 0"
                          _hover={{ bg: theme.colors.primaryLighter }}
                          transition={theme.transitions.normal}
                          fontSize={theme.fontSizes.sm}
                          color={theme.colors.textColor}
                        >
                          My Department
                        </Tab>
                        <Tab
                          fontWeight="600"
                          _selected={{
                            color: theme.colors.primary,
                            borderColor: theme.colors.primary,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                          }}
                          mx="2px"
                          px="28px"
                          py="14px"
                          borderRadius="4px 4px 0 0"
                          _hover={{ bg: theme.colors.primaryLighter }}
                          transition={theme.transitions.normal}
                          fontSize={theme.fontSizes.sm}
                          color={theme.colors.textColor}
                        >
                          All Members
                        </Tab>
                      </TabList>
                      <TabPanels>
                        {/* My Department Tab */}
                        <TabPanel p="0">
                          <Text
                            fontSize={theme.fontSizes.md}
                            fontWeight="600"
                            mb="20px"
                            textTransform="capitalize"
                            color={theme.colors.textColor}
                          >
                            {userDepartment.charAt(0) + userDepartment.slice(1).toLowerCase()} Department Members
                          </Text>
                          {filteredMembers.length > 0 ? (
                            <Flex flexWrap="wrap" gap="20px">
                              {filteredMembers.map((member) => (
                                <Box
                                  key={member.id}
                                  w={{ base: "100%", sm: "calc(50% - 10px)", md: "calc(33.33% - 14px)" }}
                                  borderRadius={theme.borderRadius.md}
                                  border="1px solid"
                                  borderColor={theme.colors.borderColor}
                                  overflow="hidden"
                                  transition={theme.transitions.normal}
                                  _hover={{
                                    boxShadow: theme.shadows.md,
                                    borderColor: theme.colors.primary,
                                    transform: "translateY(-4px)",
                                  }}
                                  cursor="pointer"
                                  onClick={() => handleMemberClick(member)}
                                  bg="white"
                                  position="relative"
                                >
                                  {member.isOnline && (
                                    <Box
                                      position="absolute"
                                      top="12px"
                                      right="12px"
                                      w="10px"
                                      h="10px"
                                      borderRadius="full"
                                      bg={theme.colors.primary}
                                      zIndex="1"
                                      boxShadow="0 0 0 2px white"
                                    />
                                  )}
                                  <Flex
                                    p="20px"
                                    alignItems="center"
                                    borderBottom="1px solid"
                                    borderColor={theme.colors.borderColor}
                                  >
                                    <Box position="relative">
                                      <Avatar
                                        src={member.avatar}
                                        name={member.name}
                                        size="lg"
                                        border="2px solid white"
                                        boxShadow={theme.shadows.sm}
                                      />
                                      {member.isOnline && (
                                        <Box
                                          position="absolute"
                                          bottom="0"
                                          right="0"
                                          w="12px"
                                          h="12px"
                                          borderRadius="full"
                                          bg={theme.colors.primary}
                                          border="2px solid white"
                                        />
                                      )}
                                    </Box>
                                    <Box ml="16px">
                                      <Text
                                        fontWeight="600"
                                        fontSize={theme.fontSizes.md}
                                        color={theme.colors.textColor}
                                      >
                                        {member.name}
                                      </Text>
                                      <Text fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                                        {member.role}
                                      </Text>
                                    </Box>
                                  </Flex>
                                  <Box p="20px">
                                    <Flex alignItems="center" mb="10px">
                                      <Mail size={18} color={theme.colors.textColor} />
                                      <Text ml="10px" fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                                        {member.email}
                                      </Text>
                                    </Flex>
                                    <Flex alignItems="center" mb="10px">
                                      <Briefcase size={18} color={theme.colors.textColor} />
                                      <Text ml="10px" fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                                        {member.department.charAt(0) + member.department.slice(1).toLowerCase()}
                                      </Text>
                                    </Flex>
                                    <Flex alignItems="center">
                                      <Box as={Calendar} size={18} color={theme.colors.textColor} />
                                      <Text ml="10px" fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                                        Joined {member.dateAdded}
                                      </Text>
                                    </Flex>
                                  </Box>
                                  <Box
                                    p="14px 20px"
                                    bg={theme.colors.primaryLighter}
                                    borderTop="1px solid"
                                    borderColor={theme.colors.borderColor}
                                  >
                                    <Flex justifyContent="space-between" alignItems="center">
                                      <Text
                                        fontSize={theme.fontSizes.sm}
                                        fontWeight="500"
                                        color={theme.colors.textColor}
                                      >
                                        {member.projects.length} Projects • {member.tasks.length} Tasks
                                      </Text>
                                      <Badge
                                        colorScheme={member.isOnline ? "green" : "gray"}
                                        bg={member.isOnline ? theme.colors.primary : "gray.200"}
                                        color={member.isOnline ? "white" : "gray.700"}
                                        fontSize={theme.fontSizes.xs}
                                        fontWeight="500"
                                        px="8px"
                                        py="4px"
                                        borderRadius="full"
                                      >
                                        {member.isOnline ? "Online" : "Offline"}
                                      </Badge>
                                    </Flex>
                                  </Box>
                                </Box>
                              ))}
                            </Flex>
                          ) : (
                            <Flex
                              direction="column"
                              alignItems="center"
                              justifyContent="center"
                              py="50px"
                              bg={theme.colors.primaryLighter}
                              borderRadius={theme.borderRadius.md}
                              border="1px dashed"
                              borderColor={theme.colors.primary}
                            >
                              <Users size={56} color={theme.colors.primary} />
                              <Text
                                mt="20px"
                                fontSize={theme.fontSizes.md}
                                fontWeight="600"
                                color={theme.colors.textColor}
                              >
                                No team members found
                              </Text>
                              <Text
                                fontSize={theme.fontSizes.sm}
                                color={theme.colors.textColor}
                                mt="6px"
                                textAlign="center"
                                maxW="400px"
                                lineHeight="1.6"
                              >
                                {searchQuery ? "Try a different search term" : "Invite team members to get started"}
                              </Text>
                              <Button
                                mt="20px"
                                onClick={onInviteOpen}
                                size="md"
                                leftIcon={<UserPlus size={18} />}
                                bg={theme.colors.primary}
                                color="white"
                                _hover={{ bg: theme.colors.primaryHover, transform: "translateY(-2px)" }}
                                boxShadow={theme.shadows.sm}
                                transition={theme.transitions.normal}
                                fontSize={theme.fontSizes.sm}
                                px="20px"
                                py="10px"
                                borderRadius={theme.borderRadius.md}
                              >
                                Invite team member
                              </Button>
                            </Flex>
                          )}
                        </TabPanel>

                        {/* All Members Tab */}
                        <TabPanel p="0">
                          <Text fontSize={theme.fontSizes.md} fontWeight="600" mb="20px" color={theme.colors.textColor}>
                            All Team Members
                          </Text>
                          {teamMembers.length > 0 ? (
                            <Flex flexWrap="wrap" gap="20px">
                              {teamMembers.map((member) => (
                                <Box
                                  key={member.id}
                                  w={{ base: "100%", sm: "calc(50% - 10px)", md: "calc(33.33% - 14px)" }}
                                  borderRadius={theme.borderRadius.md}
                                  border="1px solid"
                                  borderColor={theme.colors.borderColor}
                                  overflow="hidden"
                                  transition={theme.transitions.normal}
                                  _hover={{
                                    boxShadow: theme.shadows.md,
                                    borderColor: theme.colors.primary,
                                    transform: "translateY(-4px)",
                                  }}
                                  cursor="pointer"
                                  onClick={() => handleMemberClick(member)}
                                  bg="white"
                                  position="relative"
                                >
                                  {member.isOnline && (
                                    <Box
                                      position="absolute"
                                      top="12px"
                                      right="12px"
                                      w="10px"
                                      h="10px"
                                      borderRadius="full"
                                      bg={theme.colors.primary}
                                      zIndex="1"
                                      boxShadow="0 0 0 2px white"
                                    />
                                  )}
                                  <Flex
                                    p="20px"
                                    alignItems="center"
                                    borderBottom="1px solid"
                                    borderColor={theme.colors.borderColor}
                                  >
                                    <Box position="relative">
                                      <Avatar
                                        src={member.avatar}
                                        name={member.name}
                                        size="lg"
                                        border="2px solid white"
                                        boxShadow={theme.shadows.sm}
                                      />
                                      {member.isOnline && (
                                        <Box
                                          position="absolute"
                                          bottom="0"
                                          right="0"
                                          w="12px"
                                          h="12px"
                                          borderRadius="full"
                                          bg={theme.colors.primary}
                                          border="2px solid white"
                                        />
                                      )}
                                    </Box>
                                    <Box ml="16px">
                                      <Text
                                        fontWeight="600"
                                        fontSize={theme.fontSizes.md}
                                        color={theme.colors.textColor}
                                      >
                                        {member.name}
                                      </Text>
                                      <Text fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                                        {member.role}
                                      </Text>
                                    </Box>
                                  </Flex>
                                  <Box p="20px">
                                    <Flex alignItems="center" mb="10px">
                                      <Mail size={18} color={theme.colors.textColor} />
                                      <Text ml="10px" fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                                        {member.email}
                                      </Text>
                                    </Flex>
                                    <Flex alignItems="center" mb="10px">
                                      <Briefcase size={18} color={theme.colors.textColor} />
                                      <Text ml="10px" fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                                        {member.department.charAt(0) + member.department.slice(1).toLowerCase()}
                                      </Text>
                                    </Flex>
                                    <Flex alignItems="center">
                                      <Box as={Calendar} size={18} color={theme.colors.textColor} />
                                      <Text ml="10px" fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                                        Joined {member.dateAdded}
                                      </Text>
                                    </Flex>
                                  </Box>
                                  <Box
                                    p="14px 20px"
                                    bg={theme.colors.primaryLighter}
                                    borderTop="1px solid"
                                    borderColor={theme.colors.borderColor}
                                  >
                                    <Flex justifyContent="space-between" alignItems="center">
                                      <Text
                                        fontSize={theme.fontSizes.sm}
                                        fontWeight="500"
                                        color={theme.colors.textColor}
                                      >
                                        {member.projects.length} Projects • {member.tasks.length} Tasks
                                      </Text>
                                      <Badge
                                        colorScheme={member.isOnline ? "green" : "gray"}
                                        bg={member.isOnline ? theme.colors.primary : "gray.200"}
                                        color={member.isOnline ? "white" : "gray.700"}
                                        fontSize={theme.fontSizes.xs}
                                        fontWeight="500"
                                        px="8px"
                                        py="4px"
                                        borderRadius="full"
                                      >
                                        {member.isOnline ? "Online" : "Offline"}
                                      </Badge>
                                    </Flex>
                                  </Box>
                                </Box>
                              ))}
                            </Flex>
                          ) : (
                            <Flex
                              direction="column"
                              alignItems="center"
                              justifyContent="center"
                              py="50px"
                              bg={theme.colors.primaryLighter}
                              borderRadius={theme.borderRadius.md}
                              border="1px dashed"
                              borderColor={theme.colors.primary}
                            >
                              <Users size={56} color={theme.colors.primary} />
                              <Text
                                mt="20px"
                                fontSize={theme.fontSizes.md}
                                fontWeight="600"
                                color={theme.colors.textColor}
                              >
                                No team members found
                              </Text>
                              <Text
                                fontSize={theme.fontSizes.sm}
                                color={theme.colors.textColor}
                                mt="6px"
                                textAlign="center"
                                maxW="400px"
                                lineHeight="1.6"
                              >
                                {searchQuery ? "Try a different search term" : "Invite team members to get started"}
                              </Text>
                              <Button
                                mt="20px"
                                onClick={onInviteOpen}
                                size="md"
                                leftIcon={<UserPlus size={18} />}
                                bg={theme.colors.primary}
                                color="white"
                                _hover={{ bg: theme.colors.primaryHover, transform: "translateY(-2px)" }}
                                boxShadow={theme.shadows.sm}
                                transition={theme.transitions.normal}
                                fontSize={theme.fontSizes.sm}
                                px="20px"
                                py="10px"
                                borderRadius={theme.borderRadius.md}
                              >
                                Invite team member
                              </Button>
                            </Flex>
                          )}
                        </TabPanel>
                      </TabPanels>
                    </Tabs>
                  </>
                ) : (
                  <>
                    {/* Departments View */}
                    <Text fontSize={theme.fontSizes.lg} fontWeight="600" mb="20px" color={theme.colors.textColor}>
                      Departments
                    </Text>
                    <Flex flexWrap="wrap" gap="20px">
                      {departments.map((department) => (
                        <Box
                          key={department.id}
                          w={{ base: "100%", sm: "calc(50% - 10px)", md: "calc(33.33% - 14px)" }}
                          borderRadius={theme.borderRadius.md}
                          border="1px solid"
                          borderColor={theme.colors.borderColor}
                          overflow="hidden"
                          transition={theme.transitions.normal}
                          _hover={{
                            boxShadow: theme.shadows.md,
                            borderColor: theme.colors.primary,
                            transform: "translateY(-4px)",
                          }}
                          cursor="pointer"
                          onClick={() => handleDepartmentClick(department)}
                          bg="white"
                          position="relative"
                        >
                          <Box
                            p="20px"
                            borderBottom="1px solid"
                            borderColor={theme.colors.borderColor}
                            borderLeft={`4px solid ${theme.colors.primary}`}
                          >
                            <Text fontWeight="600" fontSize={theme.fontSizes.md} color={theme.colors.textColor}>
                              {department.name.charAt(0) + department.name.slice(1).toLowerCase()}
                            </Text>
                            <Text
                              fontSize={theme.fontSizes.sm}
                              color={theme.colors.textColor}
                              mt="6px"
                              lineHeight="1.5"
                            >
                              {department.description}
                            </Text>
                          </Box>
                          <Box p="20px">
                            <Flex justifyContent="space-between" mb="12px">
                              <Text fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                                Team Lead:
                              </Text>
                              <Text fontSize={theme.fontSizes.sm} fontWeight="500" color={theme.colors.textColor}>
                                {department.lead}
                              </Text>
                            </Flex>
                            <Flex justifyContent="space-between" mb="12px">
                              <Text fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                                Members:
                              </Text>
                              <Text fontSize={theme.fontSizes.sm} fontWeight="500" color={theme.colors.textColor}>
                                {department.memberCount}
                              </Text>
                            </Flex>
                            <Flex justifyContent="space-between" mb="12px">
                              <Text fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                                Projects:
                              </Text>
                              <Text fontSize={theme.fontSizes.sm} fontWeight="500" color={theme.colors.textColor}>
                                {department.projectCount}
                              </Text>
                            </Flex>
                            <Flex justifyContent="space-between">
                              <Text fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                                Tasks:
                              </Text>
                              <Text fontSize={theme.fontSizes.sm} fontWeight="500" color={theme.colors.textColor}>
                                {department.taskCount}
                              </Text>
                            </Flex>
                          </Box>
                          <Box
                            p="16px 20px"
                            bg={theme.colors.primaryLighter}
                            borderTop="1px solid"
                            borderColor={theme.colors.borderColor}
                          >
                            <Flex justifyContent="space-between" alignItems="center">
                              <AvatarGroup size="sm" max={3}>
                                {teamMembers
                                  .filter((member) => member.department === department.name)
                                  .map((member) => (
                                    <Avatar
                                      key={member.id}
                                      name={member.name}
                                      src={member.avatar}
                                      border="2px solid white"
                                    />
                                  ))}
                              </AvatarGroup>
                              <Button
                                size="sm"
                                colorScheme="green"
                                variant="outline"
                                bg="white"
                                color={theme.colors.primary}
                                borderColor={theme.colors.primary}
                                _hover={{ bg: theme.colors.primaryLighter, transform: "translateY(-2px)" }}
                                fontSize={theme.fontSizes.xs}
                                px="16px"
                                py="8px"
                                borderRadius={theme.borderRadius.md}
                                transition={theme.transitions.normal}
                                boxShadow={theme.shadows.sm}
                              >
                                View Details
                              </Button>
                            </Flex>
                          </Box>
                        </Box>
                      ))}
                    </Flex>
                  </>
                )}
              </Box>
            </Box>

            {/* Right Sidebar */}
            <RightSidebar order={{ base: 1, md: 2 }} />
          </Flex>
        </Box>
      </Flex>

      {/* Invite Member Modal */}
      <Modal isOpen={isInviteOpen} onClose={onInviteClose} isCentered motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent
          bg="white"
          borderRadius={theme.borderRadius.md}
          mx={{ base: "16px", md: "0" }}
          boxShadow={theme.shadows.lg}
          border="1px solid"
          borderColor={theme.colors.borderColor}
          overflow="hidden"
        >
          <ModalHeader
            borderBottom="1px solid"
            borderColor={theme.colors.borderColor}
            py="20px"
            fontSize={theme.fontSizes.lg}
            fontWeight="600"
            color={theme.colors.textColor}
          >
            Invite Team Member
          </ModalHeader>
          <ModalCloseButton color={theme.colors.textColor} />
          <form onSubmit={handleInviteMember}>
            <ModalBody pb={6} pt={4}>
              <FormControl isRequired mb={5}>
                <FormLabel fontWeight="500" fontSize={theme.fontSizes.sm} color={theme.colors.textColor} mb="8px">
                  Name
                </FormLabel>
                <Input
                  name="name"
                  placeholder="Full name"
                  borderColor={theme.colors.borderColorDarker}
                  _focus={{ borderColor: theme.colors.primary, boxShadow: `0 0 0 1px ${theme.colors.primary}` }}
                  _hover={{ borderColor: theme.colors.primary }}
                  fontSize={theme.fontSizes.sm}
                  h="44px"
                  color={theme.colors.textColor}
                  borderRadius={theme.borderRadius.md}
                />
              </FormControl>

              <FormControl mt={4} isRequired mb={5}>
                <FormLabel fontWeight="500" fontSize={theme.fontSizes.sm} color={theme.colors.textColor} mb="8px">
                  Email
                </FormLabel>
                <Input
                  name="email"
                  placeholder="Email address"
                  type="email"
                  borderColor={theme.colors.borderColorDarker}
                  _focus={{ borderColor: theme.colors.primary, boxShadow: `0 0 0 1px ${theme.colors.primary}` }}
                  _hover={{ borderColor: theme.colors.primary }}
                  fontSize={theme.fontSizes.sm}
                  h="44px"
                  color={theme.colors.textColor}
                  borderRadius={theme.borderRadius.md}
                />
              </FormControl>

              <FormControl mt={4} isRequired mb={5}>
                <FormLabel fontWeight="500" fontSize={theme.fontSizes.sm} color={theme.colors.textColor} mb="8px">
                  Role
                </FormLabel>
                <Input
                  name="role"
                  placeholder="Job title or role"
                  borderColor={theme.colors.borderColorDarker}
                  _focus={{ borderColor: theme.colors.primary, boxShadow: `0 0 0 1px ${theme.colors.primary}` }}
                  _hover={{ borderColor: theme.colors.primary }}
                  fontSize={theme.fontSizes.sm}
                  h="44px"
                  color={theme.colors.textColor}
                  borderRadius={theme.borderRadius.md}
                />
              </FormControl>

              <FormControl mt={4} isRequired>
                <FormLabel fontWeight="500" fontSize={theme.fontSizes.sm} color={theme.colors.textColor} mb="8px">
                  Department
                </FormLabel>
                <Select
                  name="department"
                  placeholder="Select department"
                  borderColor={theme.colors.borderColorDarker}
                  _focus={{ borderColor: theme.colors.primary, boxShadow: `0 0 0 1px ${theme.colors.primary}` }}
                  _hover={{ borderColor: theme.colors.primary }}
                  fontSize={theme.fontSizes.sm}
                  h="44px"
                  color={theme.colors.textColor}
                  borderRadius={theme.borderRadius.md}
                >
                  {departments.map((department) => (
                    <option key={department.id} value={department.name}>
                      {department.name.charAt(0) + department.name.slice(1).toLowerCase()}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </ModalBody>

            <ModalFooter borderTop="1px solid" borderColor={theme.colors.borderColor} py="20px" gap="12px">
              <Button
                bg={theme.colors.primary}
                color="white"
                _hover={{ bg: theme.colors.primaryHover, transform: "translateY(-2px)" }}
                mr={3}
                type="submit"
                fontSize={theme.fontSizes.sm}
                fontWeight="600"
                px="20px"
                py="10px"
                h="44px"
                borderRadius={theme.borderRadius.md}
                boxShadow={theme.shadows.sm}
                transition={theme.transitions.normal}
              >
                Send Invitation
              </Button>
              <Button
                onClick={onInviteClose}
                variant="outline"
                color={theme.colors.textColor}
                borderColor={theme.colors.borderColorDarker}
                _hover={{ bg: theme.colors.primaryLighter }}
                fontSize={theme.fontSizes.sm}
                fontWeight="500"
                px="20px"
                py="10px"
                h="44px"
                borderRadius={theme.borderRadius.md}
                transition={theme.transitions.normal}
              >
                Cancel
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* Member Details Modal */}
      <Modal
        isOpen={isMemberDetailsOpen}
        onClose={onMemberDetailsClose}
        size="lg"
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent
          bg="white"
          borderRadius={theme.borderRadius.md}
          mx={{ base: "16px", md: "0" }}
          boxShadow={theme.shadows.lg}
          border="1px solid"
          borderColor={theme.colors.borderColor}
          overflow="hidden"
        >
          <ModalHeader
            borderBottom="1px solid"
            borderColor={theme.colors.borderColor}
            py="20px"
            fontSize={theme.fontSizes.lg}
            fontWeight="600"
            color={theme.colors.textColor}
          >
            Team Member Details
          </ModalHeader>
          <ModalCloseButton color={theme.colors.textColor} />
          <ModalBody pb={6} pt={4}>
            {selectedMember && (
              <>
                <Flex alignItems="center" mb="28px">
                  <Box position="relative">
                    <Avatar
                      src={selectedMember.avatar}
                      name={selectedMember.name}
                      size="xl"
                      border="3px solid white"
                      boxShadow={theme.shadows.md}
                    />
                    {selectedMember.isOnline && (
                      <Box
                        position="absolute"
                        bottom="3px"
                        right="3px"
                        w="16px"
                        h="16px"
                        borderRadius="full"
                        bg={theme.colors.primary}
                        border="3px solid white"
                      />
                    )}
                  </Box>
                  <Box ml="20px">
                    <Heading
                      size="md"
                      fontSize={theme.fontSizes.xl}
                      fontWeight="700"
                      color={theme.colors.textColor}
                      mb="4px"
                    >
                      {selectedMember.name}
                    </Heading>
                    <Text color={theme.colors.textColor} fontSize={theme.fontSizes.md}>
                      {selectedMember.role}
                    </Text>
                    <Badge
                      colorScheme={selectedMember.isOnline ? "green" : "gray"}
                      bg={selectedMember.isOnline ? theme.colors.primary : "gray.200"}
                      color={selectedMember.isOnline ? "white" : "gray.700"}
                      mt="8px"
                      fontSize={theme.fontSizes.xs}
                      fontWeight="500"
                      px="8px"
                      py="4px"
                      borderRadius="full"
                    >
                      {selectedMember.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </Box>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<MoreVertical size={18} />}
                      variant="ghost"
                      ml="auto"
                      _hover={{ bg: theme.colors.primaryLighter }}
                      color={theme.colors.textColor}
                    />
                    <MenuList
                      boxShadow={theme.shadows.lg}
                      border="1px solid"
                      borderColor={theme.colors.borderColor}
                      borderRadius={theme.borderRadius.md}
                      py="8px"
                    >
                      <MenuItem
                        icon={<Mail size={16} />}
                        fontSize={theme.fontSizes.sm}
                        color={theme.colors.textColor}
                        _hover={{ bg: theme.colors.primaryLighter }}
                      >
                        Send Email
                      </MenuItem>
                      <MenuItem
                        icon={<MessageSquare size={16} />}
                        fontSize={theme.fontSizes.sm}
                        color={theme.colors.textColor}
                        _hover={{ bg: theme.colors.primaryLighter }}
                      >
                        Send Message
                      </MenuItem>
                      <MenuItem
                        icon={<Phone size={16} />}
                        fontSize={theme.fontSizes.sm}
                        color={theme.colors.textColor}
                        _hover={{ bg: theme.colors.primaryLighter }}
                      >
                        Call
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>

                <Box
                  mb="28px"
                  p="20px"
                  bg={theme.colors.primaryLighter}
                  borderRadius={theme.borderRadius.md}
                  borderLeft={`4px solid ${theme.colors.primary}`}
                >
                  <Heading
                    size="sm"
                    mb="16px"
                    fontSize={theme.fontSizes.md}
                    fontWeight="600"
                    color={theme.colors.textColor}
                  >
                    Contact Information
                  </Heading>
                  <Flex alignItems="center" mb="12px">
                    <Mail size={18} color={theme.colors.textColor} />
                    <Text ml="12px" fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                      {selectedMember.email}
                    </Text>
                  </Flex>
                  {selectedMember.phone && (
                    <Flex alignItems="center" mb="12px">
                      <Phone size={18} color={theme.colors.textColor} />
                      <Text ml="12px" fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                        {selectedMember.phone}
                      </Text>
                    </Flex>
                  )}
                  <Flex alignItems="center">
                    <Briefcase size={18} color={theme.colors.textColor} />
                    <Text ml="12px" fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                      {selectedMember.department.charAt(0) + selectedMember.department.slice(1).toLowerCase()}
                    </Text>
                  </Flex>
                </Box>

                <Flex mt="20px" gap="12px">
                  <Button
                    leftIcon={<Mail size={18} />}
                    flex="1"
                    size="md"
                    bg={theme.colors.primary}
                    color="white"
                    _hover={{ bg: theme.colors.primaryHover, transform: "translateY(-2px)" }}
                    fontSize={theme.fontSizes.sm}
                    fontWeight="500"
                    px="16px"
                    py="10px"
                    h="44px"
                    borderRadius={theme.borderRadius.md}
                    boxShadow={theme.shadows.sm}
                    transition={theme.transitions.normal}
                  >
                    Email
                  </Button>
                  <Button
                    leftIcon={<MessageSquare size={18} />}
                    flex="1"
                    size="md"
                    bg="white"
                    color={theme.colors.textColor}
                    borderColor={theme.colors.primary}
                    border="1px solid"
                    _hover={{ bg: theme.colors.primaryLighter, transform: "translateY(-2px)" }}
                    fontSize={theme.fontSizes.sm}
                    fontWeight="500"
                    px="16px"
                    py="10px"
                    h="44px"
                    borderRadius={theme.borderRadius.md}
                    transition={theme.transitions.normal}
                  >
                    Message
                  </Button>
                  <Button
                    leftIcon={<Phone size={18} />}
                    flex="1"
                    size="md"
                    bg="white"
                    color={theme.colors.textColor}
                    borderColor={theme.colors.borderColorDarker}
                    border="1px solid"
                    _hover={{ bg: theme.colors.primaryLighter, transform: "translateY(-2px)" }}
                    fontSize={theme.fontSizes.sm}
                    fontWeight="500"
                    px="16px"
                    py="10px"
                    h="44px"
                    borderRadius={theme.borderRadius.md}
                    transition={theme.transitions.normal}
                  >
                    Call
                  </Button>
                </Flex>

                <Divider my="24px" borderColor={theme.colors.borderColor} />

                <Box mb="28px">
                  <Heading
                    size="sm"
                    mb="16px"
                    fontSize={theme.fontSizes.md}
                    fontWeight="600"
                    color={theme.colors.textColor}
                  >
                    Projects
                  </Heading>
                  {selectedMember.projects.length > 0 ? (
                    <Table
                      variant="simple"
                      size="sm"
                      borderRadius={theme.borderRadius.md}
                      overflow="hidden"
                      border="1px solid"
                      borderColor={theme.colors.borderColor}
                    >
                      <Thead bg={theme.colors.primaryLighter}>
                        <Tr>
                          <Th color={theme.colors.textColor} fontSize={theme.fontSizes.xs} fontWeight="600" py="12px">
                            Project Name
                          </Th>
                          <Th color={theme.colors.textColor} fontSize={theme.fontSizes.xs} fontWeight="600" py="12px">
                            Status
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {getMemberProjects(selectedMember.projects).map((project, index) => (
                          <Tr key={index} _hover={{ bg: theme.colors.primaryLighter }}>
                            <Td
                              fontSize={theme.fontSizes.sm}
                              color={theme.colors.textColor}
                              py="12px"
                              borderColor={theme.colors.borderColor}
                            >
                              {project.buttonText}
                            </Td>
                            <Td
                              fontSize={theme.fontSizes.sm}
                              color={theme.colors.textColor}
                              py="12px"
                              borderColor={theme.colors.borderColor}
                            >
                              <Badge
                                colorScheme={
                                  project.status === "todo"
                                    ? "gray"
                                    : project.status === "inprogress"
                                      ? "orange"
                                      : "green"
                                }
                                bg={
                                  project.status === "todo"
                                    ? "gray.200"
                                    : project.status === "inprogress"
                                      ? "orange.100"
                                      : theme.colors.primaryLighter
                                }
                                color={
                                  project.status === "todo"
                                    ? "gray.700"
                                    : project.status === "inprogress"
                                      ? "orange.700"
                                      : theme.colors.primary
                                }
                                fontSize={theme.fontSizes.xs}
                                fontWeight="500"
                                px="8px"
                                py="4px"
                                borderRadius="full"
                              >
                                {project.status === "todo"
                                  ? "To Do"
                                  : project.status === "inprogress"
                                    ? "In Progress"
                                    : "Finished"}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text
                      color={theme.colors.textColor}
                      fontSize={theme.fontSizes.sm}
                      p="16px"
                      bg={theme.colors.primaryLighter}
                      borderRadius={theme.borderRadius.md}
                      textAlign="center"
                    >
                      No projects assigned
                    </Text>
                  )}
                </Box>

                <Box>
                  <Heading
                    size="sm"
                    mb="16px"
                    fontSize={theme.fontSizes.md}
                    fontWeight="600"
                    color={theme.colors.textColor}
                  >
                    Tasks
                  </Heading>
                  {selectedMember.tasks.length > 0 ? (
                    <Table
                      variant="simple"
                      size="sm"
                      borderRadius={theme.borderRadius.md}
                      overflow="hidden"
                      border="1px solid"
                      borderColor={theme.colors.borderColor}
                    >
                      <Thead bg={theme.colors.primaryLighter}>
                        <Tr>
                          <Th color={theme.colors.textColor} fontSize={theme.fontSizes.xs} fontWeight="600" py="12px">
                            Task Name
                          </Th>
                          <Th color={theme.colors.textColor} fontSize={theme.fontSizes.xs} fontWeight="600" py="12px">
                            Status
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {getMemberTasks(selectedMember.tasks).map((task, index) => (
                          <Tr key={index} _hover={{ bg: theme.colors.primaryLighter }}>
                            <Td
                              fontSize={theme.fontSizes.sm}
                              color={theme.colors.textColor}
                              py="12px"
                              borderColor={theme.colors.borderColor}
                            >
                              {task.taskName}
                            </Td>
                            <Td
                              fontSize={theme.fontSizes.sm}
                              color={theme.colors.textColor}
                              py="12px"
                              borderColor={theme.colors.borderColor}
                            >
                              <Badge
                                colorScheme={
                                  task.status === "todo" ? "gray" : task.status === "inprogress" ? "orange" : "green"
                                }
                                bg={
                                  task.status === "todo"
                                    ? "gray.200"
                                    : task.status === "inprogress"
                                      ? "orange.100"
                                      : theme.colors.primaryLighter
                                }
                                color={
                                  task.status === "todo"
                                    ? "gray.700"
                                    : task.status === "inprogress"
                                      ? "orange.700"
                                      : theme.colors.primary
                                }
                                fontSize={theme.fontSizes.xs}
                                fontWeight="500"
                                px="8px"
                                py="4px"
                                borderRadius="full"
                              >
                                {task.status === "todo"
                                  ? "To Do"
                                  : task.status === "inprogress"
                                    ? "In Progress"
                                    : "Finished"}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  ) : (
                    <Text
                      color={theme.colors.textColor}
                      fontSize={theme.fontSizes.sm}
                      p="16px"
                      bg={theme.colors.primaryLighter}
                      borderRadius={theme.borderRadius.md}
                      textAlign="center"
                    >
                      No tasks assigned
                    </Text>
                  )}
                </Box>

                <Box mt="28px">
                  <Heading
                    size="sm"
                    mb="16px"
                    fontSize={theme.fontSizes.md}
                    fontWeight="600"
                    color={theme.colors.textColor}
                  >
                    Recent Activity
                  </Heading>
                  <Box
                    p="16px"
                    bg={theme.colors.primaryLighter}
                    borderRadius={theme.borderRadius.md}
                    borderLeft={`4px solid ${theme.colors.primary}`}
                  >
                    <Flex alignItems="center" mb="12px">
                      <Box
                        w="10px"
                        h="10px"
                        borderRadius="full"
                        bg={theme.colors.primary}
                        mr="12px"
                        boxShadow={theme.shadows.sm}
                      />
                      <Text fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                        Completed task "Create API documentation" - 2 days ago
                      </Text>
                    </Flex>
                    <Flex alignItems="center" mb="12px">
                      <Box w="10px" h="10px" borderRadius="full" bg="#FFA500" mr="12px" boxShadow={theme.shadows.sm} />
                      <Text fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                        Started working on "Design user interface" - 3 days ago
                      </Text>
                    </Flex>
                    <Flex alignItems="center">
                      <Box
                        w="10px"
                        h="10px"
                        borderRadius="full"
                        bg={theme.colors.primary}
                        mr="12px"
                        boxShadow={theme.shadows.sm}
                      />
                      <Text fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                        Joined project "Peak and Dale HRMS" - 1 week ago
                      </Text>
                    </Flex>
                  </Box>
                </Box>
              </>
            )}
          </ModalBody>
          <ModalFooter borderTop="1px solid" borderColor={theme.colors.borderColor} py="20px">
            <Button
              bg={theme.colors.primary}
              color="white"
              _hover={{ bg: theme.colors.primaryHover, transform: "translateY(-2px)" }}
              mr={3}
              onClick={onMemberDetailsClose}
              fontSize={theme.fontSizes.sm}
              fontWeight="600"
              px="20px"
              py="10px"
              h="44px"
              borderRadius={theme.borderRadius.md}
              boxShadow={theme.shadows.sm}
              transition={theme.transitions.normal}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Department Details Modal */}
      <Modal
        isOpen={isDepartmentDetailsOpen}
        onClose={onDepartmentDetailsClose}
        size="lg"
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent
          bg="white"
          borderRadius={theme.borderRadius.md}
          mx={{ base: "16px", md: "0" }}
          boxShadow={theme.shadows.lg}
          border="1px solid"
          borderColor={theme.colors.borderColor}
          overflow="hidden"
        >
          <ModalHeader
            borderBottom="1px solid"
            borderColor={theme.colors.borderColor}
            py="20px"
            fontSize={theme.fontSizes.lg}
            fontWeight="600"
            color={theme.colors.textColor}
          >
            Department Details
          </ModalHeader>
          <ModalCloseButton color={theme.colors.textColor} />
          <ModalBody pb={6} pt={4}>
            {selectedDepartment && (
              <>
                <Heading
                  size="md"
                  mb="10px"
                  fontSize={theme.fontSizes.xl}
                  fontWeight="700"
                  color={theme.colors.textColor}
                >
                  {selectedDepartment.name.charAt(0) + selectedDepartment.name.slice(1).toLowerCase()}
                </Heading>
                <Text color={theme.colors.textColor} mb="20px" fontSize={theme.fontSizes.sm} lineHeight="1.6">
                  {selectedDepartment.description}
                </Text>

                <Flex
                  mb="20px"
                  p="20px"
                  bg={theme.colors.primaryLighter}
                  borderRadius={theme.borderRadius.md}
                  borderLeft={`4px solid ${theme.colors.primary}`}
                  boxShadow={theme.shadows.sm}
                >
                  <Box flex="1">
                    <Text fontWeight="600" fontSize={theme.fontSizes.sm} color={theme.colors.textColor} mb="6px">
                      Team Lead
                    </Text>
                    <Text fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                      {selectedDepartment.lead}
                    </Text>
                  </Box>
                  <Box flex="1">
                    <Text fontWeight="600" fontSize={theme.fontSizes.sm} color={theme.colors.textColor} mb="6px">
                      Members
                    </Text>
                    <Text fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                      {selectedDepartment.memberCount}
                    </Text>
                  </Box>
                  <Box flex="1">
                    <Text fontWeight="600" fontSize={theme.fontSizes.sm} color={theme.colors.textColor} mb="6px">
                      Projects
                    </Text>
                    <Text fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                      {selectedDepartment.projectCount}
                    </Text>
                  </Box>
                  <Box flex="1">
                    <Text fontWeight="600" fontSize={theme.fontSizes.sm} color={theme.colors.textColor} mb="6px">
                      Tasks
                    </Text>
                    <Text fontSize={theme.fontSizes.sm} color={theme.colors.textColor}>
                      {selectedDepartment.taskCount}
                    </Text>
                  </Box>
                </Flex>

                <Divider my="24px" borderColor={theme.colors.borderColor} />

                <Box mb="28px">
                  <Heading
                    size="sm"
                    mb="16px"
                    fontSize={theme.fontSizes.md}
                    fontWeight="600"
                    color={theme.colors.textColor}
                  >
                    Team Members
                  </Heading>
                  <Table
                    variant="simple"
                    size="sm"
                    borderRadius={theme.borderRadius.md}
                    overflow="hidden"
                    border="1px solid"
                    borderColor={theme.colors.borderColor}
                  >
                    <Thead bg={theme.colors.primaryLighter}>
                      <Tr>
                        <Th color={theme.colors.textColor} fontSize={theme.fontSizes.xs} fontWeight="600" py="12px">
                          Name
                        </Th>
                        <Th color={theme.colors.textColor} fontSize={theme.fontSizes.xs} fontWeight="600" py="12px">
                          Role
                        </Th>
                        <Th color={theme.colors.textColor} fontSize={theme.fontSizes.xs} fontWeight="600" py="12px">
                          Status
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {teamMembers
                        .filter((member) => member.department === selectedDepartment.name)
                        .map((member) => (
                          <Tr key={member.id} _hover={{ bg: theme.colors.primaryLighter }}>
                            <Td
                              fontSize={theme.fontSizes.sm}
                              color={theme.colors.textColor}
                              py="12px"
                              borderColor={theme.colors.borderColor}
                            >
                              <Flex alignItems="center">
                                <Avatar
                                  size="sm"
                                  name={member.name}
                                  src={member.avatar}
                                  mr="10px"
                                  border="2px solid white"
                                  boxShadow={theme.shadows.sm}
                                />
                                {member.name}
                              </Flex>
                            </Td>
                            <Td
                              fontSize={theme.fontSizes.sm}
                              color={theme.colors.textColor}
                              py="12px"
                              borderColor={theme.colors.borderColor}
                            >
                              {member.role}
                            </Td>
                            <Td
                              fontSize={theme.fontSizes.sm}
                              color={theme.colors.textColor}
                              py="12px"
                              borderColor={theme.colors.borderColor}
                            >
                              <Badge
                                colorScheme={member.isOnline ? "green" : "gray"}
                                bg={member.isOnline ? theme.colors.primary : "gray.200"}
                                color={member.isOnline ? "white" : "gray.700"}
                                fontSize={theme.fontSizes.xs}
                                fontWeight="500"
                                px="8px"
                                py="4px"
                                borderRadius="full"
                              >
                                {member.isOnline ? "Online" : "Offline"}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                    </Tbody>
                  </Table>
                </Box>

                <Box mt="24px">
                  <Heading
                    size="sm"
                    mb="16px"
                    fontSize={theme.fontSizes.md}
                    fontWeight="600"
                    color={theme.colors.textColor}
                  >
                    Team Skills
                  </Heading>
                  <Flex flexWrap="wrap" gap="10px">
                    <Badge
                      px="10px"
                      py="6px"
                      borderRadius="full"
                      colorScheme="blue"
                      fontSize={theme.fontSizes.xs}
                      fontWeight="500"
                      boxShadow={theme.shadows.sm}
                    >
                      JavaScript
                    </Badge>
                    <Badge
                      px="10px"
                      py="6px"
                      borderRadius="full"
                      colorScheme="green"
                      fontSize={theme.fontSizes.xs}
                      fontWeight="500"
                      boxShadow={theme.shadows.sm}
                    >
                      React
                    </Badge>
                    <Badge
                      px="10px"
                      py="6px"
                      borderRadius="full"
                      colorScheme="purple"
                      fontSize={theme.fontSizes.xs}
                      fontWeight="500"
                      boxShadow={theme.shadows.sm}
                    >
                      UI/UX Design
                    </Badge>
                    <Badge
                      px="10px"
                      py="6px"
                      borderRadius="full"
                      colorScheme="orange"
                      fontSize={theme.fontSizes.xs}
                      fontWeight="500"
                      boxShadow={theme.shadows.sm}
                    >
                      Project Management
                    </Badge>
                    <Badge
                      px="10px"
                      py="6px"
                      borderRadius="full"
                      colorScheme="cyan"
                      fontSize={theme.fontSizes.xs}
                      fontWeight="500"
                      boxShadow={theme.shadows.sm}
                    >
                      API Development
                    </Badge>
                    <Badge
                      px="10px"
                      py="6px"
                      borderRadius="full"
                      colorScheme="pink"
                      fontSize={theme.fontSizes.xs}
                      fontWeight="500"
                      boxShadow={theme.shadows.sm}
                    >
                      Database Design
                    </Badge>
                    <Badge
                      px="10px"
                      py="6px"
                      borderRadius="full"
                      colorScheme="yellow"
                      fontSize={theme.fontSizes.xs}
                      fontWeight="500"
                      boxShadow={theme.shadows.sm}
                    >
                      Mobile Development
                    </Badge>
                    <Badge
                      px="10px"
                      py="6px"
                      borderRadius="full"
                      colorScheme="teal"
                      fontSize={theme.fontSizes.xs}
                      fontWeight="500"
                      boxShadow={theme.shadows.sm}
                    >
                      DevOps
                    </Badge>
                  </Flex>
                </Box>

                <Divider my="24px" borderColor={theme.colors.borderColor} />

                <Box mb="28px">
                  <Heading
                    size="sm"
                    mb="16px"
                    fontSize={theme.fontSizes.md}
                    fontWeight="600"
                    color={theme.colors.textColor}
                  >
                    Projects
                  </Heading>
                  <Table
                    variant="simple"
                    size="sm"
                    borderRadius={theme.borderRadius.md}
                    overflow="hidden"
                    border="1px solid"
                    borderColor={theme.colors.borderColor}
                  >
                    <Thead bg={theme.colors.primaryLighter}>
                      <Tr>
                        <Th color={theme.colors.textColor} fontSize={theme.fontSizes.xs} fontWeight="600" py="12px">
                          Project Name
                        </Th>
                        <Th color={theme.colors.textColor} fontSize={theme.fontSizes.xs} fontWeight="600" py="12px">
                          Status
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {getDepartmentProjects(selectedDepartment.name).map((project, index) => (
                        <Tr key={index} _hover={{ bg: theme.colors.primaryLighter }}>
                          <Td
                            fontSize={theme.fontSizes.sm}
                            color={theme.colors.textColor}
                            py="12px"
                            borderColor={theme.colors.borderColor}
                          >
                            {project.buttonText}
                          </Td>
                          <Td
                            fontSize={theme.fontSizes.sm}
                            color={theme.colors.textColor}
                            py="12px"
                            borderColor={theme.colors.borderColor}
                          >
                            <Badge
                              colorScheme={
                                project.status === "todo"
                                  ? "gray"
                                  : project.status === "inprogress"
                                    ? "orange"
                                    : "green"
                              }
                              bg={
                                project.status === "todo"
                                  ? "gray.200"
                                  : project.status === "inprogress"
                                    ? "orange.100"
                                    : theme.colors.primaryLighter
                              }
                              color={
                                project.status === "todo"
                                  ? "gray.700"
                                  : project.status === "inprogress"
                                    ? "orange.700"
                                    : theme.colors.primary
                              }
                              fontSize={theme.fontSizes.xs}
                              fontWeight="500"
                              px="8px"
                              py="4px"
                              borderRadius="full"
                            >
                              {project.status === "todo"
                                ? "To Do"
                                : project.status === "inprogress"
                                  ? "In Progress"
                                  : "Finished"}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>

                <Box>
                  <Heading
                    size="sm"
                    mb="16px"
                    fontSize={theme.fontSizes.md}
                    fontWeight="600"
                    color={theme.colors.textColor}
                  >
                    Tasks
                  </Heading>
                  <Table
                    variant="simple"
                    size="sm"
                    borderRadius={theme.borderRadius.md}
                    overflow="hidden"
                    border="1px solid"
                    borderColor={theme.colors.borderColor}
                  >
                    <Thead bg={theme.colors.primaryLighter}>
                      <Tr>
                        <Th color={theme.colors.textColor} fontSize={theme.fontSizes.xs} fontWeight="600" py="12px">
                          Task Name
                        </Th>
                        <Th color={theme.colors.textColor} fontSize={theme.fontSizes.xs} fontWeight="600" py="12px">
                          Status
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {getDepartmentTasks(selectedDepartment.name).map((task, index) => (
                        <Tr key={index} _hover={{ bg: theme.colors.primaryLighter }}>
                          <Td
                            fontSize={theme.fontSizes.sm}
                            color={theme.colors.textColor}
                            py="12px"
                            borderColor={theme.colors.borderColor}
                          >
                            {task.taskName}
                          </Td>
                          <Td
                            fontSize={theme.fontSizes.sm}
                            color={theme.colors.textColor}
                            py="12px"
                            borderColor={theme.colors.borderColor}
                          >
                            <Badge
                              colorScheme={
                                task.status === "todo" ? "gray" : task.status === "inprogress" ? "orange" : "green"
                              }
                              bg={
                                task.status === "todo"
                                  ? "gray.200"
                                  : task.status === "inprogress"
                                    ? "orange.100"
                                    : theme.colors.primaryLighter
                              }
                              color={
                                task.status === "todo"
                                  ? "gray.700"
                                  : task.status === "inprogress"
                                    ? "orange.700"
                                    : theme.colors.primary
                              }
                              fontSize={theme.fontSizes.xs}
                              fontWeight="500"
                              px="8px"
                              py="4px"
                              borderRadius="full"
                            >
                              {task.status === "todo"
                                ? "To Do"
                                : task.status === "inprogress"
                                  ? "In Progress"
                                  : "Finished"}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </>
            )}
          </ModalBody>
          <ModalFooter borderTop="1px solid" borderColor={theme.colors.borderColor} py="20px">
            <Button
              bg={theme.colors.primary}
              color="white"
              _hover={{ bg: theme.colors.primaryHover, transform: "translateY(-2px)" }}
              mr={3}
              onClick={onDepartmentDetailsClose}
              fontSize={theme.fontSizes.sm}
              fontWeight="600"
              px="20px"
              py="10px"
              h="44px"
              borderRadius={theme.borderRadius.md}
              boxShadow={theme.shadows.sm}
              transition={theme.transitions.normal}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
