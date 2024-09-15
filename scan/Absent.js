import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';

export default function Absent() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id: teacherId } = route.params || {};

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, [teacherId]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://192.168.254.107:3000/students/${teacherId}`, {
        timeout: 10000,
      });

      // Filter students who are absent
      const absentStudents = response.data.data.filter(student => student.attendanceStatus === 'Absent');

      if (absentStudents.length > 0) {
        setStudents(absentStudents); // If there are absent students, display them
      } else {
        // If no absent students, set all students with a 'No Record' status
        const studentsWithNoRecord = response.data.data.map(student => ({
          ...student,
          attendanceStatus: 'No Record',
        }));
        setStudents(studentsWithNoRecord);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
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

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={20} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.header}>
          <Text style={styles.headerText}>Absent Students</Text>
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
                {/* Only display status and icon if attendanceStatus is 'No Record' */}
                {student.attendanceStatus === 'No Record' && (
                  <View style={styles.statusContainer}>
                    <FontAwesome5
                      name="info-circle"
                      size={20}
                      color="gray"
                      style={styles.statusIcon}
                    />
                    <Text style={styles.studentStatus}>No Record</Text>
                  </View>
                )}
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
    paddingRight: 50,
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
    paddingLeft: 10,
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
});
