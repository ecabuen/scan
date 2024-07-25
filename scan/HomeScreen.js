import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { PieChart, LineChart } from 'react-native-chart-kit';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { firstname, lastname, email, id } = route.params || {};
  const [activeIcon, setActiveIcon] = useState('profile');
  const [hasPermission, setHasPermission] = useState(null);
  const [selectedTab, setSelectedTab] = useState('daily');
  const [presentStudents, setPresentStudents] = useState(0);
  const [lateStudents, setLateStudents] = useState(0);
  const [absentStudents, setAbsentStudents] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [genderData, setGenderData] = useState([]);
  const [dailyData, setDailyData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        data: [0, 0, 0, 0, 0], // Default data array to prevent reduce error
      },
    ],
  });
  const [weeklyData, setWeeklyData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });
  const [monthlyData, setMonthlyData] = useState({
    labels: [],
    datasets: [
      {
        data: [],
      },
    ],
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
          
          const todayResponse = await axios.get(`http://192.168.254.107:3000/attendance/today?teacherId=${id}`);
          setPresentStudents(todayResponse.data.present);
          setLateStudents(todayResponse.data.late);
          setAbsentStudents(todayResponse.data.absent);
          setTotalStudents(todayResponse.data.total);
          const genderCounts = todayResponse.data.gender.map(g => ({
            name: g.gender,
            population: g.count,
            color: g.gender === 'Male' ? '#A32926' : '#e59997',
            legendFontColor: '#000',
            legendFontSize: 15,
          }));
          setGenderData(genderCounts);
          
          const dailyResponse = await axios.get(`http://192.168.254.107:3000/attendance/daily?teacherId=${id}`);
          const dailyCounts = [0, 0, 0, 0, 0];
          dailyResponse.data.forEach(d => {
            const index = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].indexOf(d.day);
            if (index !== -1) {
              dailyCounts[index] = d.presentCount;
            }
          });
          setDailyData({
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
            datasets: [
              {
                data: dailyCounts,
              },
            ],
          });

          const weeklyResponse = await axios.get(`http://192.168.254.107:3000/attendance/weekly?teacherId=${id}`);
          const weeks = weeklyResponse.data.map(d => d.week);
          const weeklyCounts = weeklyResponse.data.map(d => d.presentCount);
          setWeeklyData({
            labels: weeks,
            datasets: [
              {
                data: weeklyCounts,
              },
            ],
          });

          const monthlyResponse = await axios.get(`http://192.168.254.107:3000/attendance/monthly?teacherId=${id}`);
          const months = monthlyResponse.data.map(d => d.month);
          const monthlyCounts = monthlyResponse.data.map(d => d.presentCount);
          setMonthlyData({
            labels: months,
            datasets: [
              {
                data: monthlyCounts,
              },
            ],
          });

        } catch (error) {
          console.error(error);
        }
      };

      fetchData();

      return () => {
        // Cleanup function if necessary
      };
    }, [id])
  );

  const handleProfile = () => {
    setActiveIcon('profile');
    navigation.navigate('Profile', {
      firstname,
      lastname,
      email,
      id
    });
  };

  const handleCamera = async () => {
    if (hasPermission) {
      setActiveIcon('camera');
      navigation.navigate('CameraScreen');
    } else {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === 'granted') {
        setHasPermission(true);
        setActiveIcon('camera');
        navigation.navigate('CameraScreen');
      } else {
        alert('Camera access is required.');
      }
    }
  };

  const chartConfig = {
    backgroundGradientFrom: '#F2F2F2',
    backgroundGradientTo: '#F2F2F2',
    fillShadowGradient: '#A32926',
    color: (opacity = 1) => `rgba(163, 41, 38, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(51, 51, 51, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    barPercentage: 0.5,
    decimalPlaces: 0, // No decimals
  };

  const getCurrentData = () => {
    switch (selectedTab) {
      case 'daily':
        return dailyData;
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default:
        return dailyData;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Dashboard</Text>
        </View>
      </View>

      <View style={styles.contentSection}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.cardContainer}>
            <View style={styles.dashboardCard}>
              <Icon name="users" size={30} color="#A32926" />
              <View style={styles.dashboardCardContent}>
                <Text style={styles.dashboardCardLabel}>Total Students</Text>
                <Text style={styles.dashboardCardValue}>{totalStudents}</Text>
              </View>
            </View>
            <View style={styles.dashboardCard}>
              <Icon name="user-check" size={30} color="#A32926" />
              <View style={styles.dashboardCardContent}>
                <Text style={styles.dashboardCardLabel}>Present</Text>
                <Text style={styles.dashboardCardValue}>{presentStudents}</Text>
              </View>
            </View>
            <View style={styles.dashboardCard}>
              <Icon name="user-times" size={30} color="#A32926" />
              <View style={styles.dashboardCardContent}>
                <Text style={styles.dashboardCardLabel}>Absent</Text>
                <Text style={styles.dashboardCardValue}>{absentStudents}</Text>
              </View>
            </View>
            <View style={styles.dashboardCard}>
              <Icon name="user-clock" size={30} color="#A32926" />
              <View style={styles.dashboardCardContent}>
                <Text style={styles.dashboardCardLabel}>Late</Text>
                <Text style={styles.dashboardCardValue}>{lateStudents}</Text>
              </View>
            </View>
          </View>

          <View style={styles.chartBoxContainer}>
            <Text style={styles.analyticsTitle}>Gender Distribution</Text>
            <PieChart
              data={genderData}
              width={width * 0.9}
              height={150}
              chartConfig={chartConfig}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>

          <View style={styles.tabContainer}>
            <TouchableOpacity onPress={() => setSelectedTab('daily')} style={[styles.tab, selectedTab === 'daily' && styles.activeTab]}>
              <Text style={styles.tabText}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedTab('weekly')} style={[styles.tab, selectedTab === 'weekly' && styles.activeTab]}>
              <Text style={styles.tabText}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedTab('monthly')} style={[styles.tab, selectedTab === 'monthly' && styles.activeTab]}>
              <Text style={styles.tabText}>Monthly</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartBoxContainer}>
            <Text style={styles.analyticsTitle}>{`${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Attendance`}</Text>
            <LineChart
              style={styles.chart}
              data={getCurrentData()}
              width={width * 0.9}
              height={220}
              chartConfig={chartConfig}
              bezier
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.iconWrapper}>
            <Icon name="tachometer-alt" size={35} color="#A32926" />
          </TouchableOpacity>
          <View style={styles.cameraButtonWrapper}>
            <TouchableOpacity onPress={handleCamera} style={styles.cameraButton}>
              <Icon name="camera" size={40} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleProfile} style={styles.iconWrapper}>
            <Icon name="user-alt" size={35} color="#A32926" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#c0c0c0',
  },
  headerContainer: {
    backgroundColor: '#A32926',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 40,
    paddingBottom: 60,
  },
  headerText: {
    color: '#FFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scrollView: {
    width: '100%',
    marginBottom: 80,
  },
  contentSection: {
    flex: 1,
    paddingVertical: 20,
    paddingBottom: 0,
    paddingHorizontal: 13,
    backgroundColor: '#F2F2F2',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -height * 0.08,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dashboardCard: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    marginRight: 5,
    marginLeft: 5,
  },
  dashboardCardContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  dashboardCardLabel: {
    fontSize: 16,
    color: '#A32926',
  },
  dashboardCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A32926',
    marginTop: 5,
  },
  chartBoxContainer: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    alignItems: 'center',
    elevation: 3,
    marginRight: 5,
    marginLeft: 5,
  },
  analyticsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  chart: {
    marginTop: 10,
  },
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    width: width,
    alignItems: 'center',
    paddingVertical: 0.1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderTopColor: '#000',
    elevation: 10,
    zIndex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '80%',
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  cameraButtonWrapper: {
    bottom: 25,
    zIndex: 5,
    alignSelf: 'center',
  },
  cameraButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#A32926',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#ddd',
  },
  activeTab: {
    backgroundColor: '#A32926',
  },
  tabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
