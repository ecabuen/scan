import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; 
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    // Input validation
    if (!firstname || !lastname || !email || !password) {
      Alert.alert('Registration failed', 'All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.100:3000/register', {
        firstname, 
        lastname, 
        email,
        password,
      });

      if (response.status === 201) {
        Alert.alert('Registration successful');
        navigation.navigate('Login');
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Registration failed', error.response.data);
      } else if (error.request) {
        Alert.alert('Registration failed', 'No response from server');
      } else {
        Alert.alert('Registration failed', 'Error', error.message);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.logoContainer}>
        <Image
          source={require('./images/bsu.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.registerText}>Create an Account</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="#A32926" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            placeholderTextColor="#999"
            value={firstname}
            onChangeText={setFirstName}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name="user" size={20} color="#A32926" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            placeholderTextColor="#999"
            value={lastname}
            onChangeText={setLastName}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={20} color="#A32926" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#A32926" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#A32926",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  logoContainer: {
    position: 'absolute',
    top: 100,
    width: 110,
    height: 115,
   // backgroundColor: "#fff",
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  logo: {
    width: 110,
    height: 105,
  },
  container: {
    width: "100%",
    height: "70%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
    alignItems: "center",
  },
  registerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#A32926",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: "100%",
    height: 50,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  registerButton: {
    width: "100%",
    height: 45,
    backgroundColor: "#A32926",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    color: "#A32926",
    fontSize: 16,
  },
});
