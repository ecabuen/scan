import React, { useRef, useState } from "react";
import { Button, Pressable, StyleSheet, Text, View, Alert, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import axios from "axios";
import Icon from 'react-native-vector-icons/FontAwesome'; // Add this import

const REFRESH_TOKEN = '1//040QlNKw-PudgCgYIARAAGAQSNwF-L9Ir6AkGSBbvp7e9vwquSFN9EpMfNWfikaYLGENRZTSNQhB5yjY5k2CdVDn0Gl_MKFoFGmA';
const CLIENT_ID = '735896738345-o22t3q495i91tr5kb2br0sis3klrepc5.apps.googleusercontent.com';
const CLIENT_SECRET = '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'; // Replace with your client secret

export default function App({ navigation }) { // Add navigation prop
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView>(null);
  const [facing, setFacing] = useState<CameraType>("back");
  const [accessToken, setAccessToken] = useState<string | null>('ya29.a0AXooCguhLFJxPVISyfFnFW7GYK6rzc2757jjs7YPGNDdQs_ne22L9JXdhlhaE-gFoTaWXWO7omCAHhxf9ksZDl5QRECDdm6AACBFRY3TDrKyrU9SS7LWXQKBeFivQhuGEgdPHCHTBY4rMSoipMl6IzHzb81nmoPXtvXqaCgYKAf4SARASFQHGX2MiZtt6n1-NlyheGhjzhxqzAw0171');
  const [labels, setLabels] = useState([]);
  const [error, setError] = useState('');

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    const photo = await ref.current?.takePictureAsync();
    if (photo?.uri) {
      sendEmailHandler();
    }
  };

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        grant_type: 'refresh_token',
        refresh_token: REFRESH_TOKEN,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      });

      const newAccessToken = response.data.access_token;
      setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing access token:', error.message);
      Alert.alert('Error', 'Failed to refresh access token');
      return null;
    }
  };

  const sendEmailHandler = async () => {
    let token = accessToken;
    if (!token) {
      token = await refreshAccessToken();
    }

    if (!token) {
      Alert.alert("Error", "Unable to get access token");
      return;
    }

    try {
      await sendEmail(
        token,
        "Attendance Notification",
        "Dear Parent/Guardian, We are pleased to inform you that your child has been marked present at school today."
      );
      Alert.alert("Success", "Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      Alert.alert("Error", "Failed to send email: " + error.message);
    }
  };

  const sendEmail = async (token, subject, body) => {
    const email = createEmail(subject, body);
    const base64EncodedEmail = btoa(unescape(encodeURIComponent(email)));

    try {
      const response = await fetch(
        'https://www.googleapis.com/gmail/v1/users/me/messages/send',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            raw: base64EncodedEmail,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response from Gmail API:", errorData);
        throw new Error('Failed to send email: ' + errorData.error.message);
      }
    } catch (error) {
      console.error("Error during email sending:", error.message);
      throw error;
    }
  };

  const createEmail = (subject, body) => {
    const to = ['jnkdenini@gmail.com'];
    const from = 'me';
    const raw = `From: ${from}\r\nTo: ${to.join(', ')}\r\nSubject: ${subject}\r\n\r\n${body}`;
    return raw;
  };

  const toggleFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  const fetchLabels = async () => {
    let token = accessToken;
    if (!token) {
      token = await refreshAccessToken();
    }

    if (!token) {
      Alert.alert('Error', 'Unable to get access token');
      return;
    }

    const apiUrl = 'https://www.googleapis.com/gmail/v1/users/me/labels';
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.get(apiUrl, { headers });
      setLabels(response.data.labels);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Access token is likely expired, refresh it and try again
        token = await refreshAccessToken();
        if (token) {
          setAccessToken(token);
          fetchLabels();
        } else {
          setError('Error fetching labels: Failed to refresh access token');
        }
      } else {
        setError('Error fetching labels: ' + error.message);
      }
    }
  };

  const renderCamera = () => {
    return (
      <CameraView
        style={styles.camera}
        ref={ref}
        mode={"picture"}
        facing={facing}
        mute={false}
        responsiveOrientationWhenOrientationLocked
      >
        <View style={styles.shutterContainer}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Pressable onPress={takePicture}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.shutterBtn,
                    {
                      opacity: pressed ? 0.5 : 1,
                    },
                  ]}
                >
                  <Text style={styles.shutterText}>Submit</Text>
                </View>
              )}
            </Pressable>
          </View>
          <Pressable onPress={toggleFacing} style={styles.toggleButton}>
            <FontAwesome name="rotate-left" size={32} color="white" />
          </Pressable>
        </View>
        <View style={styles.borderedBox}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
      </CameraView>
    );
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={30} color="#FFF" />
      </TouchableOpacity>
      {renderCamera()}
      {labels.length > 0 && (
        <View style={styles.labelContainer}>
          <Text style={styles.labelText}>
            {labels.map((label) => label.name).join(', ')}
          </Text>
        </View>
      )}
      {error !== '' && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headerButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 10,
    padding: 10,
  },
  camera: {
    flex: 1,
    width: "100%",
    borderRadius: 20,
    overflow: 'hidden',
  },
  shutterContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  shutterBtn: {
    backgroundColor: '#326A1B',
    borderWidth: 1,
    borderColor: "white",
    width: 120,
    height: 50,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginLeft:38
  },
  shutterText: {
    color: "white",
    fontSize: 18,
  },
  toggleButton: {
    marginRight: 10,
  },
  pictureContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  picture: {
    width: 300,
    height: 400,
  },
  labelContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  labelText: {
    fontSize: 14,
  },
  error: {
    color: 'red',
    marginTop: 20,
  },
  borderedBox: {
    position: 'absolute',
    top: '30%',  // Adjust as needed
    left: '25%',  // Adjust as needed
    width: '55%',  // Adjust as needed
    height: '30%',  // Adjust as needed
    
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'white',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 2,
    borderLeftWidth: 2,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 2,
    borderRightWidth: 2,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 2,
    borderRightWidth: 2,
  },
});
