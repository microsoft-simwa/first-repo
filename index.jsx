"use client"

import { useState, useEffect, useRef } from "react"
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
    InputGroup,
    InputLeftElement,
    Input,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Grid,
    GridItem,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Progress,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Select,
    FormControl,
    FormLabel,
    useToast,
    Divider,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Stack,
    StackDivider,
    Checkbox,
    Radio,
    RadioGroup,
} from "@chakra-ui/react"
import { Calendar, Clock, ChevronDown, Search, Download, FileText, BarChart2, PieChart, TrendingUp, Users, Briefcase, CheckCircle, ClockIcon, AlertCircle, Filter, Share2, Printer, Mail, MoreVertical, ArrowUpRight, ArrowDownRight, FileSpreadsheet, FileIcon as FilePdf, Trash2} from 'lucide-react'
import { Chart } from "react-google-charts"

// Initialize localStorage if it doesn't exist
const initializeLocalStorage = () => {
    if (typeof window !== "undefined") {
        // No need to initialize anything for reports as we'll use existing data
    }
}

// Custom checkbox component
const CustomCheckbox = ({ isChecked, onChange }) => {
    return (
        <Box
            onClick={onChange}
            position="relative"
            width="20px"
            height="20px"
            borderRadius="4px"
            border="2px solid"
            borderColor={isChecked ? "#81BE41" : "gray.300"}
            bg={isChecked ? "#81BE41" : "white"}
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            transition="all 0.2s"
            mr="10px"
        >
            {isChecked && <CheckCircle size={14} color="white" />}
        </Box>
    )
}

// Dropdown options
const dropDownOptions = [
    { label: "Today", value: "today" },
    { label: "This Week", value: "this-week" },
    { label: "This Month", value: "this-month" },
    { label: "This Quarter", value: "this-quarter" },
    { label: "This Year", value: "this-year" },
    { label: "Custom Range", value: "custom" },
]

export default function ReportsPage() {
    // State variables
    const [userDepartment, setUserDepartment] = useState("SOFTWARE DEVELOPMENT") // Default department for the current user
    const [projects, setProjects] = useState([])
    const [tasks, setTasks] = useState([])
    const [files, setFiles] = useState([])
    const [teamMembers, setTeamMembers] = useState([])
    const [departments, setDepartments] = useState([])
    const [dateRange, setDateRange] = useState("this-month")
    const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false)
    const [selectedDepartments, setSelectedDepartments] = useState([])
    const [selectedProjects, setSelectedProjects] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [filteredProjects, setFilteredProjects] = useState([])
    const [filteredTasks, setFilteredTasks] = useState([])
    const [reportType, setReportType] = useState("overview") // overview, projects, tasks, team, files
    const [generatedReports, setGeneratedReports] = useState([])
    const [isGeneratingReport, setIsGeneratingReport] = useState(false)
    const [reportFormat, setReportFormat] = useState("pdf")
    const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" })
    const [reportData, setReportData] = useState(null)

    // Modal states
    const { isOpen: isGenerateReportOpen, onOpen: onGenerateReportOpen, onClose: onGenerateReportClose } = useDisclosure()
    const { isOpen: isReportDetailsOpen, onOpen: onReportDetailsOpen, onClose: onReportDetailsClose } = useDisclosure()
    const [selectedReport, setSelectedReport] = useState(null)

    // Toast for notifications
    const toast = useToast()

    // Responsive variables
    const mainContentWidth = useBreakpointValue({ base: "100%", md: "69%" })
    const chartRef = useRef(null)

    // Initialize localStorage on component mount
    useEffect(() => {
        initializeLocalStorage()

        // Load data from localStorage
        if (typeof window !== "undefined") {
            // Load projects
            const projectsData = localStorage.getItem("projectsData")
            if (projectsData) {
                const parsedProjects = JSON.parse(projectsData)
                setProjects(parsedProjects)

                // Filter projects based on user's department
                const departmentProjects = parsedProjects.filter((project) => project.department === userDepartment)
                setFilteredProjects(departmentProjects)
            }

            // Load tasks
            const tasksData = localStorage.getItem("tasksData")
            if (tasksData) {
                const parsedTasks = JSON.parse(tasksData)
                setTasks(parsedTasks)

                // Filter tasks based on user's department
                const departmentTasks = parsedTasks.filter((task) => task.department === userDepartment)
                setFilteredTasks(departmentTasks)
            }

            // Load files
            const filesData = localStorage.getItem("filesData")
            if (filesData) {
                const parsedFiles = JSON.parse(filesData)
                setFiles(parsedFiles.filter((file) => file.department === userDepartment))
            }

            // Load team members
            const teamMembersData = localStorage.getItem("teamMembersData")
            if (teamMembersData) {
                const parsedTeamMembers = JSON.parse(teamMembersData)
                setTeamMembers(parsedTeamMembers.filter((member) => member.department === userDepartment))
            }

            // Load departments
            const departmentsData = localStorage.getItem("departmentsData")
            if (departmentsData) {
                setDepartments(JSON.parse(departmentsData))
            }

            // Load previously generated reports
            const reportsData = localStorage.getItem("generatedReports")
            if (reportsData) {
                setGeneratedReports(JSON.parse(reportsData))
            } else {
                // Initialize with sample reports if none exist
                const sampleReports = [
                    {
                        id: 1,
                        name: "Monthly Project Status Report",
                        type: "projects",
                        format: "pdf",
                        dateGenerated: "May 10, 2024",
                        department: "SOFTWARE DEVELOPMENT",
                        dateRange: "this-month",
                        size: "1.2 MB",
                        downloadUrl: "#",
                    },
                    {
                        id: 2,
                        name: "Team Performance Report",
                        type: "team",
                        format: "xlsx",
                        dateGenerated: "May 5, 2024",
                        department: "SOFTWARE DEVELOPMENT",
                        dateRange: "this-month",
                        size: "0.8 MB",
                        downloadUrl: "#",
                    },
                    {
                        id: 3,
                        name: "Task Completion Analysis",
                        type: "tasks",
                        format: "pdf",
                        dateGenerated: "April 28, 2024",
                        department: "SOFTWARE DEVELOPMENT",
                        dateRange: "this-month",
                        size: "1.5 MB",
                        downloadUrl: "#",
                    },
                ]
                setGeneratedReports(sampleReports)
                localStorage.setItem("generatedReports", JSON.stringify(sampleReports))
            }
        }
    }, [userDepartment])

    // Handle search input change
    const handleSearchChange = (e) => {
        const query = e.target.value.toLowerCase()
        setSearchQuery(query)

        if (query === "") {
            // If search is cleared, show projects from user's department
            const departmentProjects = projects.filter((project) => project.department === userDepartment)
            setFilteredProjects(departmentProjects)

            // Filter tasks based on user's department
            const departmentTasks = tasks.filter((task) => task.department === userDepartment)
            setFilteredTasks(departmentTasks)
        } else {
            // Filter projects based on search query
            const filteredProjects = projects.filter(
                (project) =>
                    project.department === userDepartment &&
                    (project.buttonText.toLowerCase().includes(query) ||
                        project.descriptionText.toLowerCase().includes(query))
            )
            setFilteredProjects(filteredProjects)

            // Filter tasks based on search query
            const filteredTasks = tasks.filter(
                (task) =>
                    task.department === userDepartment &&
                    (task.taskName.toLowerCase().includes(query) ||
                        task.projectTitle.toLowerCase().includes(query))
            )
            setFilteredTasks(filteredTasks)
        }
    }

    // Handle department selection for filtering
    const handleDepartmentSelection = (department) => {
        if (department === "ALL DEPARTMENTS") {
            setSelectedDepartments([])
        } else {
            // Toggle the selected department
            const newSelection = [...selectedDepartments]

            if (newSelection.includes(department)) {
                setSelectedDepartments(newSelection.filter((dep) => dep !== department))
            } else {
                setSelectedDepartments([...newSelection, department])
            }
        }
    }

    // Handle project selection for filtering
    const handleProjectSelection = (project) => {
        if (project === "ALL PROJECTS") {
            setSelectedProjects([])
        } else {
            // Toggle the selected project
            const newSelection = [...selectedProjects]

            if (newSelection.includes(project)) {
                setSelectedProjects(newSelection.filter((proj) => proj !== project))
            } else {
                setSelectedProjects([...newSelection, project])
            }
        }
    }

    // Handle date range change
    const handleDateRangeChange = (range) => {
        setDateRange(range)
    }

    // Generate report
    const handleGenerateReport = () => {
        setIsGeneratingReport(true)

        // Simulate report generation
        setTimeout(() => {
            const newReport = {
                id: generatedReports.length + 1,
                name: getReportName(),
                type: reportType,
                format: reportFormat,
                dateGenerated: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
                department: userDepartment,
                dateRange: dateRange,
                size: getReportSize(),
                downloadUrl: "#",
            }

            const updatedReports = [newReport, ...generatedReports]
            setGeneratedReports(updatedReports)
            localStorage.setItem("generatedReports", JSON.stringify(updatedReports))

            setIsGeneratingReport(false)
            onGenerateReportClose()

            toast({
                title: "Report generated",
                description: `${newReport.name} has been generated successfully.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            })

            // Set the newly generated report as selected and open details
            setSelectedReport(newReport)
            setReportData(generateReportData(newReport))
            onReportDetailsOpen()
        }, 2000)
    }

    // Get report name based on selected options
    const getReportName = () => {
        const dateRangeText = dateRange === "this-month" ? "Monthly" : dateRange === "this-week" ? "Weekly" : "Custom"

        switch (reportType) {
            case "overview":
                return `${dateRangeText} Department Overview Report`
            case "projects":
                return `${dateRangeText} Project Status Report`
            case "tasks":
                return `${dateRangeText} Task Completion Analysis`
            case "team":
                return `${dateRangeText} Team Performance Report`
            case "files":
                return `${dateRangeText} Document Activity Report`
            default:
                return `${dateRangeText} Report`
        }
    }

    // Get report size (simulated)
    const getReportSize = () => {
        const sizes = ["0.8 MB", "1.2 MB", "1.5 MB", "2.1 MB", "1.7 MB"]
        return sizes[Math.floor(Math.random() * sizes.length)]
    }

    // Handle report download
    const handleReportDownload = (report) => {
        toast({
            title: "Download started",
            description: `Downloading ${report.name}`,
            status: "info",
            duration: 3000,
            isClosable: true,
        })
    }

    // Handle report share
    const handleReportShare = (report) => {
        toast({
            title: "Share report",
            description: `Sharing options for ${report.name}`,
            status: "info",
            duration: 3000,
            isClosable: true,
        })
    }

    // Handle report print
    const handleReportPrint = (report) => {
        toast({
            title: "Print report",
            description: `Preparing ${report.name} for printing`,
            status: "info",
            duration: 3000,
            isClosable: true,
        })
    }

    // Handle report email
    const handleReportEmail = (report) => {
        toast({
            title: "Email report",
            description: `Preparing to email ${report.name}`,
            status: "info",
            duration: 3000,
            isClosable: true,
        })
    }

    // Handle report delete
    const handleReportDelete = (report) => {
        const updatedReports = generatedReports.filter((r) => r.id !== report.id)
        setGeneratedReports(updatedReports)
        localStorage.setItem("generatedReports", JSON.stringify(updatedReports))

        toast({
            title: "Report deleted",
            description: `${report.name} has been deleted`,
            status: "success",
            duration: 3000,
            isClosable: true,
        })

        if (selectedReport && selectedReport.id === report.id) {
            onReportDetailsClose()
        }
    }

    // Handle report details view
    const handleViewReportDetails = (report) => {
        setSelectedReport(report)
        setReportData(generateReportData(report))
        onReportDetailsOpen()
    }

    // Generate report data based on report type
    const generateReportData = (report) => {
        switch (report.type) {
            case "overview":
                return generateOverviewReportData()
            case "projects":
                return generateProjectsReportData()
            case "tasks":
                return generateTasksReportData()
            case "team":
                return generateTeamReportData()
            case "files":
                return generateFilesReportData()
            default:
                return generateOverviewReportData()
        }
    }

    // Generate overview report data
    const generateOverviewReportData = () => {
        const departmentProjects = projects.filter((project) => project.department === userDepartment)
        const departmentTasks = tasks.filter((task) => task.department === userDepartment)

        const todoProjects = departmentProjects.filter((project) => project.status === "todo").length
        const inProgressProjects = departmentProjects.filter((project) => project.status === "inprogress").length
        const finishedProjects = departmentProjects.filter((project) => project.status === "finished").length

        const todoTasks = departmentTasks.filter((task) => task.status === "todo").length
        const inProgressTasks = departmentTasks.filter((task) => task.status === "inprogress").length
        const finishedTasks = departmentTasks.filter((task) => task.status === "finished").length

        const totalProjects = departmentProjects.length
        const totalTasks = departmentTasks.length
        const completionRate = totalTasks > 0 ? Math.round((finishedTasks / totalTasks) * 100) : 0

        return {
            summary: {
                totalProjects,
                totalTasks,
                completionRate,
                teamMembers: teamMembers.length,
            },
            projectStatus: {
                todo: todoProjects,
                inProgress: inProgressProjects,
                finished: finishedProjects,
            },
            taskStatus: {
                todo: todoTasks,
                inProgress: inProgressTasks,
                finished: finishedTasks,
            },
            projectsList: departmentProjects.slice(0, 5),
            tasksList: departmentTasks.slice(0, 5),
        }
    }

    // Generate projects report data
    const generateProjectsReportData = () => {
        const departmentProjects = projects.filter((project) => project.department === userDepartment)

        const todoProjects = departmentProjects.filter((project) => project.status === "todo")
        const inProgressProjects = departmentProjects.filter((project) => project.status === "inprogress")
        const finishedProjects = departmentProjects.filter((project) => project.status === "finished")

        const totalProjects = departmentProjects.length
        const completionRate = totalProjects > 0 ? Math.round((finishedProjects.length / totalProjects) * 100) : 0

        return {
            summary: {
                totalProjects,
                todoProjects: todoProjects.length,
                inProgressProjects: inProgressProjects.length,
                finishedProjects: finishedProjects.length,
                completionRate,
            },
            projectsList: departmentProjects,
            todoProjects,
            inProgressProjects,
            finishedProjects,
        }
    }

    // Generate tasks report data
    const generateTasksReportData = () => {
        const departmentTasks = tasks.filter((task) => task.department === userDepartment)

        const todoTasks = departmentTasks.filter((task) => task.status === "todo")
        const inProgressTasks = departmentTasks.filter((task) => task.status === "inprogress")
        const finishedTasks = departmentTasks.filter((task) => task.status === "finished")

        const totalTasks = departmentTasks.length
        const completionRate = totalTasks > 0 ? Math.round((finishedTasks.length / totalTasks) * 100) : 0

        // Group tasks by project
        const tasksByProject = {}
        departmentTasks.forEach((task) => {
            if (!tasksByProject[task.projectTitle]) {
                tasksByProject[task.projectTitle] = []
            }
            tasksByProject[task.projectTitle].push(task)
        })

        return {
            summary: {
                totalTasks,
                todoTasks: todoTasks.length,
                inProgressTasks: inProgressTasks.length,
                finishedTasks: finishedTasks.length,
                completionRate,
            },
            tasksList: departmentTasks,
            todoTasks,
            inProgressTasks,
            finishedTasks,
            tasksByProject,
        }
    }

    // Generate team report data
    const generateTeamReportData = () => {
        const departmentMembers = teamMembers.filter((member) => member.department === userDepartment)

        // Calculate task completion by team member
        const memberPerformance = departmentMembers.map((member) => {
            const memberTasks = tasks.filter((task) =>
                task.department === userDepartment &&
                member.tasks.includes(task.taskName)
            )

            const completedTasks = memberTasks.filter((task) => task.status === "finished").length
            const totalTasks = memberTasks.length
            const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

            return {
                ...member,
                completedTasks,
                totalTasks,
                completionRate,
            }
        })

        return {
            summary: {
                totalMembers: departmentMembers.length,
                activeMembers: departmentMembers.filter((member) => member.isOnline).length,
                averageCompletionRate: memberPerformance.length > 0
                    ? Math.round(memberPerformance.reduce((sum, member) => sum + member.completionRate, 0) / memberPerformance.length)
                    : 0,
            },
            membersList: departmentMembers,
            memberPerformance,
        }
    }

    // Generate files report data
    const generateFilesReportData = () => {
        const departmentFiles = files.filter((file) => file.department === userDepartment)

        // Group files by project
        const filesByProject = {}
        departmentFiles.forEach((file) => {
            if (!filesByProject[file.project]) {
                filesByProject[file.project] = []
            }
            filesByProject[file.project].push(file)
        })

        // Group files by type
        const filesByType = {}
        departmentFiles.forEach((file) => {
            if (!filesByType[file.type]) {
                filesByType[file.type] = []
            }
            filesByType[file.type].push(file)
        })

        return {
            summary: {
                totalFiles: departmentFiles.length,
                sharedFiles: departmentFiles.filter((file) => file.shared).length,
                starredFiles: departmentFiles.filter((file) => file.starred).length,
            },
            filesList: departmentFiles,
            filesByProject,
            filesByType,
        }
    }

    // Get report icon based on type
    const getReportIcon = (type) => {
        switch (type) {
            case "overview":
                return <BarChart2 size={24} color="#4A5568" />
            case "projects":
                return <Briefcase size={24} color="#4A5568" />
            case "tasks":
                return <CheckCircle size={24} color="#4A5568" />
            case "team":
                return <Users size={24} color="#4A5568" />
            case "files":
                return <FileText size={24} color="#4A5568" />
            default:
                return <FileText size={24} color="#4A5568" />
        }
    }

    // Get report format icon
    const getReportFormatIcon = (format) => {
        switch (format) {
            case "pdf":
                return <FilePdf size={24} color="#FF5733" />
            case "xlsx":
                return <FileSpreadsheet size={24} color="#217346" />
            default:
                return <FileText size={24} color="#4A5568" />
        }
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
        <Box bg="white.a700" w="100%" overflowX="hidden">
            <Flex alignItems="flex-start" flexDirection={{ base: "column", md: "row" }}>
                {/* Left Sidebar */}
                <Box position={{ md: "sticky" }} top={{ md: "0" }} height={{ md: "100vh" }} zIndex={{ md: 10 }}>
                    <Sidebar />
                </Box>

                <Box flex={1} position="relative" minH={{ base: "auto", md: "100vh" }}>
                    {/* Header Section */}
                    <Box
                        bgGradient="linear-gradient(180deg, #81be41 0%, rgba(129, 190, 65, 0) 100%)"
                        w="100%"
                        px={{ base: "16px", md: "24px" }}
                        py={{ base: "16px", md: "20px" }}
                    >
                        <Header mb="16px" flexDirection={{ base: "column", md: "row" }} />
                    </Box>

                    {/* Main Content Area */}
                    <Flex flexDirection={{ base: "column", md: "row" }}>
                        {/* Main Content */}
                        <Box
                            w={{ base: "100%", md: mainContentWidth }}
                            borderColor="gray.200"
                            borderRightWidth={{ md: "1px" }}
                            borderStyle="solid"
                            bg="white.a700"
                            order={{ base: 2, md: 1 }}
                        >
                            {/* Page Title and Filters */}
                            <Flex
                                px={{ base: "16px", md: "24px" }}
                                py={{ base: "20px", md: "20px" }}
                                justifyContent="space-between"
                                alignItems={{ base: "flex-start", md: "center" }}
                                flexDirection={{ base: "column", md: "row" }}
                                gap={{ base: "16px", md: "0" }}
                            >
                                <Flex flexDirection="column" alignItems="flex-start" mt="0">
                                    <Heading
                                        size="heading6xl"
                                        as="h1"
                                        letterSpacing="1.50px"
                                        fontSize={{ base: "24px", md: "28px" }}
                                        fontWeight={600}
                                    >
                                        View and Generate Reports
                                    </Heading>
                                    <Heading
                                        size="text5xl"
                                        as="h6"
                                        mt="2px"
                                        fontSize={{ base: "16px", md: "18px" }}
                                        fontWeight={500}
                                        color="gray.700"
                                    >
                                        Reports
                                    </Heading>
                                </Flex>

                                <Flex
                                    gap={{ base: "16px", md: "20px" }}
                                    w={{ base: "100%", md: "auto" }}
                                    justifyContent={{ base: "space-between", md: "flex-end" }}
                                    alignItems="center"
                                >
                                    <Button
                                        onClick={onGenerateReportOpen}
                                        bg="#81BE41"
                                        color="white"
                                        _hover={{ bg: "#6ca32e" }}
                                        fontSize={{ base: "14px", md: "16px" }}
                                        fontWeight={500}
                                        h={{ base: "36px", md: "40px" }}
                                        px={{ base: "12px", md: "16px" }}
                                        borderRadius="8px"
                                        leftIcon={<FileText size={16} />}
                                    >
                                        Generate Report
                                    </Button>

                                    <SelectBox
                                        shape="round"
                                        indicator={<Image src="images/img_arrowdown_black_900_01.svg" alt="Arrow Down" w="24px" h="24px" />}
                                        getOptionLabel={(e) => (
                                            <>
                                                <Box display="flex" alignItems="center">
                                                    <Image src="images/img_uilcalender_gray_500.svg" alt="Uil:calender" w="20px" h="20px" />
                                                    <span>{e.label}</span>
                                                </Box>
                                            </>
                                        )}
                                        name="uilcalender"
                                        placeholder={`This Month`}
                                        options={dropDownOptions}
                                        style={{
                                            fontWeight: 500,
                                            fontSize: "16px",
                                            gap: "6px",
                                            borderColor: "gray.500",
                                            borderWidth: "1px",
                                            borderStyle: "solid",
                                            w: { base: "48%", md: "120px" },
                                        }}
                                        onChange={(value) => handleDateRangeChange(value)}
                                    />
                                    <Box position="relative" w={{ base: "48%", md: "120px" }} data-filter-dropdown>
                                        <Button
                                            onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            w="100%"
                                            h="44px"
                                            px="16px"
                                            border="1px solid"
                                            borderColor="gray.500"
                                            borderRadius="8px"
                                            bg="white"
                                            _hover={{ bg: "gray.50" }}
                                        >
                                            <Flex alignItems="center" gap="8px">
                                                <Filter size={16} />
                                                <Text fontWeight={500} fontSize="16px">
                                                    Filter
                                                </Text>
                                            </Flex>
                                            <Box as={ChevronDown} size={16} />
                                        </Button>

                                        {isFilterDropdownOpen && (
                                            <Box
                                                position="absolute"
                                                top="48px"
                                                left="0"
                                                right="0"
                                                zIndex="10"
                                                bg="white"
                                                boxShadow="0 4px 12px rgba(0, 0, 0, 0.15)"
                                                borderRadius="10px"
                                                border="1px solid"
                                                borderColor="gray.200"
                                                maxH="350px"
                                                overflowY="auto"
                                                w="280px"
                                            >
                                                <Box p="12px 16px" borderBottom="1px solid" borderColor="gray.200">
                                                    <Text fontWeight="600" fontSize="14px">
                                                        Filter by Department
                                                    </Text>
                                                </Box>
                                                <Box p="10px">
                                                    <Flex
                                                        align="center"
                                                        p="8px 12px"
                                                        cursor="pointer"
                                                        borderRadius="6px"
                                                        _hover={{ bg: "gray.50" }}
                                                        onClick={() => handleDepartmentSelection("ALL DEPARTMENTS")}
                                                    >
                                                        <CustomCheckbox
                                                            isChecked={selectedDepartments.length === 0}
                                                            onChange={() => handleDepartmentSelection("ALL DEPARTMENTS")}
                                                        />
                                                        <Text fontSize="14px" fontWeight="500">
                                                            All Departments
                                                        </Text>
                                                    </Flex>
                                                    {departments.map((department) => (
                                                        <Flex
                                                            key={department.id}
                                                            align="center"
                                                            p="8px 12px"
                                                            cursor="pointer"
                                                            borderRadius="6px"
                                                            _hover={{ bg: "gray.50" }}
                                                            onClick={() => handleDepartmentSelection(department.name)}
                                                        >
                                                            <CustomCheckbox
                                                                isChecked={selectedDepartments.includes(department.name)}
                                                                onChange={() => handleDepartmentSelection(department.name)}
                                                            />
                                                            <Text fontSize="14px" fontWeight="500">
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
                            <Box px={{ base: "16px", md: "24px" }} pb="16px">
                                <InputGroup>
                                    <InputLeftElement pointerEvents="none">
                                        <Search color="gray.500" size={20} />
                                    </InputLeftElement>
                                    <Input
                                        placeholder="Search reports..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        borderRadius="8px"
                                        borderColor="gray.300"
                                        _focus={{ borderColor: "#81BE41", boxShadow: "0 0 0 1px #81BE41" }}
                                    />
                                </InputGroup>
                            </Box>

                            {/* Reports Content */}
                            <Box
                                borderColor="gray.300_01"
                                borderTopWidth="1px"
                                borderStyle="solid"
                                bg="white.a700"
                                px={{ base: "16px", md: "24px" }}
                                py={{ base: "20px", md: "24px" }}
                            >
                                {generatedReports.length > 0 ? (
                                    <>
                                        {/* Department Overview Dashboard */}
                                        <Box mb="32px">
                                            <Heading size="md" mb="16px">
                                                Department Dashboard
                                            </Heading>
                                            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(4, 1fr)" }} gap={6}>
                                                <GridItem>
                                                    <Stat
                                                        p="16px"
                                                        borderRadius="10px"
                                                        border="1px solid"
                                                        borderColor="gray.200"
                                                        bg="white"
                                                        boxShadow="sm"
                                                    >
                                                        <StatLabel fontSize="14px" color="gray.600">
                                                            Total Projects
                                                        </StatLabel>
                                                        <StatNumber fontSize="24px" fontWeight="bold">
                                                            {filteredProjects.length}
                                                        </StatNumber>
                                                        <StatHelpText mb="0">
                                                            <Flex alignItems="center">
                                                                <ArrowUpRight size={14} color="#38A169" />
                                                                <Text ml="4px" color="green.500">
                                                                    +5% from last month
                                                                </Text>
                                                            </Flex>
                                                        </StatHelpText>
                                                    </Stat>
                                                </GridItem>
                                                <GridItem>
                                                    <Stat
                                                        p="16px"
                                                        borderRadius="10px"
                                                        border="1px solid"
                                                        borderColor="gray.200"
                                                        bg="white"
                                                        boxShadow="sm"
                                                    >
                                                        <StatLabel fontSize="14px" color="gray.600">
                                                            Total Tasks
                                                        </StatLabel>
                                                        <StatNumber fontSize="24px" fontWeight="bold">
                                                            {filteredTasks.length}
                                                        </StatNumber>
                                                        <StatHelpText mb="0">
                                                            <Flex alignItems="center">
                                                                <ArrowUpRight size={14} color="#38A169" />
                                                                <Text ml="4px" color="green.500">
                                                                    +12% from last month
                                                                </Text>
                                                            </Flex>
                                                        </StatHelpText>
                                                    </Stat>
                                                </GridItem>
                                                <GridItem>
                                                    <Stat
                                                        p="16px"
                                                        borderRadius="10px"
                                                        border="1px solid"
                                                        borderColor="gray.200"
                                                        bg="white"
                                                        boxShadow="sm"
                                                    >
                                                        <StatLabel fontSize="14px" color="gray.600">
                                                            Completion Rate
                                                        </StatLabel>
                                                        <StatNumber fontSize="24px" fontWeight="bold">
                                                            {filteredTasks.length > 0
                                                                ? Math.round(
                                                                    (filteredTasks.filter((task) => task.status === "finished").length /
                                                                        filteredTasks.length) *
                                                                    100
                                                                )
                                                                : 0}
                                                            %
                                                        </StatNumber>
                                                        <StatHelpText mb="0">
                                                            <Flex alignItems="center">
                                                                <ArrowUpRight size={14} color="#38A169" />
                                                                <Text ml="4px" color="green.500">
                                                                    +8% from last month
                                                                </Text>
                                                            </Flex>
                                                        </StatHelpText>
                                                    </Stat>
                                                </GridItem>
                                                <GridItem>
                                                    <Stat
                                                        p="16px"
                                                        borderRadius="10px"
                                                        border="1px solid"
                                                        borderColor="gray.200"
                                                        bg="white"
                                                        boxShadow="sm"
                                                    >
                                                        <StatLabel fontSize="14px" color="gray.600">
                                                            Team Members
                                                        </StatLabel>
                                                        <StatNumber fontSize="24px" fontWeight="bold">
                                                            {teamMembers.length}
                                                        </StatNumber>
                                                        <StatHelpText mb="0">
                                                            <Flex alignItems="center">
                                                                <ArrowUpRight size={14} color="#38A169" />
                                                                <Text ml="4px" color="green.500">
                                                                    +2 new this month
                                                                </Text>
                                                            </Flex>
                                                        </StatHelpText>
                                                    </Stat>
                                                </GridItem>
                                            </Grid>
                                        </Box>

                                        {/* Project Status Chart */}
                                        <Box mb="32px">
                                            <Heading size="md" mb="16px">
                                                Project Status
                                            </Heading>
                                            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={6}>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="10px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                    boxShadow="sm"
                                                >
                                                    <Chart
                                                        width="100%"
                                                        height="300px"
                                                        chartType="PieChart"
                                                        loader={<div>Loading Chart...</div>}
                                                        data={[
                                                            ["Status", "Count"],
                                                            [
                                                                "To Do",
                                                                filteredProjects.filter((project) => project.status === "todo").length,
                                                            ],
                                                            [
                                                                "In Progress",
                                                                filteredProjects.filter((project) => project.status === "inprogress").length,
                                                            ],
                                                            [
                                                                "Finished",
                                                                filteredProjects.filter((project) => project.status === "finished").length,
                                                            ],
                                                        ]}
                                                        options={{
                                                            title: "Project Status Distribution",
                                                            pieHole: 0.4,
                                                            colors: ["#B4AEAE", "#FFA500", "#81BE41"],
                                                            legend: { position: "bottom" },
                                                            chartArea: { width: "90%", height: "80%" },
                                                        }}
                                                    />
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="10px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                    boxShadow="sm"
                                                >
                                                    <Chart
                                                        width="100%"
                                                        height="300px"
                                                        chartType="ColumnChart"
                                                        loader={<div>Loading Chart...</div>}
                                                        data={[
                                                            ["Project", "Completion"],
                                                            ...filteredProjects.slice(0, 5).map((project) => [
                                                                project.buttonText,
                                                                project.tasks && project.tasks.length > 0
                                                                    ? Math.round(
                                                                        (project.tasks.filter((task) => task.completed).length / project.tasks.length) * 100
                                                                    )
                                                                    : 0,
                                                            ]),
                                                        ]}
                                                        options={{
                                                            title: "Project Completion Percentage",
                                                            chartArea: { width: "80%", height: "70%" },
                                                            hAxis: { title: "Project" },
                                                            vAxis: { title: "Completion (%)", minValue: 0, maxValue: 100 },
                                                            legend: { position: "none" },
                                                            colors: ["#81BE41"],
                                                        }}
                                                    />
                                                </GridItem>
                                            </Grid>
                                        </Box>

                                        {/* Recent Reports */}
                                        <Box mb="32px">
                                            <Heading size="md" mb="16px">
                                                Recent Reports
                                            </Heading>
                                            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={6}>
                                                {generatedReports.slice(0, 6).map((report) => (
                                                    <GridItem key={report.id}>
                                                        <Box
                                                            p="16px"
                                                            borderRadius="10px"
                                                            border="1px solid"
                                                            borderColor="gray.200"
                                                            bg="white"
                                                            boxShadow="sm"
                                                            cursor="pointer"
                                                            onClick={() => handleViewReportDetails(report)}
                                                            _hover={{ boxShadow: "md", borderColor: "gray.300" }}
                                                            transition="all 0.2s"
                                                        >
                                                            <Flex alignItems="center" mb="12px">
                                                                {getReportIcon(report.type)}
                                                                <Box ml="12px">
                                                                    <Text fontWeight="600" fontSize="16px" noOfLines={1}>
                                                                        {report.name}
                                                                    </Text>
                                                                    <Text fontSize="14px" color="gray.600">
                                                                        {report.dateGenerated}
                                                                    </Text>
                                                                </Box>
                                                            </Flex>
                                                            <Flex justifyContent="space-between" alignItems="center">
                                                                <Badge
                                                                    colorScheme={
                                                                        report.type === "overview"
                                                                            ? "blue"
                                                                            : report.type === "projects"
                                                                                ? "green"
                                                                                : report.type === "tasks"
                                                                                    ? "orange"
                                                                                    : report.type === "team"
                                                                                        ? "purple"
                                                                                        : "teal"
                                                                    }
                                                                >
                                                                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                                                                </Badge>
                                                                <Flex alignItems="center">
                                                                    {getReportFormatIcon(report.format)}
                                                                    <Text ml="4px" fontSize="14px" color="gray.600">
                                                                        {report.format.toUpperCase()}
                                                                    </Text>
                                                                </Flex>
                                                            </Flex>
                                                        </Box>
                                                    </GridItem>
                                                ))}
                                            </Grid>
                                        </Box>

                                        {/* All Reports */}
                                        <Box>
                                            <Heading size="md" mb="16px">
                                                All Reports
                                            </Heading>
                                            <Table variant="simple" borderRadius="8px" overflow="hidden" boxShadow="sm">
                                                <Thead bg="gray.50">
                                                    <Tr>
                                                        <Th>Report Name</Th>
                                                        <Th>Type</Th>
                                                        <Th>Date Generated</Th>
                                                        <Th>Format</Th>
                                                        <Th>Size</Th>
                                                        <Th>Actions</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {generatedReports.map((report) => (
                                                        <Tr key={report.id} _hover={{ bg: "gray.50" }} cursor="pointer">
                                                            <Td onClick={() => handleViewReportDetails(report)}>
                                                                <Flex alignItems="center">
                                                                    {getReportIcon(report.type)}
                                                                    <Text ml="8px" fontWeight="500">
                                                                        {report.name}
                                                                    </Text>
                                                                </Flex>
                                                            </Td>
                                                            <Td>
                                                                <Badge
                                                                    colorScheme={
                                                                        report.type === "overview"
                                                                            ? "blue"
                                                                            : report.type === "projects"
                                                                                ? "green"
                                                                                : report.type === "tasks"
                                                                                    ? "orange"
                                                                                    : report.type === "team"
                                                                                        ? "purple"
                                                                                        : "teal"
                                                                    }
                                                                >
                                                                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                                                                </Badge>
                                                            </Td>
                                                            <Td>{report.dateGenerated}</Td>
                                                            <Td>
                                                                <Flex alignItems="center">
                                                                    {getReportFormatIcon(report.format)}
                                                                    <Text ml="4px">{report.format.toUpperCase()}</Text>
                                                                </Flex>
                                                            </Td>
                                                            <Td>{report.size}</Td>
                                                            <Td>
                                                                <Flex>
                                                                    <IconButton
                                                                        aria-label="Download report"
                                                                        icon={<Download size={16} />}
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation()
                                                                            handleReportDownload(report)
                                                                        }}
                                                                        mr="2"
                                                                    />
                                                                    <Menu>
                                                                        <MenuButton
                                                                            as={IconButton}
                                                                            aria-label="More options"
                                                                            icon={<MoreVertical size={16} />}
                                                                            size="sm"
                                                                            variant="ghost"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        />
                                                                        <MenuList>
                                                                            <MenuItem
                                                                                icon={<Share2 size={16} />}
                                                                                onClick={() => handleReportShare(report)}
                                                                            >
                                                                                Share
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                icon={<Printer size={16} />}
                                                                                onClick={() => handleReportPrint(report)}
                                                                            >
                                                                                Print
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                icon={<Mail size={16} />}
                                                                                onClick={() => handleReportEmail(report)}
                                                                            >
                                                                                Email
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                icon={<Trash2 size={16} color="red" />}
                                                                                color="red.500"
                                                                                onClick={() => handleReportDelete(report)}
                                                                            >
                                                                                Delete
                                                                            </MenuItem>
                                                                        </MenuList>
                                                                    </Menu>
                                                                </Flex>
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </Box>
                                    </>
                                ) : (
                                    <Flex
                                        flexDirection="column"
                                        alignItems="center"
                                        justifyContent="center"
                                        py={{ base: "30px", md: "40px" }}
                                    >
                                        <Heading
                                            size="heading5xl"
                                            as="h3"
                                            fontWeight={700}
                                            fontSize={{ base: "24px", md: "28px" }}
                                            mb={{ base: "30px", md: "40px" }}
                                        >
                                            NO REPORTS FOUND!
                                        </Heading>

                                        <Image
                                            src="images/img_group_172.svg"
                                            alt="Empty reports illustration"
                                            h={{ base: "160px", md: "220px" }}
                                            w={{ base: "60%", md: "34%" }}
                                            fit="contain"
                                            mb={{ base: "24px", md: "32px" }}
                                        />

                                        <Flex
                                            flexDirection="column"
                                            alignItems="center"
                                            maxW={{ base: "100%", md: "60%" }}
                                            textAlign="center"
                                            px={{ base: "16px", md: "0" }}
                                        >
                                            <Text
                                                fontSize={{ base: "16px", md: "18px" }}
                                                fontWeight={500}
                                                lineHeight={{ base: "24px", md: "30px" }}
                                                color="gray.700"
                                            >
                                                No reports have been generated yet.
                                            </Text>
                                            <Text
                                                fontSize={{ base: "16px", md: "18px" }}
                                                fontWeight={400}
                                                lineHeight={{ base: "24px", md: "30px" }}
                                                color="#000000"
                                                mt="4px"
                                            >
                                                Generate a report to view insights about your projects, tasks, and team.
                                            </Text>
                                            <Button
                                                onClick={onGenerateReportOpen}
                                                mt="24px"
                                                bg="#81BE41"
                                                color="white"
                                                _hover={{ bg: "#6ca32e" }}
                                                leftIcon={<FileText size={16} />}
                                            >
                                                Generate Report
                                            </Button>
                                        </Flex>
                                    </Flex>
                                )}
                            </Box>
                        </Box>

                        {/* Right Sidebar */}
                        <RightSidebar order={{ base: 1, md: 2 }} />
                    </Flex>
                </Box>
            </Flex>

            {/* Generate Report Modal */}
            <Modal isOpen={isGenerateReportOpen} onClose={onGenerateReportClose} isCentered>
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
                <ModalContent bg="white" borderRadius="10px" mx={{ base: "16px", md: "0" }}>
                    <ModalHeader borderBottom="1px solid" borderColor="gray.200" py="16px">
                        Generate New Report
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6} pt={4}>
                        <FormControl mb={4}>
                            <FormLabel fontWeight="500">Report Type</FormLabel>
                            <Select
                                value={reportType}
                                onChange={(e) => setReportType(e.target.value)}
                                borderColor="gray.300"
                                _focus={{ borderColor: "#81BE41", boxShadow: "0 0 0 1px #81BE41" }}
                            >
                                <option value="overview">Department Overview</option>
                                <option value="projects">Projects Report</option>
                                <option value="tasks">Tasks Report</option>
                                <option value="team">Team Performance</option>
                                <option value="files">Files & Documents</option>
                            </Select>
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel fontWeight="500">Date Range</FormLabel>
                            <Select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                borderColor="gray.300"
                                _focus={{ borderColor: "#81BE41", boxShadow: "0 0 0 1px #81BE41" }}
                            >
                                <option value="today">Today</option>
                                <option value="this-week">This Week</option>
                                <option value="this-month">This Month</option>
                                <option value="this-quarter">This Quarter</option>
                                <option value="this-year">This Year</option>
                                <option value="custom">Custom Range</option>
                            </Select>
                        </FormControl>

                        {dateRange === "custom" && (
                            <Flex gap={4} mb={4}>
                                <FormControl>
                                    <FormLabel fontWeight="500">Start Date</FormLabel>
                                    <Input
                                        type="date"
                                        value={customDateRange.start}
                                        onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                                        borderColor="gray.300"
                                        _focus={{ borderColor: "#81BE41", boxShadow: "0 0 0 1px #81BE41" }}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel fontWeight="500">End Date</FormLabel>
                                    <Input
                                        type="date"
                                        value={customDateRange.end}
                                        onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                                        borderColor="gray.300"
                                        _focus={{ borderColor: "#81BE41", boxShadow: "0 0 0 1px #81BE41" }}
                                    />
                                </FormControl>
                            </Flex>
                        )}

                        <FormControl mb={4}>
                            <FormLabel fontWeight="500">Report Format</FormLabel>
                            <RadioGroup value={reportFormat} onChange={setReportFormat}>
                                <Stack direction="row" spacing={5}>
                                    <Radio value="pdf" colorScheme="green">
                                        PDF
                                    </Radio>
                                    <Radio value="xlsx" colorScheme="green">
                                        Excel
                                    </Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>

                        <FormControl mb={4}>
                            <FormLabel fontWeight="500">Include in Report</FormLabel>
                            <Stack spacing={2}>
                                <Checkbox defaultChecked colorScheme="green">
                                    Summary Statistics
                                </Checkbox>
                                <Checkbox defaultChecked colorScheme="green">
                                    Charts & Graphs
                                </Checkbox>
                                <Checkbox defaultChecked colorScheme="green">
                                    Detailed Tables
                                </Checkbox>
                                <Checkbox defaultChecked colorScheme="green">
                                    Trend Analysis
                                </Checkbox>
                            </Stack>
                        </FormControl>
                    </ModalBody>

                    <ModalFooter borderTop="1px solid" borderColor="gray.200" py="16px">
                        <Button
                            bg="#81BE41"
                            color="white"
                            _hover={{ bg: "#6ca32e" }}
                            mr={3}
                            onClick={handleGenerateReport}
                            isLoading={isGeneratingReport}
                            loadingText="Generating..."
                        >
                            Generate Report
                        </Button>
                        <Button onClick={onGenerateReportClose} variant="outline" color="gray.700" borderColor="gray.300">
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            {/* Report Details Modal */}
            <Modal isOpen={isReportDetailsOpen} onClose={onReportDetailsClose} size="xl" isCentered>
                <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
                <ModalContent bg="white" borderRadius="10px" mx={{ base: "16px", md: "0" }}>
                    <ModalHeader borderBottom="1px solid" borderColor="gray.200" py="16px">
                        {selectedReport && selectedReport.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6} pt={4} maxH="70vh" overflowY="auto">
                        {selectedReport && reportData && (
                            <>
                                {/* Report Header */}
                                <Flex justifyContent="space-between" alignItems="center" mb="16px">
                                    <Flex alignItems="center">
                                        {getReportIcon(selectedReport.type)}
                                        <Box ml="12px">
                                            <Text fontSize="14px" color="gray.600">
                                                Generated on {selectedReport.dateGenerated}
                                            </Text>
                                            <Badge
                                                colorScheme={
                                                    selectedReport.type === "overview"
                                                        ? "blue"
                                                        : selectedReport.type === "projects"
                                                            ? "green"
                                                            : selectedReport.type === "tasks"
                                                                ? "orange"
                                                                : selectedReport.type === "team"
                                                                    ? "purple"
                                                                    : "teal"
                                                }
                                                mt="4px"
                                            >
                                                {selectedReport.type.charAt(0).toUpperCase() + selectedReport.type.slice(1)}
                                            </Badge>
                                        </Box>
                                    </Flex>
                                    <Flex alignItems="center">
                                        {getReportFormatIcon(selectedReport.format)}
                                        <Text ml="8px" fontSize="14px" color="gray.600">
                                            {selectedReport.format.toUpperCase()} • {selectedReport.size}
                                        </Text>
                                    </Flex>
                                </Flex>

                                <Divider my="16px" />

                                {/* Report Content based on type */}
                                {selectedReport.type === "overview" && (
                                    <>
                                        {/* Summary Statistics */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Summary Statistics
                                            </Heading>
                                            <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={4}>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Total Projects
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.totalProjects}
                                                    </Text>
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Total Tasks
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.totalTasks}
                                                    </Text>
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Completion Rate
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.completionRate}%
                                                    </Text>
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Team Members
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.teamMembers}
                                                    </Text>
                                                </GridItem>
                                            </Grid>
                                        </Box>

                                        {/* Project Status */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Project Status
                                            </Heading>
                                            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        To Do
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.projectStatus.todo}
                                                    </Text>
                                                    <Progress
                                                        value={(reportData.projectStatus.todo / reportData.summary.totalProjects) * 100}
                                                        colorScheme="gray"
                                                        mt="8px"
                                                    />
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        In Progress
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.projectStatus.inProgress}
                                                    </Text>
                                                    <Progress
                                                        value={(reportData.projectStatus.inProgress / reportData.summary.totalProjects) * 100}
                                                        colorScheme="orange"
                                                        mt="8px"
                                                    />
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Finished
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.projectStatus.finished}
                                                    </Text>
                                                    <Progress
                                                        value={(reportData.projectStatus.finished / reportData.summary.totalProjects) * 100}
                                                        colorScheme="green"
                                                        mt="8px"
                                                    />
                                                </GridItem>
                                            </Grid>
                                        </Box>

                                        {/* Task Status */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Task Status
                                            </Heading>
                                            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        To Do
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.taskStatus.todo}
                                                    </Text>
                                                    <Progress
                                                        value={(reportData.taskStatus.todo / reportData.summary.totalTasks) * 100}
                                                        colorScheme="gray"
                                                        mt="8px"
                                                    />
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        In Progress
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.taskStatus.inProgress}
                                                    </Text>
                                                    <Progress
                                                        value={(reportData.taskStatus.inProgress / reportData.summary.totalTasks) * 100}
                                                        colorScheme="orange"
                                                        mt="8px"
                                                    />
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Finished
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.taskStatus.finished}
                                                    </Text>
                                                    <Progress
                                                        value={(reportData.taskStatus.finished / reportData.summary.totalTasks) * 100}
                                                        colorScheme="green"
                                                        mt="8px"
                                                    />
                                                </GridItem>
                                            </Grid>
                                        </Box>

                                        {/* Recent Projects */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Recent Projects
                                            </Heading>
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Project Name</Th>
                                                        <Th>Status</Th>
                                                        <Th>Progress</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {reportData.projectsList.map((project, index) => (
                                                        <Tr key={index}>
                                                            <Td>{project.buttonText}</Td>
                                                            <Td>
                                                                <Badge
                                                                    colorScheme={
                                                                        project.status === "todo"
                                                                            ? "gray"
                                                                            : project.status === "inprogress"
                                                                                ? "orange"
                                                                                : "green"
                                                                    }
                                                                >
                                                                    {project.status === "todo"
                                                                        ? "To Do"
                                                                        : project.status === "inprogress"
                                                                            ? "In Progress"
                                                                            : "Finished"}
                                                                </Badge>
                                                            </Td>
                                                            <Td>
                                                                <Progress
                                                                    value={
                                                                        project.tasks && project.tasks.length > 0
                                                                            ? Math.round(
                                                                                (project.tasks.filter((task) => task.completed).length /
                                                                                    project.tasks.length) *
                                                                                100
                                                                            )
                                                                            : 0
                                                                    }
                                                                    size="sm"
                                                                    colorScheme={
                                                                        project.status === "todo"
                                                                            ? "gray"
                                                                            : project.status === "inprogress"
                                                                                ? "orange"
                                                                                : "green"
                                                                    }
                                                                />
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </Box>

                                        {/* Recent Tasks */}
                                        <Box>
                                            <Heading size="sm" mb="16px">
                                                Recent Tasks
                                            </Heading>
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Task Name</Th>
                                                        <Th>Project</Th>
                                                        <Th>Status</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {reportData.tasksList.map((task, index) => (
                                                        <Tr key={index}>
                                                            <Td>{task.taskName}</Td>
                                                            <Td>{task.projectTitle}</Td>
                                                            <Td>
                                                                <Badge
                                                                    colorScheme={
                                                                        task.status === "todo"
                                                                            ? "gray"
                                                                            : task.status === "inprogress"
                                                                                ? "orange"
                                                                                : "green"
                                                                    }
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

                                {selectedReport.type === "projects" && (
                                    <>
                                        {/* Project Summary */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Project Summary
                                            </Heading>
                                            <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Total Projects
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.totalProjects}
                                                    </Text>
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Completion Rate
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.completionRate}%
                                                    </Text>
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                    colSpan={{ base: 2, md: 1 }}
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Status Distribution
                                                    </Text>
                                                    <Flex mt="8px" alignItems="center" justifyContent="space-between">
                                                        <Badge colorScheme="gray" px="2" py="1">
                                                            To Do: {reportData.summary.todoProjects}
                                                        </Badge>
                                                        <Badge colorScheme="orange" px="2" py="1">
                                                            In Progress: {reportData.summary.inProgressProjects}
                                                        </Badge>
                                                        <Badge colorScheme="green" px="2" py="1">
                                                            Finished: {reportData.summary.finishedProjects}
                                                        </Badge>
                                                    </Flex>
                                                </GridItem>
                                            </Grid>
                                        </Box>

                                        {/* Project Status Chart */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Project Status Distribution
                                            </Heading>
                                            <Box
                                                p="16px"
                                                borderRadius="8px"
                                                border="1px solid"
                                                borderColor="gray.200"
                                                bg="white"
                                                h="300px"
                                            >
                                                <Chart
                                                    width="100%"
                                                    height="100%"
                                                    chartType="PieChart"
                                                    loader={<div>Loading Chart...</div>}
                                                    data={[
                                                        ["Status", "Count"],
                                                        ["To Do", reportData.summary.todoProjects],
                                                        ["In Progress", reportData.summary.inProgressProjects],
                                                        ["Finished", reportData.summary.finishedProjects],
                                                    ]}
                                                    options={{
                                                        pieHole: 0.4,
                                                        colors: ["#B4AEAE", "#FFA500", "#81BE41"],
                                                        legend: { position: "right" },
                                                        chartArea: { width: "80%", height: "80%" },
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Project List */}
                                        <Box>
                                            <Heading size="sm" mb="16px">
                                                Project Details
                                            </Heading>
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Project Name</Th>
                                                        <Th>Status</Th>
                                                        <Th>Start Date</Th>
                                                        <Th>End Date</Th>
                                                        <Th>Progress</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {reportData.projectsList.map((project, index) => (
                                                        <Tr key={index}>
                                                            <Td>{project.buttonText}</Td>
                                                            <Td>
                                                                <Badge
                                                                    colorScheme={
                                                                        project.status === "todo"
                                                                            ? "gray"
                                                                            : project.status === "inprogress"
                                                                                ? "orange"
                                                                                : "green"
                                                                    }
                                                                >
                                                                    {project.status === "todo"
                                                                        ? "To Do"
                                                                        : project.status === "inprogress"
                                                                            ? "In Progress"
                                                                            : "Finished"}
                                                                </Badge>
                                                            </Td>
                                                            <Td>{project.startDate}</Td>
                                                            <Td>{project.endDate}</Td>
                                                            <Td>
                                                                <Flex alignItems="center">
                                                                    <Progress
                                                                        value={
                                                                            project.tasks && project.tasks.length > 0
                                                                                ? Math.round(
                                                                                    (project.tasks.filter((task) => task.completed).length /
                                                                                        project.tasks.length) *
                                                                                    100
                                                                                )
                                                                                : 0
                                                                        }
                                                                        size="sm"
                                                                        colorScheme={
                                                                            project.status === "todo"
                                                                                ? "gray"
                                                                                : project.status === "inprogress"
                                                                                    ? "orange"
                                                                                    : "green"
                                                                        }
                                                                        flex="1"
                                                                        mr="8px"
                                                                    />
                                                                    <Text fontSize="12px">
                                                                        {project.tasks && project.tasks.length > 0
                                                                            ? Math.round(
                                                                                (project.tasks.filter((task) => task.completed).length /
                                                                                    project.tasks.length) *
                                                                                100
                                                                            )
                                                                            : 0}
                                                                        %
                                                                    </Text>
                                                                </Flex>
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </Box>
                                    </>
                                )}

                                {selectedReport.type === "tasks" && (
                                    <>
                                        {/* Task Summary */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Task Summary
                                            </Heading>
                                            <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Total Tasks
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.totalTasks}
                                                    </Text>
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Completion Rate
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.completionRate}%
                                                    </Text>
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                    colSpan={{ base: 2, md: 1 }}
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Status Distribution
                                                    </Text>
                                                    <Flex mt="8px" alignItems="center" justifyContent="space-between">
                                                        <Badge colorScheme="gray" px="2" py="1">
                                                            To Do: {reportData.summary.todoTasks}
                                                        </Badge>
                                                        <Badge colorScheme="orange" px="2" py="1">
                                                            In Progress: {reportData.summary.inProgressTasks}
                                                        </Badge>
                                                        <Badge colorScheme="green" px="2" py="1">
                                                            Finished: {reportData.summary.finishedTasks}
                                                        </Badge>
                                                    </Flex>
                                                </GridItem>
                                            </Grid>
                                        </Box>

                                        {/* Task Status Chart */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Task Status Distribution
                                            </Heading>
                                            <Box
                                                p="16px"
                                                borderRadius="8px"
                                                border="1px solid"
                                                borderColor="gray.200"
                                                bg="white"
                                                h="300px"
                                            >
                                                <Chart
                                                    width="100%"
                                                    height="100%"
                                                    chartType="PieChart"
                                                    loader={<div>Loading Chart...</div>}
                                                    data={[
                                                        ["Status", "Count"],
                                                        ["To Do", reportData.summary.todoTasks],
                                                        ["In Progress", reportData.summary.inProgressTasks],
                                                        ["Finished", reportData.summary.finishedTasks],
                                                    ]}
                                                    options={{
                                                        pieHole: 0.4,
                                                        colors: ["#B4AEAE", "#FFA500", "#81BE41"],
                                                        legend: { position: "right" },
                                                        chartArea: { width: "80%", height: "80%" },
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Tasks by Project */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Tasks by Project
                                            </Heading>
                                            <Box
                                                p="16px"
                                                borderRadius="8px"
                                                border="1px solid"
                                                borderColor="gray.200"
                                                bg="white"
                                                h="300px"
                                            >
                                                <Chart
                                                    width="100%"
                                                    height="100%"
                                                    chartType="ColumnChart"
                                                    loader={<div>Loading Chart...</div>}
                                                    data={[
                                                        ["Project", "To Do", "In Progress", "Finished"],
                                                        ...Object.entries(reportData.tasksByProject)
                                                            .slice(0, 5)
                                                            .map(([project, tasks]) => [
                                                                project,
                                                                tasks.filter((task) => task.status === "todo").length,
                                                                tasks.filter((task) => task.status === "inprogress").length,
                                                                tasks.filter((task) => task.status === "finished").length,
                                                            ]),
                                                    ]}
                                                    options={{
                                                        isStacked: true,
                                                        colors: ["#B4AEAE", "#FFA500", "#81BE41"],
                                                        legend: { position: "top" },
                                                        chartArea: { width: "80%", height: "70%" },
                                                        hAxis: { title: "Project" },
                                                        vAxis: { title: "Number of Tasks" },
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Task List */}
                                        <Box>
                                            <Heading size="sm" mb="16px">
                                                Task Details
                                            </Heading>
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Task Name</Th>
                                                        <Th>Project</Th>
                                                        <Th>Status</Th>
                                                        <Th>Start Date</Th>
                                                        <Th>End Date</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {reportData.tasksList.map((task, index) => (
                                                        <Tr key={index}>
                                                            <Td>{task.taskName}</Td>
                                                            <Td>{task.projectTitle}</Td>
                                                            <Td>
                                                                <Badge
                                                                    colorScheme={
                                                                        task.status === "todo"
                                                                            ? "gray"
                                                                            : task.status === "inprogress"
                                                                                ? "orange"
                                                                                : "green"
                                                                    }
                                                                >
                                                                    {task.status === "todo"
                                                                        ? "To Do"
                                                                        : task.status === "inprogress"
                                                                            ? "In Progress"
                                                                            : "Finished"}
                                                                </Badge>
                                                            </Td>
                                                            <Td>{task.startDate}</Td>
                                                            <Td>{task.endDate}</Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </Box>
                                    </>
                                )}

                                {selectedReport.type === "team" && (
                                    <>
                                        {/* Team Summary */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Team Summary
                                            </Heading>
                                            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Total Members
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.totalMembers}
                                                    </Text>
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Active Members
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.activeMembers}
                                                    </Text>
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Avg. Completion Rate
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.averageCompletionRate}%
                                                    </Text>
                                                </GridItem>
                                            </Grid>
                                        </Box>

                                        {/* Team Performance Chart */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Team Performance
                                            </Heading>
                                            <Box
                                                p="16px"
                                                borderRadius="8px"
                                                border="1px solid"
                                                borderColor="gray.200"
                                                bg="white"
                                                h="300px"
                                            >
                                                <Chart
                                                    width="100%"
                                                    height="100%"
                                                    chartType="BarChart"
                                                    loader={<div>Loading Chart...</div>}
                                                    data={[
                                                        ["Member", "Completion Rate"],
                                                        ...reportData.memberPerformance.map((member) => [
                                                            member.name,
                                                            member.completionRate,
                                                        ]),
                                                    ]}
                                                    options={{
                                                        colors: ["#81BE41"],
                                                        legend: { position: "none" },
                                                        chartArea: { width: "70%", height: "80%" },
                                                        hAxis: { title: "Completion Rate (%)", minValue: 0, maxValue: 100 },
                                                        vAxis: { title: "Team Member" },
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Team Members List */}
                                        <Box>
                                            <Heading size="sm" mb="16px">
                                                Team Member Details
                                            </Heading>
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th>Name</Th>
                                                        <Th>Role</Th>
                                                        <Th>Status</Th>
                                                        <Th>Tasks Completed</Th>
                                                        <Th>Completion Rate</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {reportData.memberPerformance.map((member, index) => (
                                                        <Tr key={index}>
                                                            <Td>{member.name}</Td>
                                                            <Td>{member.role}</Td>
                                                            <Td>
                                                                <Badge colorScheme={member.isOnline ? "green" : "gray"}>
                                                                    {member.isOnline ? "Online" : "Offline"}
                                                                </Badge>
                                                            </Td>
                                                            <Td>
                                                                {member.completedTasks} / {member.totalTasks}
                                                            </Td>
                                                            <Td>
                                                                <Flex alignItems="center">
                                                                    <Progress
                                                                        value={member.completionRate}
                                                                        size="sm"
                                                                        colorScheme="green"
                                                                        flex="1"
                                                                        mr="8px"
                                                                    />
                                                                    <Text fontSize="12px">{member.completionRate}%</Text>
                                                                </Flex>
                                                            </Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </Box>
                                    </>
                                )}

                                {selectedReport.type === "files" && (
                                    <>
                                        {/* Files Summary */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Files Summary
                                            </Heading>
                                            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={4}>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Total Files
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.totalFiles}
                                                    </Text>
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Shared Files
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.sharedFiles}
                                                    </Text>
                                                </GridItem>
                                                <GridItem
                                                    p="16px"
                                                    borderRadius="8px"
                                                    border="1px solid"
                                                    borderColor="gray.200"
                                                    bg="white"
                                                >
                                                    <Text fontSize="14px" color="gray.600">
                                                        Starred Files
                                                    </Text>
                                                    <Text fontSize="24px" fontWeight="bold">
                                                        {reportData.summary.starredFiles}
                                                    </Text>
                                                </GridItem>
                                            </Grid>
                                        </Box>

                                        {/* Files by Type Chart */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Files by Type
                                            </Heading>
                                            <Box
                                                p="16px"
                                                borderRadius="8px"
                                                border="1px solid"
                                                borderColor="gray.200"
                                                bg="white"
                                                h="300px"
                                            >
                                                <Chart
                                                    width="100%"
                                                    height="100%"
                                                    chartType="PieChart"
                                                    loader={<div>Loading Chart...</div>}
                                                    data={[
                                                        ["File Type", "Count"],
                                                        ...Object.entries(reportData.filesByType).map(([type, files]) => [
                                                            type.toUpperCase(),
                                                            files.length,
                                                        ]),
                                                    ]}
                                                    options={{
                                                        pieHole: 0.4,
                                                        legend: { position: "right" },
                                                        chartArea: { width: "80%", height: "80%" },
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Files by Project */}
                                        <Box mb="24px">
                                            <Heading size="sm" mb="16px">
                                                Files by Project
                                            </Heading>
                                            <Box
                                                p="16px"
                                                borderRadius="8px"
                                                border="1px solid"
                                                borderColor="gray.200"
                                                bg="white"
                                                h="300px"
                                            >
                                                <Chart
                                                    width="100%"
                                                    height="100%"
                                                    chartType="ColumnChart"
                                                    loader={<div>Loading Chart...</div>}
                                                    data={[
                                                        ["Project", "Number of Files"],
                                                        ...Object.entries(reportData.filesByProject).map(([project, files]) => [
                                                            project,
                                                            files.length,
                                                        ]),
                                                    ]}
                                                    options={{
                                                        colors: ["#4285F4"],
                                                        legend: { position: "none" },
                                                        chartArea: { width: "80%", height: "70%" },
                                                        hAxis: { title: "Project" },
                                                        vAxis: { title: "Number of Files" },
                                                    }}
                                                />
                                            </Box>
                                        </Box>

                                        {/* Files List */}
                                        <Box>
                                            <Heading size="sm" mb="16px">
                                                File Details
                                            </Heading>
                                            <Table variant="simple" size="sm">
                                                <Thead>
                                                    <Tr>
                                                        <Th>File Name</Th>
                                                        <Th>Type</Th>
                                                        <Th>Project</Th>
                                                        <Th>Size</Th>
                                                        <Th>Uploaded By</Th>
                                                        <Th>Upload Date</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {reportData.filesList.map((file, index) => (
                                                        <Tr key={index}>
                                                            <Td>{file.name}</Td>
                                                            <Td>{file.type.toUpperCase()}</Td>
                                                            <Td>{file.project}</Td>
                                                            <Td>{file.size}</Td>
                                                            <Td>{file.uploadedBy}</Td>
                                                            <Td>{file.uploadDate}</Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                        </Box>
                                    </>
                                )}
                            </>
                        )}
                    </ModalBody>
                    <ModalFooter borderTop="1px solid" borderColor="gray.200" py="16px">
                        <Button
                            leftIcon={<Download size={16} />}
                            bg="#81BE41"
                            color="white"
                            _hover={{ bg: "#6ca32e" }}
                            mr={3}
                            onClick={() => handleReportDownload(selectedReport)}
                        >
                            Download Report
                        </Button>
                        <Button onClick={onReportDetailsClose} variant="outline" color="gray.700" borderColor="gray.300">
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}