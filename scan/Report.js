import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import Papa from 'papaparse';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://192.168.254.107:3000/students/${teacherId}`, {
        timeout: 10000,
      });
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchFilteredStudents = async (startDate, endDate) => {
    try {
      const response = await axios.get(`http://192.168.254.107:3000/students/${teacherId}/filter`, {
        params: {
          startDate: formatDateForAPI(startDate),
          endDate: formatDateForAPI(endDate),
        },
        timeout: 10000,
      });
      setStudents(response.data.data);
    } catch (error) {
      console.error('Error fetching filtered students:', error.response || error.message);
    }
  };

  const onChangeStartDate = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      fetchFilteredStudents(selectedDate, endDate);
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
      fetchFilteredStudents(startDate, selectedDate);
    }
  };

  const openStartDatePicker = () => {
    setShowStartDatePicker(true);
  };

  const openEndDatePicker = () => {
    setShowEndDatePicker(true);
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

  const formatDateForRange = (date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0]; // Format to YYYY-MM-DD
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const exportToCSV = async () => {
    if (students.length === 0) {
      Alert.alert('No data', 'There are no students to export.');
      return;
    }
  
    // Create a list of dates in the date range
    const dateRange = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dateRange.push(formatDateForRange(new Date(d))); // Format to DD/MM/YYYY
    }
  
    // Create a map to store attendance records
    const attendanceMap = {};
  
    students.forEach(student => {
      if (!attendanceMap[student.name]) {
        attendanceMap[student.name] = { Name: student.name };
      }
  
      const date = formatDate(student.attendanceDate);
      if (dateRange.includes(date)) {
        attendanceMap[student.name][date] = student.attendanceStatus || 'Absent';
      }
    });
  
    // Fill in missing dates with 'Absent'
    Object.keys(attendanceMap).forEach(name => {
      dateRange.forEach(date => {
        if (attendanceMap[name][date] === undefined) {
          attendanceMap[name][date] = 'No Record';
        }
      });
    });
  
    // Convert map to an array of records
    const csvData = Object.values(attendanceMap);
  
    // Convert data to CSV
    const csv = Papa.unparse(csvData, { columns: ['Name', ...dateRange] });
  
    console.log('CSV Data:', csv);
  
    // Save CSV file and share
    const fileUri = FileSystem.documentDirectory + 'students_report.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv);
  
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert('Sharing not available', 'Cannot share the file.');
    }
  };
  

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#FFF" />
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
        <Image
          source={getImageSource(student.profile_pic)}
          style={styles.profilePic}
        />
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>{student.name}</Text>
          <View style={styles.statusContainer}>
            <FontAwesome5
              name={
                student.attendanceStatus === 'Present'
                  ? 'check'
                  : student.attendanceStatus === 'Late'
                  ? 'clock'
                  : student.attendanceStatus === 'Excused'
                  ? 'hand-paper'
                  : student.attendanceStatus === 'Absent'
                  ? 'times'
                  : student.attendanceStatus === 'No Record' || student.attendanceStatus === undefined
                  ? 'info-circle'
                  : 'info-circle' // Default to info-circle if the status is unknown
              }
              size={20}
              color={
                student.attendanceStatus === 'Present'
                  ? 'green'
                  : student.attendanceStatus === 'Late'
                  ? 'orange'
                  : student.attendanceStatus === 'Excused'
                  ? 'blue' // or 'lightblue'
                  : student.attendanceStatus === 'Absent'
                  ? 'red'
                  : student.attendanceStatus === 'No Record' || student.attendanceStatus === undefined
                  ? 'gray'
                  : 'gray' // Default to gray if the status is unknown
              }
              style={styles.statusIcon}
            />
            <Text
              style={[
                styles.studentStatus,
                {
                  color:
                    student.attendanceStatus === 'Present'
                      ? 'green'
                      : student.attendanceStatus === 'Late'
                      ? 'orange'
                      : student.attendanceStatus === 'Excused'
                      ? 'blue' // or 'lightblue'
                      : student.attendanceStatus === 'Absent'
                      ? 'red'
                      : student.attendanceStatus === 'No Record' || student.attendanceStatus === undefined
                      ? 'gray'
                      : 'gray', // Default to gray if the status is unknown
                },
              ]}
            >
              {student.attendanceStatus || 'No Record'}
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

      <TouchableOpacity style={styles.exportButton} onPress={exportToCSV}>
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
    paddingRight:50
    
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
    fontSize: 20,
    fontWeight: 'bold',
    paddingLeft:10,
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
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginRight: 5,
  },
  studentStatus: {
    fontSize: 16,
  },
  dateFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  datePickerButton: {
    backgroundColor: '#A32926',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  datePickerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  exportButton: {
    backgroundColor: '#A32926',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    margin: 20,
    
    
  },
  exportButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
