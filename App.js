import React from "react";
import { Asset } from "expo-asset";
import { AppLoading } from "expo";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import DashboardScreen from "./screens/DashboardScreen";
import LoadingScreen from "./screens/LoadingScreen";
import LiftMee from "./App/Index";
import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyCwF_OiwqaX4jLMtsv39vL1rpkRdAMgNF4",
  authDomain: "liftmee-a750b.firebaseapp.com",
  databaseURL: "https://liftmee-a750b.firebaseio.com",
  projectId: "liftmee-a750b",
  storageBucket: "liftmee-a750b.appspot.com",
  messagingSenderId: "610288812836",
  appId: "1:610288812836:web:ab8c0f2fa1baa89daae9b1",
  measurementId: "G-6FXYSVQTZ2"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LiftMee,
  DashboardScreen: DashboardScreen,
});

const AppNavigator = createAppContainer(AppSwitchNavigator);

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === "string") {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}
export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isReady: false,
    };
  }
  async _loadAssetsAsync() {
    const imageAssets = cacheImages([require("./assets/background.png")]);

    await Promise.all([...imageAssets]);
  }
  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={this._loadAssetsAsync}
          onFinish={() => this.setState({ isReady: true })}
          onError={console.warn}
        />
      );
    }

    return <AppNavigator />;
  }
}
