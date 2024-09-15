import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { Camera } from "expo-camera";
import Icon from "react-native-vector-icons/FontAwesome5";
import { PieChart, LineChart } from "react-native-chart-kit";
import axios from "axios";
import { DataTable } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { firstname, lastname, email, id } = route.params || {};
  const [activeIcon, setActiveIcon] = useState("profile");
  const [hasPermission, setHasPermission] = useState(null);
  const [selectedTab, setSelectedTab] = useState("daily");
  const [presentStudents, setPresentStudents] = useState(0);
  const [lateStudents, setLateStudents] = useState(0);
  const [absentStudents, setAbsentStudents] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [genderData, setGenderData] = useState([]);
  const [topLateStudents, setTopLateStudents] = useState([]);
  const [topPresentStudents, setTopPresentStudents] = useState([]);
  const [topAbsentStudents, setTopAbsentStudents] = useState([]);
  const [selectedTable, setSelectedTable] = useState("present");
  const [dailyData, setDailyData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
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
  const handleViewAll = () => {
    navigation.navigate('Performance', { teacherId: id });
  };
  
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === "granted");

          const todayResponse = await axios.get(
            `http://192.168.254.107:3000/attendance/today?teacherId=${id}`
          );
          setPresentStudents(todayResponse.data.present);
          setLateStudents(todayResponse.data.late);
          setAbsentStudents(todayResponse.data.absent);
          setTotalStudents(todayResponse.data.total);
          const genderCounts = todayResponse.data.gender.map((g) => ({
            name: g.gender,
            population: g.count,
            color: g.gender === "Male" ? "#A32926" : "#e59997",
            legendFontColor: "#000",
            legendFontSize: 15,
          }));
          setGenderData(genderCounts);

          const dailyResponse = await axios.get(
            `http://192.168.254.107:3000/attendance/daily?teacherId=${id}`
          );
          const dailyCounts = [0, 0, 0, 0, 0];
          dailyResponse.data.forEach((d) => {
            const index = ["Mon", "Tue", "Wed", "Thu", "Fri"].indexOf(d.day);
            if (index !== -1) {
              dailyCounts[index] = d.presentCount;
            }
          });
          setDailyData({
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            datasets: [
              {
                data: dailyCounts,
              },
            ],
          });

          const weeklyResponse = await axios.get(
            `http://192.168.254.107:3000/attendance/weekly?teacherId=${id}`
          );
          const weeks = weeklyResponse.data.map((d) => d.week);
          const weeklyCounts = weeklyResponse.data.map((d) => d.presentCount);
          setWeeklyData({
            labels: weeks,
            datasets: [
              {
                data: weeklyCounts,
              },
            ],
          });

          //late
          const lateStudentResponse = await axios.get(
            `http://192.168.254.107:3000/attendance/most-late-student?teacher_Id=${id}`
          );
          setTopLateStudents(lateStudentResponse.data.data);

          //present
          const presentStudentResponse = await axios.get(
            `http://192.168.254.107:3000/attendance/most-present-student?teacher_Id=${id}`
          );
          setTopPresentStudents(presentStudentResponse.data.data);

          //absent
          const absentStudentResponse = await axios.get(
            `http://192.168.254.107:3000/attendance/most-absent-student?teacher_Id=${id}`
          );
          setTopAbsentStudents(absentStudentResponse.data.data);

          const monthlyResponse = await axios.get(
            `http://192.168.254.107:3000/attendance/monthly?teacherId=${id}`
          );
          const months = monthlyResponse.data.map((d) => d.month);
          const monthlyCounts = monthlyResponse.data.map((d) => d.presentCount);
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
    setActiveIcon("profile");
    navigation.navigate("Profile", {
      firstname,
      lastname,
      email,
      id,
    });
  };

  const handleCamera = async () => {
    if (hasPermission) {
      setActiveIcon("camera");
      navigation.navigate("CameraScreen");
    } else {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status === "granted") {
        setHasPermission(true);
        setActiveIcon("camera");
        navigation.navigate("CameraScreen");
      } else {
        alert("Camera access is required.");
      }
    }
  };

  const chartConfig = {
    backgroundGradientFrom: "#F2F2F2",
    backgroundGradientTo: "#F2F2F2",
    fillShadowGradient: "#A32926",
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
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  const handleCardPress = () => {
    navigation.navigate("Attendance", { id });
};
  const present = () => {
  navigation.navigate("Present", { id });
};
const absent = () => {
  navigation.navigate("Absent", { id });
};
const late = () => {
  navigation.navigate("Latecomers", { id });
};
const currentDate = new Date().toISOString().split('T')[0];
const getCurrentDate = () => {
  const today = new Date();
  return today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Hi Teacher!</Text>
          
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
        </View>
      </View>

      <View style={styles.contentSection}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.cardContainer}>
          <TouchableOpacity onPress={() => handleCardPress()}
            style={styles.dashboardCard}
          >
            <Icon name="users" size={30} color="#A32926" />
            <View style={styles.dashboardCardContent}>
              <Text style={styles.dashboardCardLabel}>Total Students</Text>
              <Text style={styles.dashboardCardValue}>{totalStudents}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => present()}
            style={styles.dashboardCard}
          >
            <Icon name="user-check" size={30} color="#A32926" />
            <View style={styles.dashboardCardContent}>
              <Text style={styles.dashboardCardLabel}>Present</Text>
              <Text style={styles.dashboardCardValue}>{presentStudents}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => absent()}
            style={styles.dashboardCard}
          >
            <Icon name="user-times" size={30} color="#A32926" />
            <View style={styles.dashboardCardContent}>
              <Text style={styles.dashboardCardLabel}>Absent</Text>
              <Text style={styles.dashboardCardValue}>{absentStudents}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => late()}
            style={styles.dashboardCard}
          >
            <Icon name="user-clock" size={30} color="#A32926" />
            <View style={styles.dashboardCardContent}>
              <Text style={styles.dashboardCardLabel}>Late</Text>
              <Text style={styles.dashboardCardValue}>{lateStudents}</Text>
            </View>
          </TouchableOpacity>
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
            <TouchableOpacity
              onPress={() => setSelectedTab("daily")}
              style={[styles.tab, selectedTab === "daily" && styles.activeTab]}
            >
              <Text style={styles.tabText}>Daily</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab("weekly")}
              style={[styles.tab, selectedTab === "weekly" && styles.activeTab]}
            >
              <Text style={styles.tabText}>Weekly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTab("monthly")}
              style={[
                styles.tab,
                selectedTab === "monthly" && styles.activeTab,
              ]}
            >
              <Text style={styles.tabText}>Monthly</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.chartBoxContainer}>
            <Text style={styles.analyticsTitle}>{`${
              selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)
            } Attendance`}</Text>
            <LineChart
              style={styles.chart}
              data={getCurrentData()}
              width={width * 0.9}
              height={220}
              chartConfig={chartConfig}
              bezier
            />
          </View>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              onPress={() => setSelectedTable("present")}
              style={[
                styles.tab,
                selectedTable === "present" && styles.activeTab,
              ]}
            >
              <Text style={styles.tabText}>Present</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTable("late")}
              style={[styles.tab, selectedTable === "late" && styles.activeTab]}
            >
              <Text style={styles.tabText}>Late</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedTable("absent")}
              style={[
                styles.tab,
                selectedTable === "absent" && styles.activeTab,
              ]}
            >
              <Text style={styles.tabText}>Absent</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableContainer}>
          <View style={styles.titleContainer}>
        <Text style={styles.analyticsTitle}>
          {selectedTable === "late"
            ? "Top Latecomers"
            : selectedTable === "absent"
            ? "Top Absentees"
            : "Top Attendees"}
        </Text>
        <TouchableOpacity onPress={handleViewAll} style={styles.viewAllContainer}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>
   
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Name</DataTable.Title>
                <DataTable.Title numeric>
                  {selectedTable === "late"
                    ? "Late Count"
                    : selectedTable === "absent"
                    ? "Absent Count"
                    : "Present Count"}
                </DataTable.Title>
              </DataTable.Header>
              {(selectedTable === "late"
                ? topLateStudents
                : selectedTable === "absent"
                ? topAbsentStudents
                : topPresentStudents
              ).map((student, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell>{student.student_name}</DataTable.Cell>
                  <DataTable.Cell numeric>
                    {selectedTable === "late"
                      ? student.late_count
                      : selectedTable === "absent"
                      ? student.absent_count
                      : student.present_count}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </View>
        </ScrollView>
      </View>

      <View style={styles.footerContainer}>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.iconWrapper}>
            <Icon name="tachometer-alt" size={35} color="#c1c1c1" />
          </TouchableOpacity>
          <View style={styles.cameraButtonWrapper}>
            <TouchableOpacity
              onPress={handleCamera}
              style={styles.cameraButton}
            >
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
    backgroundColor: "#c0c0c0",
  },
  headerContainer: {
    backgroundColor: "#A32926",
    height: 180,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 40,
    paddingBottom: 60,
    flexDirection: 'row', // Change to row to align header text and date
    justifyContent: 'space-between', // Space between header text and date
    width: '100%', // Ensure full width
  },
  dateText: {
    color: "#FFFF",
    fontSize: 16,
    fontWeight: "normal", // Keep normal weight to differentiate from header text
  },
  headerText: {
    color: "#FFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  scrollView: {
    width: "100%",
    marginBottom: 80,
  },
  contentSection: {
    flex: 1,
    paddingVertical: 20,
    paddingBottom: 0,
    paddingHorizontal: 13,
    backgroundColor: "#F2F2F2",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -height * 0.08,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dashboardCard: {
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    width: "45%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    marginRight: 5,
    marginLeft: 5,
  },
  dashboardCardContent: {
    alignItems: "center",
    marginTop: 10,
  },
  dashboardCardLabel: {
    fontSize: 16,
    color: "#A32926",
  },
  dashboardCardValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#A32926",
    marginTop: 5,
  },
  chartBoxContainer: {
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    alignItems: "center",
    elevation: 3,
    marginRight: 5,
    marginLeft: 5,
  },
 
  chart: {
    marginTop: 10,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    width: width,
    alignItems: "center",
    paddingVertical: 0.1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
    borderTopColor: "#000",
    elevation: 10,
    zIndex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "80%",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  cameraButtonWrapper: {
    bottom: 25,
    zIndex: 5,
    alignSelf: "center",
  },
  cameraButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#A32926",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },

  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center", // Center vertically
    marginVertical: 10,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: "#ddd",
  },
  activeTab: {
    backgroundColor: "#A32926",
  },
  tabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
 
  titleContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 10,
  },
  analyticsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  viewAllContainer: {
    position: 'absolute',
    right: 0,
  },
  viewAllText: {
    color: '#A32926',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
