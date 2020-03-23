import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

const styles = StyleSheet.create ({
  background:{
    flex: 1,
    backgroundColor: '#C7E9E7'
  }
})


class ChatScreen extends Component{

render() {
    return (
      <>
        <View style={styles.background}>
            <Text>ini chat</Text>
        </View>
      </>
    );
  };
}
  
  export default ChatScreen;