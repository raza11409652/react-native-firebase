import React, { Component, children } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Slider,
} from "react-native";
import { Ionicons, AntDesign, Entypo, Feather } from "@expo/vector-icons";

const Player = ({ children, size, style }) => {
  return (
    <View style={styles.topShadow}>
      <View style={styles.bottomShadow}>
        <View
          style={[
            styles.inner,
            {
              width: size || 40,
              height: size || 40,
              borderRadius: size / 2 || 40 / 2,
            },
            style,
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  );
};
class DashboardScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <SafeAreaView style={{ alignSelf: "stretch" }}>
          <View style={{ marginHorizontal: 32, marginTop: 32 }}>
            <View style={styles.topContainer}>
              <Player size={48} style={styles.topShadow}>
                <AntDesign name="arrowleft" size={24} color="gray" />
              </Player>
              <View>
                <Text style={styles.playing}>PLAYING NOW</Text>
              </View>
              <Player size={48} style={styles.topShadow}>
                <Feather name="menu" size={24} color="gray" />
              </Player>
            </View>
            <View style={styles.showArtContainer}>
              <Player size={320} style={styles.topShadow}>
                <Image
                  source={require("../assets/background.png")}
                  style={styles.songArt}
                />
              </Player>
            </View>
            <View style={styles.songContainer}>
              <Text style={styles.songTitle}>Exhale</Text>
              <Text style={styles.songArtist}>LiftMee</Text>
            </View>
            <View style={styles.trackContainer}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.showTime}>1.11</Text>
                <Text style={styles.showTime}>3.21</Text>
              </View>
              <Slider
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#8AAAFF"
                maximumTrackTintColor="#DAE6F4"
                thumbTintColor="#7B9BFF"
              />
            </View>
            <View style={styles.controlContainer}>
              <Player size={60} style={styles.topShadow}>
                <Ionicons name="md-rewind" size={24} color="gray" />
              </Player>
              <Player
                size={60}
                style={{ ...styles.topShadow, backgroundColor: "#8AAAFF" }}
              >
                <AntDesign name="pause" size={30} color="white" />
              </Player>
              <Player size={60} style={styles.topShadow}>
                <Ionicons name="md-fastforward" size={24} color="gray" />
              </Player>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }
}
export default DashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DEE9FD",
    alignItems: "center",
  },
  topContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inner: {
    backgroundColor: "#DEE9F7",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#E2ECFD",
    borderWidth: 1,
  },
  topShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
  },
  bottomShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,

    elevation: 15,
  },
  playing: {
    color: "gray",
    fontWeight: "bold",
    fontSize: 16,
  },
  showArtContainer: {
    marginVertical: 32,
    alignItems: "center",
  },
  songArt: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderColor: "#D7E1F3",
    borderWidth: 1,
  },
  songContainer: {
    alignItems: "center",
  },
  songTitle: {
    fontSize: 30,
    color: "#6C7A93",
    fontWeight: "600",
  },
  songArtist: {
    fontSize: 14,
    marginTop: 6,
    color: "gray",
    fontWeight: "500",
  },
  trackContainer: {
    marginTop: 32,
    marginBottom: 64,
  },
  showTime: {
    fontSize: 10,
    color: "gray",
    fontWeight: "700",
  },
  controlContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
