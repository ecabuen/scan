import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation, useRoute} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

export default function AddStudentScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [gmail, setGmail] = useState(''); //add
  const [profilePic, setProfilePic] = useState(null);
  const route = useRoute();
  const { firstname, lastname,email,id } = route.params || {};
  console.log('Route params:', { firstname, lastname, email, id });
  const handleBack = () => {
    navigation.goBack();
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri); // updated to use the URI from the result
    }
  };

  const uploadImage = async (uri, name, id) => {
    const formData = new FormData();
    const filename = `${name}.jpg`; 

    formData.append('name', name);
    formData.append('gmail', gmail);  //add
    formData.append('profilePic', {
      uri,
      name: filename,
      type: 'image/jpeg',
    });
    formData.append('id', id); 
    try {
      const response = await fetch('http://192.168.254.103:3000/add-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Success', 'Student registered successfully');
        console.log('Student registered:', data);
        setProfilePic(null); //add
        setGmail(null); //add
        setName(null); //add
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        Alert.alert('Error', 'Failed to register student');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to register student');
    }
  };

  const handleRegister = () => {
    if (!profilePic) {
      Alert.alert('Error', 'Please select a profile picture.');
      return;
    }
    uploadImage(profilePic, name, id, gmail); //add
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <Icon name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Student</Text>
          <View style={styles.headerButtonPlaceholder} />
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.uploadBox}>
          <View style={styles.profilePictureContainer}>
            {profilePic ? (
              <Image source={{ uri: profilePic }} style={styles.profilePicture} />
            ) : (
              <Icon name="user-alt" size={100} color="#A32926" />
            )}
          </View>
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Text style={styles.uploadText}>Upload Image</Text>
          </TouchableOpacity>
        </View>
        
        <TextInput
          style={styles.input}
          placeholder="Enter Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput //add
          style={styles.input} //add
          placeholder="Enter gmail"  //add
          value={gmail} //add
          onChangeText={setGmail} //add
        /> 
        <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register</Text>
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
    flex: 1,
    alignItems: 'center',
  },
  uploadBox: {
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  profilePictureContainer: {
    width: 200,
    height: 200,
    borderRadius: 150,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  profilePicture: {
    width: 200,
    height: 200,
    borderRadius: 100,
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
    width: '100%',
  },
  registerButton: {
    backgroundColor: '#A32926',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  registerButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
