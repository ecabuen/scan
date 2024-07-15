import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons'; // Import FontAwesome5 for user-alt icon

const data = [
  {
    name: 'Harvey Specter',
    attendance: ['A', 'P', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'P', 'A', 'P', 'P', 'P', 'P', 'A', 'A', 'A', 'A', 'A', 'A', 'P', 'A', 'P', 'P', 'A', 'P'],
  },
  {
    name: 'Mike Ross',
    attendance: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  },
  {
    name: 'Monica Geller',
    attendance: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  },
  {
    name: 'Kit Harington',
    attendance: ['A', 'P', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'P', 'A', 'P', 'P', 'P', 'P', 'A', 'A', 'A', 'A', 'A', 'A', 'P', 'A', 'P', 'P', 'A', 'P'],
  },
  {
    name: 'Ross Geller',
    attendance: ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  },
  {
    name: 'Peter Dinkledge',
    attendance: ['A', 'P', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'P', 'A', 'P', 'P', 'P', 'P', 'A', 'A', 'A', 'A', 'A', 'A', 'P', 'A', 'P', 'P', 'A', 'P'],
  }
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [filteredData, setFilteredData] = useState(data);

  const onChangeStartDate = (event, selectedDate) => {
    setShowStartDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setStartDate(selectedDate);
      filterDataByDate(selectedDate, endDate);
    }
  };

  const onChangeEndDate = (event, selectedDate) => {
    setShowEndDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEndDate(selectedDate);
      filterDataByDate(startDate, selectedDate);
    }
  };

  const generateCSV = async () => {
    const headers = ['Name', ...Array.from({ length: filteredData[0].attendance.length }, (_, i) => `Day ${i + 1}`)];
    const rows = filteredData.map(item => [item.name, ...item.attendance]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

    const path = FileSystem.documentDirectory + 'AttendanceReport.csv';
    await FileSystem.writeAsStringAsync(path, csvContent);

    await Sharing.shareAsync(path);
  };

  const filterDataByDate = (start, end) => {
    const startIndex = start.getDate() - 1;
    const endIndex = end.getDate() - 1;

    const filtered = data.map(student => ({
      name: student.name,
      attendance: student.attendance.slice(startIndex, endIndex + 1),
    }));

    setFilteredData(filtered);
  };

  return (
    <View style={styles.container}>
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
          {filteredData.map((student, idx) => (
            <View key={idx} style={styles.studentContainer}>
              <FontAwesome5
                name="user-alt"
                size={24}
                color="#A32926"
                style={styles.profilePic}
              />
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentStatus}>
                  {student.attendance[student.attendance.length - 1] === 'A' ? 'Absent' : 'Present'}
                </Text>
              </View>
              <FontAwesome5
                name={student.attendance[student.attendance.length - 1] === 'A' ? 'times' : 'check'}
                size={24}
                color={student.attendance[student.attendance.length - 1] === 'A' ? 'red' : 'green'}
                style={styles.statusIcon}
              />
            </View>
          ))}
        </ScrollView>

        <View style={styles.dateFilterContainer}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerLabel}>Start Date:</Text>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.datePickerButton}>
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
          </View>
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerLabel}>End Date:</Text>
            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.datePickerButton}>
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
        </View>

        <TouchableOpacity onPress={generateCSV} style={styles.button}>
          <Text style={styles.buttonText}>Export to CSV</Text>
        </TouchableOpacity>
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
    flexDirection: 'row', // Added to align items horizontally
    alignItems: 'center',
    paddingTop: 40,
    
    paddingHorizontal: 20, // Added for spacing
  },
  backButton: {
    marginRight: 10, // Add some space between the back icon and the title
  },
  header: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    alignItems: "center",
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
  statusIcon: {
    marginLeft: 10,
  },
  button: {
    marginTop: 20,
    paddingVertical: 15,
    paddingHorizontal: 25,
    backgroundColor: '#A32926',
    borderRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    justifyContent: 'center',
    width: '100%',
  },
  datePickerContainer: {
    marginHorizontal: 10,
  },
  datePickerLabel: {
    marginBottom: 5,
    color: '#333',
    fontSize: 16,
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
    color: '#333',
    fontSize: 16,
  },
});
