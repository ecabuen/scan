import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { FontAwesome } from '@expo/vector-icons'; 
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const handleRegister = async () => {
    // Input validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    setEmailInvalid(!emailRegex.test(email));
    setPasswordInvalid(!passwordRegex.test(password));

    if (!firstname || !lastname || !email || !password) {
      Alert.alert('Registration failed', 'All fields are required');
      return;
    }

    if (!emailRegex.test(email) || !passwordRegex.test(password)) {
      return;
    }

    try {
      const response = await axios.post('http://192.168.254.101:3000/register', {
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
        if (error.response.status === 409) {
          setEmailExists(true);
        } else {
          Alert.alert('Registration failed', error.response.data);
        }
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
        <View style={[styles.inputContainer, (emailInvalid || emailExists) && styles.inputError]}>
          <FontAwesome name="envelope" size={20} color="#A32926" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {emailInvalid && (
          <Text style={styles.errorText}>Invalid email format</Text>
        )}
        {emailExists && (
          <Text style={styles.errorText}>Email already exists</Text>
        )}
        <View style={[styles.inputContainer, passwordInvalid && styles.inputError]}>
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
        {passwordInvalid && (
          <Text style={styles.errorText}>Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol</Text>
        )}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Already have an account? Log in</Text>
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
    top: 50,
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
    height: "80%",
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
    width: 20,
    height: 20,
  },
  input: {
    flex: 1,
  },
  inputError: {
    borderBottomColor: 'red',
    borderBottomWidth: 1,
  },
  errorText: {
    color: 'red',
    marginTop: -15,
    marginBottom: 10,
  },
  registerButton: {
    width: "100%",
    height: 45,
    backgroundColor: "#A32926",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginButton: {
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#A32926",
    fontSize: 16,
  },
});
