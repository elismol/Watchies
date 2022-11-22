import React, { useEffect, useState } from 'react';
import {addUser, getUser} from '../api/movieAPI';
import { Modal, Text , View, Image } from 'react-native';
import { TextInput, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { IMovieType, RootStackParamList } from '../types/types';
import { brightnessMode } from '../states/brightnessMode';
import { useRecoilState } from 'recoil';
import { refreshed } from '../states/refreshed';
import ColorModeButton from '../components/ColorModeButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { wHeight, wWidth } from '../utils/Utils';
import { showAccount } from '../states/showAccount';
import { initialMovieState, modalMovie } from '../states/modalMovie';
import { favouriteMoviesList } from '../states/favouriteMoviesList';
import { lightMode } from '../themes/themes';


type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({navigation}: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [title, setTitle] = useState("Login");
  const [toggleButton, setToggleButton] = useState("Create account");
  const [showSignUp, setShowSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorMessagePassword, setErrorMessagePassword] = useState(false);
  const [errorMessageMail, setErrorMessageMail] = useState(false);
  const [errorMessageEmpty, setErrorMessageEmpty] = useState(false);
  const [errorMessageMailSyntax, setErrorMessageMailSyntax] = useState(false);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useRecoilState(refreshed); //handle if refresh while still logged in (skip login page)
  const [mode, setMode] = useRecoilState(brightnessMode);
  const [showAccountState, setShowAccountState] = useRecoilState(showAccount);
  const [modal, setModal] = useRecoilState(modalMovie);
  const [favourites, setFavourites] = useRecoilState(favouriteMoviesList);
  const [active, setActive] = useState(true);

  // clear error messages when typing into textinputs
  useEffect (() => {
    setErrorMessage(false);
    setErrorMessagePassword(false);
    setErrorMessageMail(false);
    setErrorMessageEmpty(false);
    setErrorMessageMailSyntax(false);
  }, [email, password, confirmPassword]);

  // if user wants to log out
  const handleCloseYes = () => {
    setShowAccountState({show: false});
    setModal({movie: initialMovieState, openModal: false});
    setRefresh({hasRefreshed: false, refresh: true});
    setOpen(false);
    AsyncStorage.setItem("active", "false");
    setActive(false);
    setFavourites({movies: new Array<IMovieType>()})
  };
  
  // if user do not want to log out
  const handleCloseNo = () => {
    navigation.navigate("Movies");
  };
  
  //check if user was active
  useEffect(() => {
    isActive();
    getTheme();
    getEmail();
  },[]);

  // set theme of app dark/light
  const getTheme = async () => {
    const activeMode = await AsyncStorage.getItem("mode");
    if(activeMode === "lightMode") {
      setMode(lightMode);
    }
  };

  // modal pop up if user wants to log out or not
  const isActive = async () => {
      const activeValue = await AsyncStorage.getItem("active");
      setActive(activeValue === "true");
      if(refresh.hasRefreshed && activeValue === "true") { //if refreshed app while still logged in
        setRefresh({hasRefreshed: true, refresh: true});
        navigation.navigate("Movies");
      }
      else if(activeValue === "true") {
        setOpen(true);
      } 
      else {
        setOpen(false);
      }
  };

  //get email for textinput
  const getEmail = async () => {
    const previousEmail = await AsyncStorage.getItem("email");
    if(previousEmail !== undefined) {
      setEmail(previousEmail || "");
    }
};

  //Cheks if user exists in database and correct email-password combination is provided.
  function checkUser() {
    return (
    getUser(email.toLowerCase().trim())
      .then((value) => {
        if (value.length == 1 && value[0].password == password) {
          return true;
        } 
        else {
          return false;
        }
  }))}

  //Cheks if user exists in database and correct email-password combination is provided.
  function checkEmail() {
      return (
      getUser(email.toLowerCase().trim())
        .then((value) => {
          if (value.length == 1) {
            return true;
          } else {
            return false;
          }
  }))}

  //handle event when signing in/creating account.
  async function handleSubmit () {

    //checks if email contain "@" and "."
    if (!email.includes("@") || !email.includes(".") || email.trim().includes(" ")) {
      setErrorMessageMailSyntax(true);
    }

    //checks if email or password is empty
    else if(email === "" || password === "" || (showSignUp && confirmPassword === "")) {
      setErrorMessageEmpty(true);
      return;
    }

    //Checks if the user is signing in or creating an account.
    else if (showSignUp) {
      //Checks if passwords matches and if the email already exists. If not, a new account is created.
      if (password == confirmPassword) {
        if (!(await checkEmail())) {
          addUser(email.toLowerCase().trim(), password);
          AsyncStorage.setItem("email", email.toLowerCase().trim());
          AsyncStorage.setItem("active", "true");
          setRefresh({hasRefreshed: true, refresh: true});
          navigation.navigate('Movies');
        } 
        else {
          setErrorMessageMail(true);
        }
      } 
      else {
        setErrorMessagePassword(true);
      }
    }

    else { //Checks email and password against existing users.
      if (await checkUser()) {
        AsyncStorage.setItem("email", email.toLowerCase().trim());
        AsyncStorage.setItem("active", "true");
        setErrorMessage(false);
        setRefresh({hasRefreshed: true, refresh: true});
        navigation.navigate('Movies');
      } 
      else {
        setErrorMessage(true);
      }
    }
  }; 

  //Toggles between sign in and create new account. 
  function handleSignUp() {
    setErrorMessage(false);
    setErrorMessagePassword(false);
    setErrorMessageMail(false);
    setErrorMessageEmpty(false);
    setErrorMessageMailSyntax(false);
    if (toggleButton == "Create account") {
      setTitle("Create account")
      setToggleButton("Already have an account?")
      setShowSignUp(true);
    } else {
      setToggleButton("Create account")
      setTitle("Login")
      setShowSignUp(false);
    }
  }

  // note: every view that is wrapping a whole page needs flex: 1 or else it will flash white when chaning page
    return (
      <SafeAreaView style={{backgroundColor: mode.backgroundColor, flex: 1}}>
        <View>
          <Modal
            animationType="fade"
            visible={open}
            transparent={false}
          >
            <View style={{flex: 1, backgroundColor: mode.backgroundColor, justifyContent: 'center', flexDirection: "column"}}>
              <View style={{display: "flex", justifyContent: "flex-end", alignItems: "center"}}>
                <Text style={{color: mode.fontColor, marginBottom: wHeight(3), fontSize: 20}}>Are you sure you want to log out?</Text>
              </View>
              <View style={{display: "flex", flexDirection: "row", justifyContent: "space-evenly"}}>
                <Button onPress={handleCloseYes} textColor={mode.fontColor} style={{backgroundColor: mode.buttonLogOutColor}}>Yes</Button>
                <Button onPress={handleCloseNo} textColor={mode.fontColor} style={{backgroundColor: mode.buttonLogOutColor}}>No</Button>
              </View> 
            </View>
          </Modal>
        </View>
        
        {(refresh.refresh && !active) ?
        <View style={{display: "flex", height: "100%", width: "100%"}}>
          <View style={{display: "flex", flex:4, justifyContent: "flex-end", alignItems: "center", flexDirection: "column"}}>   
            <Image source={require("../resources/watchiesLogo.png")} resizeMode="contain" style={{height: "40%", width: "60%"}}/>
          </View>
          <View style={{flex:2, display: "flex", justifyContent: 'space-between', alignItems: "flex-end", flexDirection: 'row'}}>
            <ColorModeButton></ColorModeButton>
            <Button color={mode.buttonColor}><Text style={{fontSize: wHeight(1.4)}}>{title}</Text></Button>
          </View>
          <View style={{flex:6, display: "flex", flexDirection: "column", justifyContent: "flex-start"}}>
            <TextInput
              label="Email"
              left={<TextInput.Icon icon="email" />}
              mode="flat"
              activeUnderlineColor="purple"
              underlineColor="gray"
              style={{ margin: wHeight(1), backgroundColor: mode.inputBackgroundColor }}
              placeholder={"E-mail"} 
              value={email} 
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              label="Password"
              secureTextEntry
              left={<TextInput.Icon icon="form-textbox-password" />}
              mode="flat"
              activeUnderlineColor="purple"
              underlineColor="gray"
              style={{ margin: wHeight(1), backgroundColor: mode.inputBackgroundColor }}
              placeholder={"Password"} 
              value={password} 
              onChangeText={(text) => setPassword(text)}
            />
            {showSignUp ?
              <TextInput 
                label="Confirm password"
                secureTextEntry
                left={<TextInput.Icon icon="form-textbox-password" />}
                mode="flat"
                activeUnderlineColor="purple"
                underlineColor="gray"
                style={{ margin: wHeight(1), backgroundColor: mode.inputBackgroundColor }}
                placeholder={"Confirm password"} 
                value={confirmPassword} 
                onChangeText={(text) => setConfirmPassword(text)}
              />
                :
              <></>
            }

            <View style={{display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: mode.errorMessageColor, marginHorizontal: wWidth(22), borderRadius: 4}}>
            {errorMessageMailSyntax ? 
                <Text style={{color: mode.fontColor, margin: 0, padding: 0, fontWeight: "bold", marginVertical: wHeight(0.5), fontSize: wWidth(3.5)}}>Invalid E-mail</Text> 
                  : 
                <></>
              }
              
              {errorMessageEmpty ? 
                <Text style={{color: mode.fontColor, margin: 0, padding: 0, fontWeight: "bold", marginVertical: wHeight(0.5), fontSize: wWidth(3.5)}}>All fields are required</Text> 
                  : 
                <></>
              }
              
              {errorMessageMail ? 
                <Text style={{color: mode.fontColor, margin: 0, padding: 0, fontWeight: "bold", marginVertical: wHeight(0.5), fontSize: wWidth(3.5)}}>E-mail already taken</Text> 
                  : 
                <></>
              }

              {errorMessage ?
                <Text style={{color: mode.fontColor, margin: 0, padding: 0, fontWeight: "bold", marginVertical: wHeight(0.5), fontSize: wWidth(3.5)}}>Wrong e-mail or password</Text> 
                  : 
                <></>
              }
              {errorMessagePassword ? 
                <Text style={{color: mode.fontColor, margin: 0, padding: 0, fontWeight: "bold", marginVertical: wHeight(0.5), fontSize: wWidth(3.5)}}>Passwords do not match</Text> 
                  : 
                <></>
              }
            </View>
            <Button color={mode.buttonColor} onPress={handleSignUp}>
              <Text style={{fontSize: wWidth(3.8)}}>{toggleButton}</Text>
            </Button>
            <Button color={mode.buttonColor} onPress={handleSubmit}>
              <Text style={{fontSize: wWidth(3.8)}}>{(showSignUp) ? "Sign up" : "Sign in"}</Text>
            </Button>
          </View>
        </View>
          :
        <></>
        }
      </SafeAreaView>
    );
};
export default Login;