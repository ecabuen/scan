import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome5 } from '@expo/vector-icons';

export default function Attendance() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id: teacherId } = route.params || {};

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState('All');

  useEffect(() => {
    fetchStudentData();
  }, [teacherId]);

  const fetchStudentData = async () => {
    try {
      // Fetch student data
      const dataResponse = await axios.post(`http://192.168.254.101:3000/update-attendance`, {
        teacherId,
      }, {
        timeout: 10000,
      });

      const studentsData = dataResponse.data.data.map(student => ({
        ...student,
        attendanceStatus: student.status,
      }));

      // Fetch student images
      const picResponse = await axios.get(`http://192.168.254.101:3000/students/${teacherId}`, {
        timeout: 10000,
      });

      const studentsPics = picResponse.data.data.map(student => ({
        ...student,
        attendanceStatus: student.status === 'Present' ? 'Present' : student.status === 'Late' ? 'Late' : 'Absent',
      }));

      // Combine both data and images
      const combinedStudents = studentsData.map(student => {
        const picStudent = studentsPics.find(pic => pic.name === student.name) || {};
        return {
          ...student,
          profile_pic: picStudent.profile_pic || 'default.jpg', // Ensure there's a fallback
        };
      });

      setStudents(combinedStudents);
      setFilteredStudents(combinedStudents);
      
    } catch (error) {
      console.error('Error fetching student data or images:', error);
    }
  };

  const handleSearchChange = (text) => {
    setSearchTerm(text);
    filterStudents(text, attendanceStatusFilter);
  };

  const handleAttendanceStatusChange = (status) => {
    setAttendanceStatusFilter(status);
    filterStudents(searchTerm, status);
  };

  const filterStudents = (searchTerm, attendanceStatus) => {
    const filtered = students.filter(student => {
      const matchesName = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = attendanceStatus === 'All' || student.attendanceStatus.toLowerCase() === attendanceStatus.toLowerCase();
      return matchesName && matchesStatus;
    });
    setFilteredStudents(filtered);
  };

  const handleStatusChange = async (index, newStatus) => {
    const updatedStudents = [...students];
    const studentId = updatedStudents[index].studentId; // Ensure studentId is correctly accessed

    // Ensure studentId is defined
    if (!studentId) {
      console.error('Error: studentId is undefined for student:', updatedStudents[index]);
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];

    updatedStudents[index].attendanceStatus = newStatus;
    setStudents(updatedStudents);
    filterStudents(searchTerm, attendanceStatusFilter);

    try {
      console.log('Sending request to update status:', {
        studentId,
        newStatus,
        date: currentDate,
      });

      await axios.post('http://192.168.254.101:3000/update-student-status', {
        studentId,
        newStatus,
        date: currentDate,
      }, {
        timeout: 10000,
      });

      console.log(`Updated student ${studentId} to ${newStatus} for ${currentDate}`);
    } catch (error) {
      console.error('Error updating student status:', error);
      // Rollback the status change if update fails
      updatedStudents[index].attendanceStatus = students[index].attendanceStatus;
      setStudents(updatedStudents);
    }
  };

  const getImageSource = (profilePic) => {
    try {
      const images = require.context('./studentimages', false, /\.jpg$/);
      const imageName = `./${profilePic}`;
      return images(imageName);
    } catch (error) {
      console.warn(`Image not found: ${profilePic}. Using default image.`);
      return require('./images/empty.jpg');
    }
  };

  const getStatusCircleColor = (status) => {
    switch (status) {
      case 'Present':
        return 'green';
      case 'Absent':
        return 'red';
      case 'Late':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Attendance Management</Text>
        </View>
      </View>

      {/* Filter Section */}
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="🔍 Search by name"
          value={searchTerm}
          onChangeText={handleSearchChange}
        />
        <Picker
          selectedValue={attendanceStatusFilter}
          style={styles.picker}
          onValueChange={handleAttendanceStatusChange}
        >
          <Picker.Item label="All" value="All" />
          <Picker.Item label="Present" value="Present" />
          <Picker.Item label="Absent" value="Absent" />
          <Picker.Item label="Late" value="Late" />
        </Picker>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.subHeaderText}>{getCurrentDate()}</Text>
        <ScrollView style={styles.scrollView}>
          {filteredStudents.map((student, idx) => (
            <View key={idx} style={styles.studentContainer}>
              <Image
                source={getImageSource(student.profile_pic)}
                style={styles.profilePic}
              />
              <View style={styles.studentInfo}>
                <View style={styles.nameAndPicker}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={[styles.statusText, { color: getStatusCircleColor(student.attendanceStatus) }]}>
                    {student.attendanceStatus}
                  </Text>
                  <Picker
                    selectedValue={student.attendanceStatus}
                    style={styles.pickerInline}
                    onValueChange={(itemValue) => handleStatusChange(idx, itemValue)}
                  >
                    <Picker.Item label="Present" value="Present" />
                    <Picker.Item label="Absent" value="Absent" />
                    <Picker.Item label="Late" value="Late" />
                  </Picker>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  headerContainer: {
    backgroundColor: '#A32926',
    height: 110,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 15,
    paddingRight:50
    
  },
  backButton: {
    marginRight: 10,
    padding:10
  },
  header: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 10,
  },
  picker: {
    height: 50,
    width: 120,
    backgroundColor: '#fff',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
  },
  subHeaderText: {
    color: '#A32926',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
    width: '100%',
    paddingRight: 10,
  },
  contentSection: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F2F2F2',
    overflow: 'hidden',
    paddingHorizontal: 10,
  },
  scrollView: {
    width: '100%',
    marginBottom: 20,
  },
  studentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  studentInfo: {
    flex: 1,
  },
  nameAndPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
    flex: 1,
  },
  pickerInline: {
    height: 50,
    width: 60,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 0,
    marginBottom: 0,
  },
});
