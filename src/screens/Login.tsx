import React, { useEffect, useState } from 'react';
import {addUser, getUser} from '../api/movieAPI';
import { Modal, Text , TouchableOpacity, View, StyleSheet, Image } from 'react-native';
import { TextInput, Button } from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RootStackParamList } from '../types/types';
import { brightnessMode } from '../states/brightnessMode';
import { useRecoilState } from 'recoil';
import { refreshed } from '../states/refreshed';
import ColorModeButton from '../components/ColorModeButton';


type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

const Login = ({navigation}: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [title, setTitle] = useState("Login");
  const [toggleButton, setToggleButton] = useState("Create account");
  const [showSignUp, setShowSignUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState(true);
  const [errorMessagePassword, setErrorMessagePassword] = useState(false);
  const [errorMessageMail, setErrorMessageMail] = useState(false);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useRecoilState(refreshed); //handle if refresh while still logged in (skip login page)
  const [mode, setMode] = useRecoilState(brightnessMode);

  // clear error messages when typing into textinputs
  useEffect (() => {
    setErrorMessage(true);
    setErrorMessagePassword(false);
    setErrorMessageMail(false);
  }, [email, password, confirmPassword]);

  // if user wants to log out
  const handleCloseYes = () => {
    setOpen(false);
    AsyncStorage.setItem("active", "false");
  };
  
  // if user do not want to log out
  const handleCloseNo = () => {
    navigation.goBack();
  };
  
  //check if user was active
  useEffect(() => {
    isActive();
    getEmail();
  },[]);

  // modal pop up if user wants to log out or not
  const isActive = async () => {
      const active = await AsyncStorage.getItem("active");
      if(refresh.hasRefreshed && active === "true") { //if refreshed app while still logged in
        navigation.navigate("Movies");
      }
      else if(active === "true") {
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
    getUser(email.toLowerCase())
      .then((value) => {
        if (value.length == 1 && value[0].password == password) {
          return true;
        } else {
          return false;
        }
  }))}

  //Cheks if user exists in database and correct email-password combination is provided.
  function checkEmail() {
      return (
      getUser(email.toLowerCase())
        .then((value) => {
          if (value.length == 1) {
            return true;
          } else {
            return false;
          }
  }))}

  //handle event when signing in/creating account.
  async function handleSubmit () {

    //Checks if the user is signing in or creating an account.
    if (showSignUp) {
      //Checks if passwords matches and if the email already exists. If not, a new account is created.
      if (password == confirmPassword) {
        if (!(await checkEmail())) {
          addUser(email.toLowerCase(), password);
          AsyncStorage.setItem("email", email.toLowerCase());
          AsyncStorage.setItem("active", "true");
          navigation.navigate('Movies');
        } else {
          setErrorMessageMail(true);
          setErrorMessagePassword(false);
        }
      } else {
        setErrorMessagePassword(true);
      }
    }
    else { //Checks email and password against existing users.
      if (await checkUser()) {
        AsyncStorage.setItem("email", email.toLowerCase());
        AsyncStorage.setItem("active", "true");
        setErrorMessage(true);
        navigation.navigate('Movies');
      } else {
        setErrorMessage(false);
      }
    }
  }; 

  //Toggles between sign in and create new account. 
  function handleSignUp() {
    setErrorMessage(true);
    setErrorMessagePassword(false);
    setErrorMessageMail(false);
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

    return (
      <View>
        <View style={{display: "flex", backgroundColor: mode.backgroundColor, height: "100%", width: "100%"}}>
          <View style={{display: "flex", flex:4, justifyContent: "flex-end", alignItems: "center", flexDirection: "column"}}>   
            <Image source={require("../resources/watchiesLogo.png")} resizeMode="contain" style={{height: "40%", width: "60%"}}/>
          </View>
          <View style={{flex:2, display: "flex", justifyContent: 'space-between', alignItems: "flex-end", flexDirection: 'row'}}>
            <ColorModeButton></ColorModeButton>
            <Button color={mode.buttonColor}> {title} </Button>
          </View>
          <View style={{flex:6, display: "flex", flexDirection: "column", justifyContent: "flex-start"}}>
            <TextInput
              label="Email"
              left={<TextInput.Icon name="email" />}
              mode="flat"
              activeUnderlineColor="purple"
              underlineColor="gray"
              style={{ margin: 10, backgroundColor: mode.inputColor }}
              placeholder={"E-mail"} 
              value={email} 
              onChangeText={(text) => setEmail(text)}
            />
            <TextInput
              label="Password"
              secureTextEntry
              left={<TextInput.Icon name="form-textbox-password" />}
              mode="flat"
              activeUnderlineColor="purple"
              underlineColor="gray"
              style={{ margin: 10, backgroundColor: mode.inputColor }}
              placeholder={"Password"} 
              value={password} 
              onChangeText={(text) => setPassword(text)}
            />
            {showSignUp ?
              <TextInput 
                label="Confirm password"
                secureTextEntry
                left={<TextInput.Icon name="form-textbox-password" />}
                mode="flat"
                activeUnderlineColor="#2985cc"
                underlineColor="gray"
                style={{ margin: 10, backgroundColor: mode.inputColor }}
                placeholder={"Confirm password"} 
                value={confirmPassword} 
                onChangeText={(text) => setConfirmPassword(text)}
              />
                :
              <></>
            }

            <View style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
              {errorMessageMail ? 
                <Text style={{color: "red", margin: 0, padding: 0}}>Mail already taken</Text> 
                  : 
                <></>
              }

              {!errorMessage ?
                <Text style={{color: "red", margin: 0, padding: 0}}>Wrong username or password</Text> 
                  : 
                <></>
              }
              {errorMessagePassword ? 
                <Text style={{color: "red", margin: 0, padding: 0}}>Passwords do not match</Text> 
                  : 
                <></>
              }
            </View>
            <Button color={mode.buttonColor} onPress={handleSignUp}>{toggleButton}</Button>
            <Button color={mode.buttonColor} onPress={handleSubmit}>{(showSignUp) ? "Sign up" : "Sign in"}</Button>
          </View>
        </View>

        <View>
          <Modal
            animationType="none"
            visible={open}
            transparent={false}
          >
            <View>
              <Text>Are you sure you want to log out?</Text>
              <TouchableOpacity onPress={handleCloseYes}>
                <Text>Yes</Text>
              </TouchableOpacity>  
              <TouchableOpacity onPress={handleCloseNo}>
                <Text>No</Text>
              </TouchableOpacity>      
            </View> 
          </Modal>
        </View>
      </View>
    );
};
export default Login;