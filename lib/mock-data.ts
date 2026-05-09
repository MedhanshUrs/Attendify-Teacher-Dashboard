export interface Student {
  id: string
  name: string
  rollNumber: string
  email: string
  department: string
  semester: number
  avatarUrl: string
  status: 'present' | 'absent' | 'late' | 'pending'
  detectedAt?: string
  confidence?: number
}

export interface AttendanceSession {
  id: string
  courseCode: string
  courseName: string
  classroom: string
  date: string
  startTime: string
  endTime?: string
  status: 'scheduled' | 'active' | 'completed'
  presentCount: number
  absentCount: number
  lateCount: number
  totalStudents: number
}

export interface ClassroomCamera {
  id: string
  name: string
  location: string
  status: 'online' | 'offline' | 'processing'
  lastFrame?: string
}

export const mockStudents: Student[] = [
  { id: '1', name: 'Arjun Sharma', rollNumber: 'CS2024001', email: 'arjun.sharma@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'present', detectedAt: '09:02:15', confidence: 98.5 },
  { id: '2', name: 'Priya Patel', rollNumber: 'CS2024002', email: 'priya.patel@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'present', detectedAt: '09:01:32', confidence: 99.2 },
  { id: '3', name: 'Rahul Kumar', rollNumber: 'CS2024003', email: 'rahul.kumar@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'late', detectedAt: '09:15:45', confidence: 97.8 },
  { id: '4', name: 'Sneha Reddy', rollNumber: 'CS2024004', email: 'sneha.reddy@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'present', detectedAt: '09:00:58', confidence: 99.5 },
  { id: '5', name: 'Vikram Singh', rollNumber: 'CS2024005', email: 'vikram.singh@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'absent' },
  { id: '6', name: 'Anjali Gupta', rollNumber: 'CS2024006', email: 'anjali.gupta@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'present', detectedAt: '09:03:22', confidence: 98.9 },
  { id: '7', name: 'Karthik Nair', rollNumber: 'CS2024007', email: 'karthik.nair@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'present', detectedAt: '09:02:48', confidence: 97.3 },
  { id: '8', name: 'Meera Iyer', rollNumber: 'CS2024008', email: 'meera.iyer@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'pending' },
  { id: '9', name: 'Aditya Verma', rollNumber: 'CS2024009', email: 'aditya.verma@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'present', detectedAt: '09:04:11', confidence: 99.1 },
  { id: '10', name: 'Divya Menon', rollNumber: 'CS2024010', email: 'divya.menon@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'absent' },
  { id: '11', name: 'Rohan Das', rollNumber: 'CS2024011', email: 'rohan.das@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'present', detectedAt: '09:01:55', confidence: 98.2 },
  { id: '12', name: 'Kavitha Raj', rollNumber: 'CS2024012', email: 'kavitha.raj@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'late', detectedAt: '09:18:30', confidence: 96.8 },
  { id: '13', name: 'Suresh Babu', rollNumber: 'CS2024013', email: 'suresh.babu@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'present', detectedAt: '09:02:33', confidence: 99.4 },
  { id: '14', name: 'Lakshmi Devi', rollNumber: 'CS2024014', email: 'lakshmi.devi@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'present', detectedAt: '09:03:07', confidence: 98.7 },
  { id: '15', name: 'Nikhil Joshi', rollNumber: 'CS2024015', email: 'nikhil.joshi@university.edu', department: 'Computer Science', semester: 4, avatarUrl: '', status: 'pending' },
]

export const mockSessions: AttendanceSession[] = [
  { id: '1', courseCode: 'CS401', courseName: 'Machine Learning', classroom: 'Room 301', date: '2024-03-15', startTime: '09:00', endTime: '10:30', status: 'completed', presentCount: 42, absentCount: 3, lateCount: 2, totalStudents: 47 },
  { id: '2', courseCode: 'CS402', courseName: 'Data Structures', classroom: 'Room 205', date: '2024-03-15', startTime: '11:00', endTime: '12:30', status: 'completed', presentCount: 38, absentCount: 5, lateCount: 2, totalStudents: 45 },
  { id: '3', courseCode: 'CS403', courseName: 'Artificial Intelligence', classroom: 'Lab 102', date: '2024-03-15', startTime: '14:00', status: 'active', presentCount: 11, absentCount: 2, lateCount: 2, totalStudents: 15 },
  { id: '4', courseCode: 'CS404', courseName: 'Database Systems', classroom: 'Room 401', date: '2024-03-15', startTime: '16:00', status: 'scheduled', presentCount: 0, absentCount: 0, lateCount: 0, totalStudents: 50 },
]

export const mockCameras: ClassroomCamera[] = [
  { id: '1', name: 'CAM-01', location: 'Front View', status: 'processing' },
  { id: '2', name: 'CAM-02', location: 'Rear View', status: 'online' },
  { id: '3', name: 'CAM-03', location: 'Left Wing', status: 'online' },
  { id: '4', name: 'CAM-04', location: 'Right Wing', status: 'online' },
]

export const weeklyAttendanceData = [
  { day: 'Mon', present: 45, absent: 3, late: 2 },
  { day: 'Tue', present: 42, absent: 5, late: 3 },
  { day: 'Wed', present: 47, absent: 2, late: 1 },
  { day: 'Thu', present: 44, absent: 4, late: 2 },
  { day: 'Fri', present: 41, absent: 6, late: 3 },
]

export const courseAttendanceData = [
  { course: 'ML', attendance: 94 },
  { course: 'DS', attendance: 88 },
  { course: 'AI', attendance: 91 },
  { course: 'DB', attendance: 86 },
  { course: 'CN', attendance: 92 },
]
