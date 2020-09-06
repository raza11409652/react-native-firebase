import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Button,
} from "react-native";
import Svg, { Image, Circle, ClipPath } from "react-native-svg";
import Animated, { Easing } from "react-native-reanimated";
import {
  TapGestureHandler,
  State,
  RectButton,
} from "react-native-gesture-handler";
import * as Google from "expo-google-app-auth";
import * as firebase from "firebase";
import { locale } from "moment";

const { width, height } = Dimensions.get("window");
/**
 * Firebase configuration
 */

// 
const {
  Value,
  event,
  block,
  cond,
  eq,
  set,
  Clock,
  startClock,
  stopClock,
  debug,
  timing,
  clockRunning,
  interpolate,
  Extrapolate,
  concat,
} = Animated;

function runTiming(clock, value, dest) {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1000,
    toValue: new Value(0),
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(clockRunning(clock), 0, [
      set(state.finished, 0),
      set(state.time, 0),
      set(state.position, value),
      set(state.frameTime, 0),
      set(config.toValue, dest),
      startClock(clock),
    ]),
    timing(clock, state, config),
    cond(state.finished, debug("stop clock", stopClock(clock))),
    state.position,
  ]);
}
class LiftMee extends Component {
  
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (
          providerData[i].providerId ===
            firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
          providerData[i].uid === googleUser.getBasicProfile().getId()
        ) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  };



  onSignIn = (googleUser) => {
    // console.log("Google Auth Response", googleUser);

    // console.log("Google login sucess" ) ;
    // // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    // var unsubscribe = firebase.auth().onAuthStateChanged(
    //   function (firebaseUser) {
    //     unsubscribe();
    //     // Check if we are already signed-in Firebase with the correct user.
    //     if (!this.isUserEqual(googleUser, firebaseUser)) {
    //       // Build Firebase credential with the Google ID token.
    //       var credential = firebase.auth.GoogleAuthProvider.credential(
    //         googleUser.idToken,
    //         googleUser.accessToken
    //       );
    //       // Sign in with credential from the Google user.
    //       firebase
    //         .auth()
    //         .signInWithCredential(credential)
    //         .then(function (result) {
    //           console.log("User signed in");
    //           firebase
    //             .database()
    //             .ref("/users/" + result.user.uid)
    //             .set({
    //               gmail: result.user.email,
    //               profile_picture: result.additionalUserInfo.profile.photoUrl,
    //               locale: result.additionalUserInfo.profile.locale,
    //               first_name: result.additionalUserInfo.profile.givenname,
    //               last_name: result.additionalUserInfo.profile.familyname,
    //             })
    //             .then(function (snapshot) {
    //               console.log(snapshot);
    //             });
    //         })
    //         .catch(function (error) {
    //           // Handle Errors here.
    //           var errorCode = error.code;
    //           var errorMessage = error.message;
    //           // The email of the user's account used.
    //           var email = error.email;
    //           // The firebase.auth.AuthCredential type that was used.
    //           var credential = error.credential;
    //           // ...
    //         });
    //     } else {
    //       console.log("User already signed-in Firebase.");
    //     }
    //   }.bind(this)
    // );
         var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // console.log(credential);

          firebase.auth().signInWithCredential(credential).then(result=>{
            console.log(result);
            // var user ={
             
            // } ;
            firebase.database().ref('users/' + result.user.uid).set({
               gmail: result.user.email,
              profile_picture: result.user.photoURL,
              locale: result.additionalUserInfo.profile.locale,
              first_name:""+ result.additionalUserInfo.profile.givenname,
            }).then(data=>{
              console.log(data);
              this.props.navigation.navigate("DashboardScreen");
            }).catch(err=>{
              console.log(err);
            });
          }).catch(error=>{
            console.log(error);
          })

  };

signInWithFacebook = async()=>{
    console.log("Login with facebook");
  
}
signInWithEmailPasword = async()=>{
  
  var email = this.state.email  ;
  var password  =this.state.password  ;
  if(email ==null || password==null){
    console.log("Required field missing");
    return ;
  }
  console.log(this.state);
  await firebase.auth().signInWithEmailAndPassword(email , password).then(result=>{
    console.log(result);
    //saving to database wil be handled here
    firebase.database().ref('users/' + result.user.uid).set({
      gmail: result.user.email,
     profile_picture:"" +result.user.photoURL,
     locale:"" +result.additionalUserInfo.profile.locale,
     first_name:""+ result.additionalUserInfo.profile.givenname,
   }).then(data=>{
     console.log(data);
     this.props.navigation.navigate("DashboardScreen");
   }).catch(err=>{
     console.log(err);
   });
  }) .catch(err=>{
    console.log(err);
  }) ; 

}
emailChangedHandler = (text)=>{
  console.log(text);
  this.setState({
    email:text
  });
  // console.log(this.state);
}

passwordChangedHandler = (text)=>{
  console.log(text);
  this.setState({
    password:text
  })
}
  signInWithGoogleAsync = async () => {
    try {

      const result = await Google.logInAsync({
        androidClientId:
          "386699056443-4omels6dlg81bhf1ve7g5jul5945jcde.apps.googleusercontent.com",
        //iosClientId: YOUR_CLIENT_ID_HERE,
        behaviour: "web",
        scopes: ["profile", "email"],
      });

      if (result.type === "success") {
        this.onSignIn(result);
        return result.accessToken;
      } else {
        return { cancelled: true };
      }
    } catch (e) {
      return { error: true };
    }
  };

  constructor() {
    super();

    this.buttonOpacity = new Value(1);
    this.state = {email: null , password:null};
    this.onStateChange = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 1, 0))
            ),
          ]),
      },
    ]);
    this.onCloseState = event([
      {
        nativeEvent: ({ state }) =>
          block([
            cond(
              eq(state, State.END),
              set(this.buttonOpacity, runTiming(new Clock(), 0, 1))
            ),
          ]),
      },
    ]);

    this.buttonY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [100, 0],
      extrapolate: Extrapolate.CLAMP,
    });

    this.bgY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [-height / 3 - 20, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    this.textInputZindex = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, -1],
      extrapolate: Extrapolate.CLAMP,
    });
    this.textInputY = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [0, 100],
      extrapolate: Extrapolate.CLAMP,
    });
    this.textInputOpasity = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [1, 0],
      extrapolate: Extrapolate.CLAMP,
    });
    this.rotateCross = interpolate(this.buttonOpacity, {
      inputRange: [0, 1],
      outputRange: [180, 360],
      extrapolate: Extrapolate.CLAMP,
    });
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          justifyContent: "flex-end",
        }}
      >
        <Animated.View
          style={{
            ...StyleSheet.absoluteFill,
            transform: [{ translateY: this.bgY }],
          }}
        >
          <Svg height={height + 50} width={width}>
            <ClipPath id="clip">
              <Circle r={height + 50} cx={width / 2} />
            </ClipPath>
            <Image
              href={require("../assets/background.png")}
              width={width}
              height={height + 50}
              preserveAspectRatio="xMidMId slice"
              clipPath="url(#clip)"
            />
          </Svg>
        </Animated.View>
        <View style={{ height: height / 3, justifyContent: "center" }}>
          <TapGestureHandler onHandlerStateChange={this.onStateChange}>
            <Animated.View
              style={{
                ...styles.button,
                opacity: this.buttonOpacity,
                backgroundColor: "black",
                transform: [{ translateY: this.buttonY }],
              }}
            >
              <Text
                style={{ fontSize: 20, fontWeight: "bold", color: "white" }}
              >
                SIGN IN WITH EMAIL
              </Text>
            </Animated.View>
          </TapGestureHandler>
          <Animated.View
            style={{
              ...styles.button,
              backgroundColor: "#2E71DC",
              opacity: this.buttonOpacity,
              transform: [{ translateY: this.buttonY }],
            }}
          >
            <Button
            
            title="SIGN IN WITH FACEBOOK"
            onPress={()=>this.signInWithFacebook()}
            color="#2E71DC">

            </Button>
          </Animated.View>
          <Animated.View
            style={{
              ...styles.button,
              backgroundColor: "white",
              opacity: this.buttonOpacity,
              transform: [{ translateY: this.buttonY }],
            }}
          >
            <Button
              onPress={() => this.signInWithGoogleAsync()}
              title=" SIGN IN WITH GOOGLE"
            />
          </Animated.View>
          <Animated.View
            style={{
              zIndex: this.textInputZindex,
              opacity: this.textInputOpasity,
              transform: [{ translateY: this.textInputY }],
              height: height / 3,
              ...StyleSheet.absoluteFill,
              top: null,
              justifyContent: "center",
            }}
          >
            <TapGestureHandler onHandlerStateChange={this.onCloseState}>
              <Animated.View style={styles.closeButton}>
                <Animated.Text
                  style={{
                    fontSize: 35,
                    transform: [{ rotate: concat(this.rotateCross, "deg") }],
                  }}
                >
                  X
                </Animated.Text>
              </Animated.View>
            </TapGestureHandler>
            <TextInput
              onChangeText={(text)=>this.emailChangedHandler(text)}
              placeholder="Email"
              style={styles.textInput}
              placeholderTextColor="black"
            />
            <TextInput
              onChangeText={(text)=>this.passwordChangedHandler(text)}
              placeholder="Password"
              style={styles.textInput}
              placeholderTextColor="black"
            />
            <Animated.View
              style={{
                ...styles.button,
                shadowColor: "#000",
                shadowOffset: {
                  width: 2,
                  height: 2,
                },
                shadowOpacity: 0.43,
                shadowRadius: 9.51,

                elevation: 15, 
              }}
            >
              <Button title="Sign in" 
              onPress={()=>this.signInWithEmailPasword()}
              ></Button>
              {/* <Text style={{ fontSize: 20, fontWeight: "bold" }}>SignIn</Text> */}
            </Animated.View>
          </Animated.View>
        </View>
      </View>
    );
  }
}
export default LiftMee;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "white",
    height: 60,
    marginHorizontal: 40,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  closeButton: {
    height: 50,
    width: 50,
    backgroundColor: "white",
    borderRadius: 25,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: -25,
    left: width / 2 - 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,

    elevation: 10,
  },
  textInput: {
    height: 60,
    borderRadius: 35,
    borderWidth: 5,
    marginHorizontal: 40,
    paddingLeft: 25,
    marginVertical: 5,
    borderColor: "rgba(0,0,0,0.2)",
  },
});