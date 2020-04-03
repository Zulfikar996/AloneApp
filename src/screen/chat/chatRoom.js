import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, Dimensions, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity, FlatList} from 'react-native-gesture-handler';
import {auth, db, time} from '../../config/config';
import {Thumbnail} from 'native-base';
import moment from 'moment';
import User from '../../../user';

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
  static navigationOptions = ({navigation}) => {
    const id = navigation.getParam('uid');
    return {
      headerTitle: (
        <View>
          <View>
        <TouchableOpacity onPress={() => navigation.navigate('Friend', id)}>
          <Text style={{fontWeight: 'bold', fontSize: 20, color: 'grey'}}>
            {navigation.getParam('name', null)}
          </Text>
        </TouchableOpacity>
          </View>
          <View>
        <Text>
          {navigation.getParam('status', null)}
        </Text>
          </View>
        </View>
      ),
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
      photo: props.navigation.getParam('photo'),
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
    const Chat = () => {
      if (item.from == auth.currentUser.uid) {
        return (
          
            <View
              style={{
                marginVertical: 5,
                padding: 15,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-end',
              }}>
              <View
                style={{
                  padding: 10,
                  borderTopRightRadius: 10,
                  borderTopLeftRadius: 10,
                  borderBottomLeftRadius: 10,
                  backgroundColor: '#9ab3bd',
                  maxWidth: 300,
                  right: 5
                }}>
                <Text>{item.message}</Text>
              </View>
              <View>
                <Thumbnail source={{uri: `${User.photo}`}} />
                <Text style={{top: 5}}>{moment(item.time).format('LT')}</Text>
              </View>
            </View>
        );
      } else {
        return (
            <View
              style={{
                marginVertical: 5,
                padding: 15,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Thumbnail source={{uri: `${this.state.photo}`}} />
                <Text style={{top: 5}}>{moment(item.time).format('LT')}</Text>
              </View>
              <View
                style={{
                  padding: 10,
                  borderBottomRightRadius: 10,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  backgroundColor: '#9ab3bd',
                  maxWidth: 300,
                }}>
                <Text>{item.message}</Text>
              </View>
            </View>
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
        <StatusBar backgroundColor="#39504E" barStyle="light-content" />

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
