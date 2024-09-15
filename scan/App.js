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
import Attendance from './Attendance';
import Password from './Password';
import Performance from './Performance';
import Present from './Present';
import Absent from './Absent';
import Latecomers from './Latecomers';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ headerShown: false }} />
        <Stack.Screen name="RegisterStudentScreen" component={RegisterStudentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddStudentScreen" component={AddStudentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditStudentScreen" component={EditStudentScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileDetails" component={ProfileDetails} options={{ headerShown: false }} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Report" component={Report} options={{ headerShown: false }}/>
        <Stack.Screen name="Attendance" component={Attendance} options={{ headerShown: false }}/>
        <Stack.Screen name="Present" component={Present} options={{ headerShown: false }}/>
        <Stack.Screen name="Absent" component={Absent} options={{ headerShown: false }}/>
        <Stack.Screen name="Latecomers" component={Latecomers} options={{ headerShown: false }}/>
        <Stack.Screen name="Password" component={Password} options={{ headerShown: false }}/>
        <Stack.Screen name="Performance" component={Performance} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
