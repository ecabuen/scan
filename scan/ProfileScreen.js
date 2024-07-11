import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProfileScreen() {
  const navigation = useNavigation();

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

  const handleHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>PROFILE</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileContainer}>
          <Image source={require('./images/profile.png')} style={styles.profileImage} />
          <View style={styles.nameContainer}>
            <Text style={styles.profileText}>NAME:</Text>
            <TouchableOpacity style={styles.editButton}>
              <Image source={require('./images/edit.png')} style={styles.editIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={styles.option}>
            <Image source={require('./images/report.png')} style={styles.optionIcon} />
            <Text style={styles.optionText}>REPORT</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={styles.option}>
            <Image source={require('./images/register.png')} style={styles.optionIcon} />
            <Text style={styles.optionText}>REGISTER STUDENT</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={styles.option}>
            <Image source={require('./images/classlist.png')} style={styles.optionIcon} />
            <Text style={styles.optionText}>CLASS LIST</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={styles.option}>
            <Image source={require('./images/settings.png')} style={styles.optionIcon} />
            <Text style={styles.optionText}>SETTINGS</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer Section */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={handleHome}>
          <Image source={require('./images/home.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require('./images/camera.png')} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity>
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
  profileSection: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    marginLeft: 20,
  },
  editIcon: {
    width: 20,
    height: 20,
  },
  contentSection: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  optionContainer: {
    width: '45%',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  option: {
    alignItems: 'center',
  },
  optionIcon: {
    width: 80,
    height: 80,
  },
  optionText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
