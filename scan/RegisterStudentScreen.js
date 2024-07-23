import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, Image, Platform } from 'react-native';
import Dialog from 'react-native-dialog';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
//npm install react-native-dialog
export default function RegisterStudent() {
  const navigation = useNavigation();
  const route = useRoute();
  const { firstname, lastname, email, id } = route.params || {};
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [password, setPassword] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`http://192.168.254.101:3000/students/${id}`);
      if (response.status === 200) {
        setStudents(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error.message);
    }
  };

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

  const handleEdit = (studentName, studentID, gmail, profilePic) => {
    navigation.navigate('EditStudentScreen', {
      studentName,
      studentID,
      studentGmail: gmail,
      studentProfilePic: profilePic,
    });
  };

  const handleDelete = (studentID) => {
    if (Platform.OS === 'android') {
      setDeleteStudentId(studentID);
      setDialogVisible(true);
    } else {
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
              await deleteStudent(studentID, password);
            }
          }
        ],
        "secure-text"
      );
    }
  };

  const deleteStudent = async (studentID, password) => {
    try {
      const response = await axios.post('http://192.168.254.101:3000/verify-password-and-delete', {
        userId: id,
        password,
        studentID
      });

      if (response.status === 200) {
        fetchStudents();
        Alert.alert("Success", "Deleted successfully");
      } else {
        Alert.alert("Error", response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert("Error", "Incorrect password. Please try again.");
      } else {
        console.error('Error deleting student:', error.message);
        Alert.alert("Error", "Failed to delete student. Please try again.");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteStudentId !== null) {
      await deleteStudent(deleteStudentId, password);
      setDialogVisible(false);
      setPassword('');
      setDeleteStudentId(null);
    }
  };

  const filteredStudents = students.filter(student => {
    return student.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

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
        placeholder="🔍 Search by name"
        value={searchTerm}
        onChangeText={text => setSearchTerm(text)}
      />
      <ScrollView contentContainerStyle={styles.studentContainer}>
        {filteredStudents.map((student, index) => (
          <View key={index} style={styles.studentCard}>
            <Image
              source={getImageSource(student.profile_pic)}
              style={styles.studentImage}
            />
            <Text style={styles.name}>{student.name} </Text>
            <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(student.name, student.studentID, student.gmail, student.profile_pic)}>
              <Icon name="edit" size={18} color="#A32926" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(student.studentID)}>
              <Icon name="trash" size={18} color="#A32926" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Dialog.Container visible={dialogVisible}>
        <Dialog.Title>Enter Password</Dialog.Title>
        <Dialog.Input
          secureTextEntry
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
        />
        <Dialog.Button label="Cancel" onPress={() => setDialogVisible(false)} />
        <Dialog.Button label="OK" onPress={handleConfirmDelete} />
      </Dialog.Container>
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
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    margin: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    // shadowColor: '#939495',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.9,
    // shadowRadius: 2,
    // elevation: 5,
  },
  addButton: {
    color: "#A32926",
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  studentContainer: {
    padding: 10,
  },
  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    height:75
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  editButton: {
    marginRight: 10,
  },
  deleteButton: {
    marginRight: 10,
  },
});
