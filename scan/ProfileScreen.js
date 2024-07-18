import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';


import { Camera } from 'expo-camera';


const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { firstname, lastname,email, id } = route.params || {};
  const [hasPermission, setHasPermission] = useState(null);
  const [activeIcon, setActiveIcon] = useState('profile');

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
      setActiveIcon('camera');
      navigation.navigate('CameraScreen');
    } else {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        setActiveIcon('camera');
        navigation.navigate('CameraScreen');
      } else {
        alert('Camera access is required.');
      }
    }
  };
  const handleRegister = () => {
    
      console.log('Login successful:', { firstname, lastname, email, id }); 
    navigation.navigate('RegisterStudentScreen', {

      firstname,
      lastname,
      email,
      id
    });
  };

  const handleHome = () => {
    navigation.navigate('Home', {
      firstname,
      lastname,
      email,
      id
    });
  };
  const handleProfileDetails = () => {
    navigation.navigate('ProfileDetails', {
      firstname,
      lastname,
      email,
      id
    });
  };
  const handleReport = () => {
    navigation.navigate('Report', {
      id
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Image source={require('./images/user-icon.png')} style={styles.logo} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{firstname} {lastname}</Text>
            <Text style={styles.headerDate}>{email}</Text>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <TouchableOpacity style={styles.option} onPress={handleRegister}>
          <Icon name="user-plus" size={25} color="#A32926" style={styles.optionIcon} />
          <Text style={styles.optionText}> Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleReport}>
          <Icon name="file-alt" size={25} color="#A32926" style={styles.optionIcon} />
          <Text style={styles.optionText}>    Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleProfileDetails}>
          <Icon name="user-edit" size={25} color="#A32926" style={styles.optionIcon}  />
          <Text style={styles.optionText}> Profile Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.option} onPress={handleLogout}>
          <Icon name="sign-out-alt" size={25} color="#A32926" style={styles.optionIcon} />
          <Text style={styles.optionText}>   Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Section */}
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
    borderRadius: 25,
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


