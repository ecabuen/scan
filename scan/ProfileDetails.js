import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function ProfileDetails() {
  const navigation = useNavigation();
  const route = useRoute();
  const { firstname, lastname, email, id } = route.params;

  const [firstName, setFirstName] = useState(firstname);
  const [lastName, setLastName] = useState(lastname);
  const [userEmail, setUserEmail] = useState(email);
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri, id) => {
    const formData = new FormData();
    
    formData.append('firstname', firstName);
    formData.append('lastname', lastName);
    formData.append('email', userEmail);
  
    if (uri) {
      const filename = `${id}.jpg`; // Change filename to teacherid.jpg
      formData.append('profilePic', {
        uri,
        name: filename,
        type: 'image/jpeg',
      });
    }
    
    formData.append('id', id);
  
    try {
      const response = await axios.put(`http://192.168.254.101:3000/update-profile/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully');
        console.log('Profile updated:', response.data);
        navigation.goBack();
      } else {
        console.error('Error response:', response.data);
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };
  
  const handleUpdate = async () => {
    await uploadImage(profileImage, id);
    navigation.navigate('ProfileScreen', {
      firstname: firstName,
      lastname: lastName,
      email: userEmail,
      id: id
    });
  };
  
  const getImageSource = () => {
    try {
      const images = require.context('./teacherimages', false, /\.jpg$/);
      const imageName = `./${id}.jpg`; // Use teacherid.jpg for fetching image
      return images(imageName);
    } catch (error) {
      console.warn(`Image not found: ${id}.jpg. Using default image.`);
      return userIcon; 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile Details</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImage}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Image source={getImageSource()} style={styles.profileImage}/>
            )}
            <View style={styles.editIconContainer}>
              <Icon name="edit" size={20} color="#FFF" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={userEmail}
            onChangeText={setUserEmail}
          />
        </View>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.updateButtonText}>Update Profile</Text>
      </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A32926',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#A32926',
    marginTop: 40,
  },
  headerButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    paddingRight:125
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#A32926',
    borderRadius: 15,
    padding: 5,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: '#A32926',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    fontSize: 17,
  },
  updateButton: {
    backgroundColor: '#A32926',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginTop:10
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
