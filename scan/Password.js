import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';

export default function ChangePassword() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState(false);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleChangePassword = async () => {
    setPasswordMismatch(newPassword !== retypePassword);
    setPasswordInvalid(!passwordRegex.test(newPassword));
    setCurrentPasswordError(false);

    if (newPassword !== retypePassword || !passwordRegex.test(newPassword)) {
      return;
    }

    try {
      const response = await axios.put(`http://192.168.254.101:3000/change-password/${id}`, {
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Password changed successfully');
        navigation.goBack();
      } else {
        setCurrentPasswordError(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setCurrentPasswordError(true);
      } else {
        Alert.alert('Error', 'Failed to change password');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Password</Text>
          <View style={[styles.passwordContainer, currentPasswordError && styles.inputError]}>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry={!showCurrentPassword}
            />
            <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
              <Icon name={showCurrentPassword ? "eye-slash" : "eye"} size={20} color="#A32926" />
            </TouchableOpacity>
          </View>
          {currentPasswordError && (
            <Text style={styles.errorText}>Incorrect current password</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={[styles.passwordContainer, (passwordMismatch || passwordInvalid) && styles.inputError]}>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
            />
            <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
              <Icon name={showNewPassword ? "eye-slash" : "eye"} size={20} color="#A32926" />
            </TouchableOpacity>
          </View>
          {passwordInvalid && (
            <Text style={styles.errorText}>Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one digit, and one special character.</Text>
          )}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Retype Password</Text>
          <View style={[styles.passwordContainer, passwordMismatch && styles.inputError]}>
            <TextInput
              style={styles.input}
              value={retypePassword}
              onChangeText={setRetypePassword}
              secureTextEntry={!showRetypePassword}
            />
            <TouchableOpacity onPress={() => setShowRetypePassword(!showRetypePassword)}>
              <Icon name={showRetypePassword ? "eye-slash" : "eye"} size={20} color="#A32926" />
            </TouchableOpacity>
          </View>
          {passwordMismatch && (
            <Text style={styles.errorText}>Passwords do not match</Text>
          )}
        </View>
        <TouchableOpacity style={styles.updateButton} onPress={handleChangePassword}>
          <Text style={styles.updateButtonText}>Update Password</Text>
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
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    alignItems: 'center',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 17,
  },
  inputError: {
    borderBottomColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  updateButton: {
    backgroundColor: '#A32926',
    padding: 15,
    borderRadius: 5,
  },
  updateButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
