import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Report() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id: teacherId } = route.params || {};

  const [students, setStudents] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [teacherId]);

  // Adjusted fetchStudents function to fetch attendance status
  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://192.168.254.125:3000/students/${teacherId}`, {
        timeout: 10000,
      });
      const fetchedStudents = response.data.data.map(student => ({
        ...student,
        attendanceStatus: student.status === 'Present' ? 'Present' : 'Absent', // Assuming 'status' holds 'Present' or 'Absent'
      }));
      setStudents(fetchedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const onChangeStartDate = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const openStartDatePicker = () => {
    setShowStartDatePicker(true);
  };

  const openEndDatePicker = () => {
    setShowEndDatePicker(true);
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Attendance Report</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
      <ScrollView style={styles.scrollView}>
  {students.map((student, idx) => (
    <View key={idx} style={styles.studentContainer}>
      <FontAwesome5
        name="user-alt"
        size={45}
        color="#A32926"
        style={styles.profilePic}
      />
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{student.name}</Text>
        <View style={styles.statusContainer}>
          <FontAwesome5
            name={student.attendanceStatus === 'Present' ? 'check' : 'times'}
            size={24}
            color={student.attendanceStatus === 'Present' ? 'green' : 'red'}
            style={styles.statusIcon}
          />
          <Text style={[styles.studentStatus, { color: student.attendanceStatus === 'Present' ? 'green' : 'red' }]}>
            {student.attendanceStatus}
          </Text>
        </View>
      </View>
    </View>
  ))}
</ScrollView>

      </View>

      {/* Date Pickers and Export Button Section */}
      <View style={styles.dateFilterContainer}>
        <TouchableOpacity style={styles.datePickerButton} onPress={openStartDatePicker}>
          <Text style={styles.datePickerButtonText}>{startDate.toDateString()}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onChangeStartDate}
          />
        )}
        <TouchableOpacity style={styles.datePickerButton} onPress={openEndDatePicker}>
          <Text style={styles.datePickerButtonText}>{endDate.toDateString()}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onChangeEndDate}
          />
        )}
      </View>

      <TouchableOpacity style={styles.exportButton} onPress={() => {}}>
        <Text style={styles.exportButtonText}>Export to CSV</Text>
      </TouchableOpacity>
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
  },
  backButton: {
    marginRight: 10,
  },
  header: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: 'bold',
  },
  contentSection: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
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
    justifyContent: 'space-between',
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
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  studentStatus: {
    fontSize: 16,
    color: '#666',
  },
  dateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 20,
  },
  datePickerButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  exportButton: {
    backgroundColor: '#A32926',
    paddingVertical: 15,
    paddingHorizontal: 25,
    elevation: 3,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
  flexDirection: 'row',
  alignItems: 'center',
},
  statusIcon: {
  marginRight: 5,
},
});
