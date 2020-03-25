import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity, FlatList} from 'react-native-gesture-handler';
import {auth, db, time} from '../../config/config';
import {Thumbnail} from 'native-base';
import ava from '../../../image/logoava.png';

const styles = StyleSheet.create({
  icon: {
    color: 'grey',
    fontSize: 30,
  },
  chat: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.2,
    borderRadius: 15,
    backgroundColor: 'white',
  },
});

class ChatRoom extends Component {
  static navigationOptions = () => {
    return {
      title: 'nanti nama orangnya',
      headerStyle: {
        backgroundColor: '#405A58',
      },
      headerTintColor: 'grey',
      headerTitleStyle: {
        fontSize: 20,
      },
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      name: props.navigation.getParam('name'),
      uid: props.navigation.getParam('uid'),
      textMessage: '',
      messageList: '',
      title: '',
    };
  }

  componentDidMount() {
    db.ref('/messages/')
      .child(`/${auth.currentUser.uid}/`)
      .child(`/${this.state.uid}/`)
      .on('child_added', value => {
        this.setState(prevState => {
          return {
            messageList: [...prevState.messageList, value.val()],
          };
        });
      });
  }

  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      let msgId = (
        await db
          .ref('/messages/')
          .child(`/${auth.currentUser.uid}/`)
          .child(`/${this.state.uid}/`)
          .push()
      ).key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: time,
        from: auth.currentUser.uid,
      };
      updates[
        'messages/' + auth.currentUser.uid + '/' + this.state.uid + '/' + msgId
      ] = message;
      updates[
        'messages/' + this.state.uid + '/' + auth.currentUser.uid + '/' + msgId
      ] = message;
      db.ref().update(updates);
      this.setState({textMessage: ''});
      console.log(this.state.textMessage);
    }
  };

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  convertTime = time => {
    let d = new Date(time);
    let c = new Date();
    let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
    result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    if (c.getDay() !== d.getDay()) {
      result = d.getDay() + '' + d.getMonth() + '' + result;
    }
    return result;
  };

  renderRow = ({item}) => {
    console.disableYellowBox = true;
    // console.log(auth.currentUser.uid)
    const Chat = () => {
      if (item.from == auth.currentUser.uid) {
        return (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Chat', item)}>
            <View
              style={{
                marginHorizontal: 5,
                marginVertical: 5,
                borderColor: '#FFF',
                borderWidth: 1,
                padding: 15,
                borderRadius: 10,
                backgroundColor: '#1bb2ef',
                flexDirection: 'row',
              }}>
              <View style={{flex: 5, paddingLeft: 20, paddingRight: 10}}>
                <Text>{item.message}</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Thumbnail source={ava} />
                <Text style={{top: 5}}>{this.convertTime(item.time)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Chat', item)}>
            <View
              style={{
                marginHorizontal: 5,
                marginVertical: 5,
                borderColor: '#FFF',
                borderWidth: 1,
                padding: 15,
                borderRadius: 10,
                backgroundColor: '#9ab3bd',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Thumbnail source={ava} />
                <Text style={{top: 5}}>{this.convertTime(item.time)}</Text>
              </View>
              <View style={{flex: 5, paddingLeft: 20, paddingRight: 10}}>
                <Text>{item.message}</Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    };
    return (
      <View>
        <Chat />
      </View>
    );
  };

  render() {
    let {height, width} = Dimensions.get('window');
    return (
      <>
        <View style={{flex: 12}}>
          <FlatList
            style={{padding: 10, height: height * 0.8}}
            data={this.state.messageList}
            renderItem={this.renderRow}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <View style={{flex: 1, backgroundColor: 'white', flexDirection: 'row'}}>
          <View style={{flex: 1, justifyContent: 'center'}}>
            <TouchableOpacity>
              <Icon
                name="add"
                style={styles.icon}
                onPress={() => this.props.navigation.navigate('Maps')}
              />
            </TouchableOpacity>
          </View>
          <View style={{flex: 8, justifyContent: 'center'}}>
            <TextInput
              placeholder="Type message"
              style={styles.chat}
              onChangeText={this.handleChange('textMessage')}
            />
          </View>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity onPress={this.sendMessage}>
              <Icon name="send" style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  }
}

export default ChatRoom;
