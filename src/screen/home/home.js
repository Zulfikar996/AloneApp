import React, {Component} from 'react';
import {
  Container,
  Header,
  Tab,
  Tabs,
  TabHeading,
  Content,
  Footer,
  FooterTab,
  Button,
  Badge,
} from 'native-base';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import Chat from '../chat/chat';
import Profile from '../profile/profile';
import Setting from '../settings/setting';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {auth, db} from '../../config/config';
import GetLocation from 'react-native-get-location';
import User from '../../../user';
import def from '../../../image/logoava.png';

const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: '#39504E',
  },
  tabs: {
    flexDirection: 'column',
    backgroundColor: '#405A58',
  },
  icon: {
    color: 'grey',
    fontSize: 20,
  },
  search: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 10,
    paddingLeft: 30,
    backgroundColor: '#405A58',
    color: 'white',
  },
});

export default class HomeScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
    user: []
    }
  }

  async componentDidMount() {
    await db.ref('user').on('child_added', val => {
      console.log('kldmafkmsakl',val)
      let person = val.val();
      person.uid = val.key;
      if (person.uid === auth.currentUser.uid) {
        User.name = person.name;
        User.photo = person.photo ? person.photo : def;
        User.status = person.status;
        User.email = person.email;
      } else {
        this.setState(prevState => {
          return {
            user: [...prevState.user, person],
          };
        });
      }
    });
  }

  logout = () => {
    auth.signOut().then(() => this.props.navigation.navigate('Login'));
  };
  render() {
    return (
      <Container>
        <Header hasTabs style={styles.header}>
          <View style={{flex: 1}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <View style={{flex: 9}}>
                <Text style={{fontSize: 30, color: 'grey', fontWeight: 'bold'}}>
                  Alone
                </Text>
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity>
                  <Icon
                    name="settings"
                    style={{fontSize: 25, color: 'grey', paddingTop: 10}}
                    onPress={this.logout}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flex: 1}}>
              <Icon
                name="search"
                style={{
                  position: 'absolute',
                  fontSize: 30,
                  color: 'gray',
                  paddingTop: 4,
                  zIndex: 99,
                }}
              />
              <TextInput placeholder="Search...." style={styles.search} />
            </View>
          </View>
        </Header>
        <Tabs>
          <Tab
            heading={
              <TabHeading style={styles.tabs}>
                <Icon name="chat-bubble" style={styles.icon} />
                <Text style={{color: 'white'}}>Chat</Text>
              </TabHeading>
            }>
            <Chat />
          </Tab>
          <Tab
            heading={
              <TabHeading style={styles.tabs}>
                <Icon name="list" style={styles.icon} />
                <Text style={{color: 'white'}}>Contact list</Text>
              </TabHeading>
            }>
            <Setting />
          </Tab>
          <Tab
            heading={
              <TabHeading style={styles.tabs}>
                <Icon name="person" style={styles.icon} />
                <Text style={{color: 'white'}}>Profile</Text>
              </TabHeading>
            }>
            <Profile />
          </Tab>
        </Tabs>
      </Container>
    );
  }
}
