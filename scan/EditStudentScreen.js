import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function EditStudentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { studentName, studentID } = route.params || {}; // Ensure studentId is correctly extracted
  // Receive studentName from navigation params
  const [name, setName] = useState(studentName); // State to manage the editable name

  const handleBack = () => {
    navigation.goBack();
  };

  const handleUpload = () => {
    // Handle upload action here
    alert("Upload action triggered!");
  };

  const handleTakePhoto = () => {
    // Handle take photo action here
    alert("Take photo action triggered!");
  };

  const handleUpdate = () => {
    fetch(`http://192.168.254.103:3000/update-student/${studentID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update student');
      }
      alert(`Student name updated to: ${name}`);
      navigation.goBack();
    })
    .catch(error => {
      console.error('Update failed:', error.message);
      alert('Failed to update student');
    });
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Update Information</Text>
          <View style={styles.headerButtonPlaceholder} />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.uploadBox}>
          <View style={styles.profilePictureContainer}>
            <Icon name="user-alt" size={100} color="#A32926" />
          </View>
          <Text style={styles.name}>{name}</Text>
          <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
            <Text style={styles.uploadText}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleTakePhoto} style={styles.uploadButton}>
            <Text style={styles.uploadText}>Take a Photo</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={text => setName(text)}
        />
        <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
          <Text style={styles.updateButtonText} >Update</Text>
        </TouchableOpacity>
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
    height: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 45,
    paddingHorizontal: 10,
  },
  headerButton: {
    padding: 10,
  },
  headerButtonPlaceholder: {
    width: 40, 
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 20,
    alignItems: 'center', // Center the content horizontally
  },
  uploadBox: {
    marginBottom: 20,
    alignItems: 'center', // Center the children horizontally
    width: '100%', 
  },
  profilePictureContainer: {
    width: 200,
    height: 200,
    borderRadius: 150, // Make sure the radius is half of the width/height to make it a circle
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  name: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#A32926',
    marginBottom: 19,
  },
  uploadButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    alignItems: 'center',
    width: '100%',
  },
  uploadText: {
    fontSize: 16,
    color: '#A32926',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 0.5,
    borderRadius: 13,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    shadowColor: '#939495',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    width: '100%', // Make sure the input takes the full width of the container
  },
  updateButton: {
    backgroundColor: '#A32926',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%', // Make sure the button takes the full width of the container
  },
  updateButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
