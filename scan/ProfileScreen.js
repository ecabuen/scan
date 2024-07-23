import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Camera } from 'expo-camera';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { firstname, lastname, email, id } = route.params || {};
  const [hasPermission, setHasPermission] = useState(null);
  const [profile, setProfile] = useState({ firstname, lastname, email });

  useFocusEffect(
    useCallback(() => {
      // This will run every time the screen comes into focus
      if (id) {
        // Fetch updated profile data from your server or state management
        // Example:
        // axios.get(`http://yourserver.com/profile/${id}`)
        //   .then(response => setProfile(response.data))
        //   .catch(error => console.error(error));
      }
    }, [id])
  );

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ],
      { cancelable: false }
    );
  };

  const handleCamera = async () => {
    if (hasPermission) {
      navigation.navigate('CameraScreen');
    } else {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        navigation.navigate('CameraScreen');
      } else {
        alert('Camera access is required.');
      }
    }
  };

  const handleRegister = () => {
    navigation.navigate('RegisterStudentScreen', {
      firstname: profile.firstname,
      lastname: profile.lastname,
      email: profile.email,
      id
    });
  };

  const handleHome = () => {
    navigation.navigate('Home', {
      firstname: profile.firstname,
      lastname: profile.lastname,
      email: profile.email,
      id
    });
  };

  const handleProfileDetails = () => {
    navigation.navigate('ProfileDetails', {
      firstname: profile.firstname,
      lastname: profile.lastname,
      email: profile.email,
      id
    });
  };

  const handleReport = () => {
    navigation.navigate('Report', { id });
  };

  const handleAttendance = () => {
    navigation.navigate('Attendance', { id });
  };

  const handlePassword = () => {
    navigation.navigate('Password', {
      id
    });
  };

  const getImageSource = () => {
    try {
      const images = require.context('./teacherimages', false, /\.jpg$/);
      const imageName = `./${profile.firstname}-${profile.lastname}.jpg`;
      return images(imageName);
    } catch (error) {
      console.warn(`Image not found: ${profile.firstname}-${profile.lastname}.jpg. Using default image.`);
      return userIcon;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Image source={getImageSource()} style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{profile.firstname} {profile.lastname}</Text>
            <Text style={styles.headerDate}>{profile.email}</Text>
          </View>
        </View>
      </View>

      <View style={styles.contentSection}>
        <TouchableOpacity style={styles.option} onPress={handleRegister}>
          <Icon name="user-plus" size={25} color="#A32926" style={styles.optionIcon} />
          <Text style={styles.optionText}> Student Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleAttendance}>
          <Icon name="calendar-check" size={25} color="#A32926" style={styles.optionIcon}  />
          <Text style={styles.optionText}>   Attendance Management</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleReport}>
          <Icon name="file-alt" size={25} color="#A32926" style={styles.optionIcon} />
          <Text style={styles.optionText}>    Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleProfileDetails}>
          <Icon name="user-edit" size={25} color="#A32926" style={styles.optionIcon}  />
          <Text style={styles.optionText}>Profile Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handlePassword}>
          <Icon name="lock" size={25} color="#A32926" style={styles.optionIcon}  />
          <Text style={styles.optionText}> Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Icon name="sign-out-alt" size={25} color="#A32926" style={styles.optionIcon} />
          <Text style={styles.optionText}>  Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.footer}>
          <TouchableOpacity onPress={handleHome} style={styles.iconWrapper}>
            <Icon name="tachometer-alt" size={35} color="#A32926" style={styles.icon} />
          </TouchableOpacity>
          <View style={styles.cameraButtonWrapper}>
            <TouchableOpacity onPress={handleCamera} style={styles.cameraButton}>
              <Icon name="camera" size={40} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={[styles.iconWrapper, styles.active]}>
            <Icon name="user-alt" size={35} color="#A32926" style={styles.icon} />
          </TouchableOpacity>
        </View>
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
    height: 200,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginTop: 60,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginLeft: 20,
  },
  headerTextContainer: {
    marginLeft: 10,
    alignItems: 'left',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerDate: {
    color: '#fff',
    fontSize: 12,
  },
  contentSection: {
    paddingVertical: 20,
    backgroundColor: '#F2F2F2',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    marginTop: -50,
    zIndex: 1,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor:  '#e0e0e0',
  },
  optionIcon: {
    marginRight: 10,
    marginLeft: 20,
  },
  optionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color:"#000"
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    alignItems: 'center',
    paddingVertical: 0.1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderTopColor:'#000',
    elevation: 10,
    zIndex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',

  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  cameraButtonWrapper: {
    paddingRight:15,
    bottom: 25,
    zIndex: 10,
    alignSelf: 'center'
    
  },
  cameraButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#A32926',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  icon: {
    width: 40,
    height: 40,
  },
  active: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 5,
  },
});
