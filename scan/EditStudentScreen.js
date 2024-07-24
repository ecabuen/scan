import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function EditStudentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { studentName, studentID, studentGmail, gender, studentProfilePic } = route.params || {};
  const [name, setName] = useState(studentName || '');
  const [gmail, setGmail] = useState(studentGmail || '');
  const [studentGender, setGender] = useState(gender || '');
  const [profilePic, setProfilePic] = useState(studentProfilePic || '');
  const [selectedImageUri, setSelectedImageUri] = useState('');

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
      setProfilePic(result.assets[0].uri); // Update the profilePic state with the new image URI
      setSelectedImageUri(result.assets[0].uri); // Store the selected image URI in a separate state
    }
  };

  const handleUpdate = async () => {
    if (!name || !gmail) {
      Alert.alert('Error', 'Field must not be empty');
      return;
    }

    const updateData = {};
    updateData.name = name;
    updateData.gmail = gmail;
    updateData.gender = studentGender;

    if (selectedImageUri) { // If a new image has been selected
      const formData = new FormData();
      const filename = `${name}.jpg`;

      formData.append('name', name);
      formData.append('gmail', gmail);
      formData.append('gender', studentGender);
      formData.append('profilePic', {
        uri: selectedImageUri,
        name: filename,
        type: 'image/jpeg',
      });

      try {
        const imageResponse = await fetch('http://192.168.254.115:3000/upload-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (!imageResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const imageData = await imageResponse.json();
        if (imageData.status === 'success') {
          updateData.profilePic = filename;
        }
      } catch (error) {
        console.error('Image upload failed:', error.message);
        alert('Failed to upload image');
        return;
      }
    } else {
      updateData.profilePic = studentProfilePic;
    }

    try {
      const response = await fetch(`http://192.168.254.115:3000/update-student/${studentID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update student');
      }

      const data = await response.json();
      alert(data.message);
      navigation.goBack();
    } catch (error) {
      console.error('Update failed:', error.message);
      alert('Failed to update student');
    }
  };

  const getImageSource = () => {
    if (selectedImageUri) {
      return { uri: selectedImageUri };
    } else if (profilePic.startsWith('http')) {
      return { uri: profilePic };
    } else {
      try {
        const images = require.context('./studentimages', false, /\.jpg$/);
        const imageName = `./${profilePic}`;
        return images(imageName);
      } catch (error) {
        console.warn(`Image not found: ${profilePic}. Using default image.`);
        return require('./images/empty.jpg');
      }
    }
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
            <Image
              source={getImageSource()}
              style={styles.profilePicture}
            />
          </View>
          <Text style={styles.name}>{name}</Text>
          <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
            <Text style={styles.uploadText}>Upload Image</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Gmail"
          value={gmail}
          onChangeText={text => setGmail(text)}
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={studentGender}
            onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
          </Picker>
        </View>
        <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Update</Text>
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
    borderRadius: 100,
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
    width: '100%',
  },
  pickerContainer: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 0.5,
    borderRadius: 13,
    marginBottom: 20,
    backgroundColor: '#fff',
    width: '100%',
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
  },
  updateButton: {
    backgroundColor: '#A32926',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  updateButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
