import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {

      const response = await axios.post('http://192.168.0.250:3000/login', {
        email,
        password,
      });

      if (response.status === 200) {
        Alert.alert('Login successful');
        navigation.navigate('Home', {
          firstname: response.data.firstname,
          lastname: response.data.lastname,
        });
        
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Login failed', error.response.data.message);
      } else if (error.request) {
        Alert.alert('Login failed', 'No response from server');
      } else {
        Alert.alert('Login failed', 'Error', error.message);
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
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Log in</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.createAccountText}>CREATE AN ACCOUNT</Text>
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
  loginText: {
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
  loginButton: {
    width: "90%",
    height: 45,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#A32926",
    fontSize: 20,
    fontWeight: "bold",
  },
  createAccountText: {
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
