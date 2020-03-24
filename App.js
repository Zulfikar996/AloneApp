import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import {
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {createStackNavigator} from 'react-navigation-stack';

import HomeScreen from './src/screen/home/home';
import LoginScreen from './src/screen/user/login';
import RegisterScreen from './src/screen/user/register';
import ChatRoom from './src/screen/chat/chatRoom';
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
  },
  {
    initialRouteName: 'Login',
  },
);

const AppNavigator = createSwitchNavigator({
  Home: homeNavigator,
});

const AppContainer = createAppContainer(AppNavigator);

class App extends Component {
  render() {
    console.disableYellowBox = true;
    return <AppContainer />;
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
});

export default App;
