import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

export default function RegisterStudent() {
  const navigation = useNavigation();
  const route = useRoute();
  const { firstname, lastname, email, id } = route.params || {};
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://192.168.0.220:3000/students/${id}`);
      if (response.status === 200) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error.message);
      // Handle error fetching students
    }
  };

  // Fetch students initially and on focus
  useFocusEffect(
    useCallback(() => {
      fetchStudents();
    }, [])
  );

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAdd = () => {
    navigation.navigate('AddStudentScreen', {
      firstname,
      lastname,
      email,
      id
    });
  };

  const handleEdit = (studentName, studentID, gmail) => {
    navigation.navigate('EditStudentScreen', {
      studentName,
      studentID,
      studentGmail: gmail
    });
  };

  const handleDelete = (studentID) => {
    Alert.prompt(
      "Enter Password",
      "Please enter your password to confirm deletion:",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "OK",
          onPress: async (password) => {
            try {
              const response = await axios.post('http://192.168.0.220:3000/verify-password-and-delete', {
                userId: id, // Assuming you have the userId available in the context or state
                password,
                studentID
              });
  
              if (response.status === 200) {
                fetchStudents(); // Refresh the student list
              } else {
                Alert.alert("Error", response.data.message);
              }
            } catch (error) {
              if (error.response && error.response.status === 401) {
                Alert.alert("Error", "Incorrect password. Please try again.");
              } else {
                console.error('Error deleting student:', error.message);
                // Handle other errors deleting student
                Alert.alert("Error", "Failed to delete student. Please try again.");
              }
            }
          }
        }
      ],
      "secure-text" // Use secure-text to hide the password input
    );
  };

  const filteredStudents = students.filter(student => {
    return student.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Section 1</Text>
          <TouchableOpacity onPress={handleAdd} style={styles.headerButton}>
            <Icon name="plus" size={15} style={styles.addButton} />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        style={styles.search}
        placeholder="🔍 Search"
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
      />
      <ScrollView contentContainerStyle={styles.studentContainer}>
        {filteredStudents.map((student, index) => (
          <View key={index} style={styles.studentCard}>
            <Icon name="user-alt" size={20} color="#A32926" style={styles.icon} />
            <Text style={styles.name}>{student.name}</Text>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(student.name, student.studentID, student.gmail)}>
              <Icon name="edit" size={20} color="#A32926" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(student.studentID)}>
              <Icon name="trash" size={20} color="#A32926" />
            </TouchableOpacity>
          </View>
        ))}
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 10,
  },
  headerButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  search: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 0.5,
    borderRadius: 13,
    margin: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    shadowColor: '#939495',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.9,
    shadowRadius: 2,
    elevation: 5,
  },
  addButton: {
    color: "#A32926",
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  studentContainer: {
    padding: 20,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 19,
    borderWidth: 0.5,
    borderColor: '#ccc',
    borderRadius: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    height: 85,
    shadowColor: '#939495',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: '#A32926',
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {},
});
