import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { PieChart, LineChart } from 'react-native-chart-kit';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { firstname, lastname, email, id } = route.params || {};
  const [activeIcon, setActiveIcon] = useState('profile');
  const [hasPermission, setHasPermission] = useState(null);
  const [selectedTab, setSelectedTab] = useState('daily');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

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

  const totalStudents = 30;
  const presentStudents = 28;
  const lateStudents = 2;
  const absentStudents = totalStudents - presentStudents - lateStudents;
  const maleStudents = 18;
  const femaleStudents = totalStudents - maleStudents;

  const genderData = [
    {
      name: 'Male',
      population: maleStudents,
      color: '#A32926',
      legendFontColor: '#000',
      legendFontSize: 15,
    },
    {
      name: 'Female',
      population: femaleStudents,
      color: '#e59997',
      legendFontColor: '#000',
      legendFontSize: 15,
    },
  ];

  const dailyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        data: [28, 27, 29, 26, 28],
      },
    ],
  };

  const weeklyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [140, 135, 145, 130],
      },
    ],
  };

  const monthlyData = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        data: [580, 560, 540, 580, 560, 540, 560, 580, 560, 540],
      },
    ],
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

  const getPercentage = (value, total) => {
    return ((value / total) * 100).toFixed(0) + '%';
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
              <Icon name="users" size={30} color="#fff" />
              <View style={styles.dashboardCardContent}>
                <Text style={styles.dashboardCardLabel}>Total Students</Text>
                <Text style={styles.dashboardCardValue}>{totalStudents}</Text>
              </View>
            </View>
            <View style={styles.dashboardCard}>
              <Icon name="user-check" size={30} color="#fff" />
              <View style={styles.dashboardCardContent}>
                <Text style={styles.dashboardCardLabel}>Present</Text>
                <Text style={styles.dashboardCardValue}>{presentStudents}</Text>
              </View>
            </View>
            <View style={styles.dashboardCard}>
              <Icon name="user-times" size={30} color="#fff" />
              <View style={styles.dashboardCardContent}>
                <Text style={styles.dashboardCardLabel}>Absent</Text>
                <Text style={styles.dashboardCardValue}>{absentStudents}</Text>
              </View>
            </View>
            <View style={styles.dashboardCard}>
              <Icon name="user-clock" size={30} color="#fff" />
              <View style={styles.dashboardCardContent}>
                <Text style={styles.dashboardCardLabel}>Late</Text>
                <Text style={styles.dashboardCardValue}>{lateStudents}</Text>
              </View>
            </View>
          </View>

          <View style={styles.analyticsContainer}>
            <Text style={styles.analyticsTitle}>Gender Breakdown</Text>
            <PieChart
              style={styles.chart}
              data={genderData.map(data => ({
                ...data,
                name: `${data.name} (${getPercentage(data.population, totalStudents)})`,
              }))}
              width={width * 1}
              height={200}
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

          <View style={styles.analyticsContainer}>
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
          <TouchableOpacity onPress={handleProfile} style={[styles.iconWrapper]}>
            <Icon name="user-alt"  size={35} color="#A32926" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
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
    color: '#fff',
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
    paddingHorizontal: 10,
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
    backgroundColor: '#A32926',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: '49%',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  dashboardCardContent: {
    alignItems: 'center',
    marginTop: 10,
  },
  dashboardCardLabel: {
    fontSize: 16,
    color: '#fff',
  },
  dashboardCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  analyticsContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingRight: 20,
  },
  analyticsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
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
    alignSelf: 'center'
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
  icon: {
    width: 40,
    height: 40,
  },
  active: {
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 5,
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
