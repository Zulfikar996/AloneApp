import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {Component, useEffect} from 'react';
import {
  StyleSheet,
} from 'react-native';

import {
  LearnMoreLinks,
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from './src/screen/home/home';
import LoginScreen from './src/screen/user/login';
import RegisterScreen from './src/screen/user/register';
import ChatRoom from './src/screen/chat/chatRoom';
import MapsScreen from './src/screen/chat/maps'
import SplashScreen from 'react-native-splash-screen'
import FriendProfile from './src/screen/profile/profileFriend'
import {createAppContainer, createSwitchNavigator} from 'react-navigation';

const homeNavigator = createStackNavigator(
  {
    Register: {
      screen: RegisterScreen,
      navigationOptions: {
        header: false,
      },
    },
    Login: {
      screen: LoginScreen,
      navigationOptions: {
        header: false,
      },
    },
    Conversation: {
      screen: ChatRoom,
    },
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        header: false,
      },
    },
    Maps: {
      screen: MapsScreen,
    },
    Friend : {
      screen: FriendProfile,
    },

  },
  {
    initialRouteName: 'Login',
  },
);

const AppNavigator = createSwitchNavigator({
  Home: homeNavigator,
});

const AppContainer = createAppContainer(AppNavigator);

function App() {
  useEffect(() => {
    SplashScreen.hide()
  }, []);
  console.disableYellowBox = true;
  return (
    <AppContainer />
  )
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
});


export default App;
