import React, {Component} from 'react';
import {Text, Image} from 'react-native';
import {db} from '../../config/config';
import {View} from 'native-base';
import Icon from 'react-native-vector-icons/Entypo'
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class FriendProfile extends Component {
  static navigationOptions = {
    headerTransparent: true,
    title: '',
  };
  state = {
    users: [],
  };
  componentDidMount() {
    this.getDetails();
  }
  getDetails() {
    const id = this.props.navigation.state.params;
    db.ref('/user/' + id).on('value', snapshot => {
      const user = snapshot.val();
      this.setState({
        users: user,
      });
    });
  }

  render() {
    return (
      <>
       <Image
            style={{width: '100%', height: '30%'}}
            source={{uri: `${this.state.users.photo}`}}
          />
        <View style={{backgroundColor: '#efefef', marginLeft: 2}}>
         

          <View>
            <Text style={{fontWeight: 'bold', color: 'grey', fontSize: 40}}>
              {this.state.users.name}
            </Text>
          </View>
        </View>
      </>
    );
  }
}