import React, {Component} from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';
import {
  Content,
  List,
  ListItem,
  Left,
  Body,
  Right,
  Thumbnail,
} from 'native-base';
import ava from '../../../image/logoava.png';
import {TouchableOpacity, FlatList} from 'react-native-gesture-handler';
import {withNavigation} from 'react-navigation';
import {db, auth} from '../../config/config';
import GetLocation from 'react-native-get-location'


const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#E8FBF9',
  },
});

class ChatScreen extends Component {
  state = {
    users: [],
    latitude: '',
    longitude: '',
  };

  componentDidMount() {
    this.getUser();
    this.getLocation()
  }

  getLocation(){
    const id = auth.currentUser.uid
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000
    })
    .then(location => {
      db.ref('/user/' + id ).child("latitude").set(location.latitude)
      db.ref('/user/' + id ).child("longitude").set(location.longitude)
    })
    .catch(error => {
      const { code, message} = error;
      console.warn(code, message);
    })
    this._isMounted = true;
  }

  getUser() {
    db.ref('/user').on('value', snapshot => {
      const current_user = auth.currentUser.uid;
      const data = snapshot.val();
      const user = Object.values(data);
      const result = user.filter(user => user.uid !== current_user);
      this.setState({
        users: result,
      });
    });
  }

  renderRow = ({item}) => {
    let photoThere = <Thumbnail source={{uri: `${item.photo}`}} />;
    let photoNull = <Thumbnail source={{uri: `https://firebasestorage.googleapis.com/v0/b/aloneapp-d893b.appspot.com/o/profile%2Flogoava.png?alt=media&token=2e22eac8-dda3-4234-938b-fd1f92dc5f1e`}} />

    let photoCheck;
    if(item.photo){
      photoCheck = photoThere
    }
    else {
      photoCheck = photoNull
    }
    return (
      <Content>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('Conversation', item)}>
          <List>
            <ListItem avatar>
              <Left>
                {photoCheck}
              </Left>
              <Body>
                <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
                <Text note>{item.status}</Text>
              </Body>
              <Right>
                <Text note>3:43 pm</Text>
              </Right>
            </ListItem>
          </List>
        </TouchableOpacity>
      </Content>
    );
  };

  render() {
    return (
      <>
        <View>
          <StatusBar backgroundColor="#39504E" barStyle="light-content" />

          <FlatList
            data={this.state.users}
            renderItem={this.renderRow}
            keyExtractor={item => {
              item.uid;
            }}
          />
        </View>
      </>
    );
  }
}

export default withNavigation(ChatScreen);
