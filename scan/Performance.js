import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';

export default function Performance() {
  const navigation = useNavigation();
  const route = useRoute();
  const { teacherId } = route.params;

  const [topPresentStudents, setTopPresentStudents] = useState([]);
  const [topLateStudents, setTopLateStudents] = useState([]);
  const [topAbsentStudents, setTopAbsentStudents] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('present');
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('month');

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const presentResponse = await axios.get(`http://192.168.254.100:3000/attendance/most-present-student-filter`, {
          params: { teacher_Id: teacherId, filter: selectedTimeFrame }
        });
        const lateResponse = await axios.get(`http://192.168.254.100:3000/attendance/most-late-student-filter`, {
          params: { teacher_Id: teacherId, filter: selectedTimeFrame }
        });
        const absentResponse = await axios.get(`http://192.168.254.100:3000/attendance/most-absent-student-filter`, {
          params: { teacher_Id: teacherId, filter: selectedTimeFrame }
        });

        setTopPresentStudents(presentResponse.data.data);
        setTopLateStudents(lateResponse.data.data);
        setTopAbsentStudents(absentResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [teacherId, selectedTimeFrame]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Student Performance</Text>
        </View>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedFilter}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedFilter(itemValue)}
        >
          <Picker.Item label="Present" value="present" />
          <Picker.Item label="Late" value="late" />
          <Picker.Item label="Absent" value="absent" />
        </Picker>
        <Picker
          selectedValue={selectedTimeFrame}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedTimeFrame(itemValue)}
        >
          <Picker.Item label="This Week" value="week" />
          <Picker.Item label="This Month" value="month" />
        </Picker>
      </View>

      <ScrollView style={styles.studentContainer}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title numeric>
              {selectedFilter === 'present'
                ? 'Present Count'
                : selectedFilter === 'late'
                ? 'Late Count'
                : 'Absent Count'}
            </DataTable.Title>
          </DataTable.Header>

          {(selectedFilter === 'present'
            ? topPresentStudents
            : selectedFilter === 'late'
            ? topLateStudents
            : topAbsentStudents
          ).map((student, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{student.student_name}</DataTable.Cell>
              <DataTable.Cell numeric>
                {selectedFilter === 'present'
                  ? student.present_count
                  : selectedFilter === 'late'
                  ? student.late_count
                  : student.absent_count}
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
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
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 10,
    paddingRight: 100,
  },
  headerButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: '48%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  studentContainer: {
    padding: 10,
  },
});
