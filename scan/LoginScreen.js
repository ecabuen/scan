import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Login Failed', 'All fields are required');
      return;
    }

    try {
      const response = await axios.post('http://192.168.0.115:3000/login', {
        email,
        password,
      });

      if (response.status === 200) {
        Alert.alert('Login successful', `Welcome back, ${response.data.firstname}!`);
        navigation.navigate('Home', {
          firstname: response.data.firstname,
          lastname: response.data.lastname,
          email: response.data.email,
          id: response.data.id,
        });
        setPassword(''); // Clear password field
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Alert.alert('Login failed', 'Wrong username or password');
      } else if (error.response) {
        Alert.alert('Login failed', error.response.data.message);
      } else if (error.request) {
        Alert.alert('Login failed', 'No response from server');
      } else {
        Alert.alert('Login failed', error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('./images/bsu.png')}
          style={styles.logo}
        />
      </View>
      <View style={styles.container}>
        <Text style={styles.loginText}>Login to your Account</Text>
        <View style={styles.inputContainer}>
          <FontAwesome name="envelope" size={20} color="#A32926" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none" // Ensure email is entered in lowercase
          />
        </View>
        <View style={styles.inputContainer}>
          <FontAwesome name="lock" size={20} color="#A32926" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={20} color="#A32926" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.createAccountButton}>
          <Text style={styles.createAccountText}>CREATE AN ACCOUNT</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  loginText: {
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
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
  },
  loginButton: {
    width: "100%",
    height: 45,
    backgroundColor: "#A32926",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  createAccountButton: {
    marginBottom: 20,
  },
  createAccountText: {
    color: "#A32926",
    fontSize: 16,
  },
});
