import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera } from 'expo-camera';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [hasPermission, setHasPermission] = useState(null);
  const route = useRoute();
  const { firstname, lastname } = route.params || {};
  console.log('Firstname:', firstname);
  console.log('Lastname:', lastname);
  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  const handleProfile = () => {
    navigation.navigate('Profile', {
      firstname,
      lastname,
    });
  };

  const handleCamera = async () => {
    if (hasPermission) {
      navigation.navigate('CameraScreen');
    } else {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log('Camera permission status:', status);
      if (status === 'granted') {
        setHasPermission(true);
        navigation.navigate('CameraScreen');
      } else {
        alert('Camera access is required.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>HOME</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        {/* Your content here */}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity>
          <Image source={require('./images/home.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCamera}>
          <Image source={require('./images/camera.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProfile}>
          <Image source={require('./images/user.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#A32926',
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  logoutButtonText: {
    color: '#A32926',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#A32926',
    paddingVertical: 10,
  },
  icon: {
    width: 50,
    height: 50,
  },
});
