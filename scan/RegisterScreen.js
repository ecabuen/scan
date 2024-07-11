import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://192.168.0.250:3000/register', {
        firstname, 
        lastname, 
        email,
        password,
      });

      if (response.status === 201) {
        Alert.alert('Registration successful');
        navigation.navigate('Home');
      }
    } catch (error) {
      if (error.response) {
        // Request made and server responded
        Alert.alert('Registration failed', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        Alert.alert('Registration failed', 'No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        Alert.alert('Registration failed', 'Error', error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
   
      <View style={styles.logoContainer}>
        <Image
          source={require('./images/logo.png')}
          style={styles.logo}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#999"
        value={firstname}
        onChangeText={setFirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#999"
        value={lastname}
        onChangeText={setLastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A32926",
    alignItems: "center",
    justifyContent: "center",
  },
  scanText: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Helvetica",
    color: "#fff",
    marginBottom: 20,
  },
  logoContainer: {
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 80,
    marginBottom: 50,
  },
  logo: {
    width: 100,
    height: 100,
  },
  registerText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Helvetica",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    width: "90%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  registerButton: {
    width: "90%",
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  registerButtonText: {
    color: "#A32926",
    fontSize: 20,
    fontWeight: "bold",
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
