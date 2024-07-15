import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Camera } from 'expo-camera';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { firstname, lastname, email,id } = route.params || {};
  const [activeIcon, setActiveIcon] = useState('profile'); // Added state for active icon
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleProfile = () => {
    setActiveIcon('profile');
    navigation.navigate('Profile', {
      firstname,
      lastname,
      email,
      id
    });
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

  

  const totalStudents = 30;
  const presentStudents = 28;
  const absentStudents = totalStudents - presentStudents;

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Dashboard</Text>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.dashboardCard}>
          <Icon name="users" size={30} color="#A32926" />
          <View style={styles.dashboardCardContent}>
            <Text style={styles.dashboardCardLabel}>Total Students</Text>
            <Text style={styles.dashboardCardValue}>{totalStudents}</Text>
          </View>
        </View>
        <View style={styles.dashboardCard}>
          <Icon name="user-check" size={30} color="#A32926" />
          <View style={styles.dashboardCardContent}>
            <Text style={styles.dashboardCardLabel}>Present</Text>
            <Text style={styles.dashboardCardValue}>{presentStudents}</Text>
          </View>
        </View>
        <View style={styles.dashboardCard}>
          <Icon name="user-times" size={30} color="#A32926" />
          <View style={styles.dashboardCardContent}>
            <Text style={styles.dashboardCardLabel}>Absent</Text>
            <Text style={styles.dashboardCardValue}>{absentStudents}</Text>
          </View>
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footerContainer}>
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.iconWrapper]}>
            <Icon name="tachometer-alt" size={35} color="#A32926" style={styles.icon} />
          </TouchableOpacity>
          <View style={styles.cameraButtonWrapper}>
            <TouchableOpacity onPress={handleCamera} style={styles.cameraButton}>
              <Icon name="camera" size={40} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleProfile} style={[styles.active]}>
            <Icon name="user-alt" size={35}  color="#A32926" style={styles.icon} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F2F2F2',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    overflow: 'hidden',
    marginTop: -50,
    zIndex: 1,
  },
  dashboardCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  dashboardCardContent: {
    marginLeft: 10,
  },
  dashboardCardLabel: {
    fontSize: 18,
    color: '#333',
  },
  dashboardCardValue: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 5,
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
    borderTopColor: '#000',
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
    alignSelf: 'center',
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
