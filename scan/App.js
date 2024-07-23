import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import CameraScreen from './CameraScreen';
import RegisterStudentScreen from './RegisterStudentScreen';
import AddStudentScreen from './AddStudentScreen';
import EditStudentScreen from './EditStudentScreen';
import ProfileDetails from './ProfileDetails';
import Report from './Report';
import EmailScreen from './EmailScreen';
import Attendance from './Attendance';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterStudentScreen" component={RegisterStudentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddStudentScreen" component={AddStudentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditStudentScreen" component={EditStudentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Report" component={Report} options={{ headerShown: false }}/>
        <Stack.Screen name="EmailScreen" component={EmailScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Attendance" component={Attendance} options={{ headerShown: false }}/>
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}
