import React, { useEffect, useState } from 'react';
import {addUser, getUser} from '../api/movieAPI';
import { Button, Modal, Text , TextInput, TouchableOpacity, View } from 'react-native';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { RootStackParamList } from '../types/types';
import { brightnessMode } from '../states/brightnessMode';
import { useRecoilState } from 'recoil';
import { refreshed } from '../states/refreshed';


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
    getUser(email)
      .then((value) => {
        if (value.length == 1 && value[0].password == password) {
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
        if (!(await checkUser())) {
          addUser(email, password);
          AsyncStorage.setItem("email", email);
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
        AsyncStorage.setItem("email", email);
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
        <View>
          <Text></Text>
          <Text></Text>
          <Text>Movie Search</Text>
          <Text> {title} </Text>
          <TextInput placeholder={"E-mail"} value={email} onChangeText={(text) => setEmail(text.toLowerCase())}/>
          {errorMessageMail ? <Text>Mail already taken</Text> : <></>}
          <TextInput placeholder={"Password"} value={password} onChangeText={(text) => setPassword(text)}/>
          {!showSignUp ?  <></> : <TextInput secureTextEntry={true}  placeholder={"Confirm password"} value={confirmPassword} onChangeText={(text) => setConfirmPassword(text)}/>}
          {!errorMessage ? <Text>Wrong username or password</Text> : <></>}
          {errorMessagePassword ? <Text>Passwords do not match</Text> : <></>}
          <TouchableOpacity onPress={handleSignUp}><Text> {toggleButton} </Text></TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit}><Text>Sign in</Text></TouchableOpacity>
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