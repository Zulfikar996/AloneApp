import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ToastAndroid,
  ImageBackground,
  Image
} from 'react-native';
import {Container, Header, Content, Form, Item, Input} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {auth, db} from '../../config/config';
import Logo from '../../../image/drawable-hdpi/Group1.png';

class RegisterScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      name: '',
      email: '',
      password: '',
      uid: '',
      latitude: null,
      longitude: null,
      errorMessage: null,
      loading: false,
      updatesEnabled: false,
    };
    this.handleSignUp = this.handleSignUp.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  hideToast = () => {
    this.setState({
      visible: false,
    });
  };

  handleSignUp = async () => {
    const {email, name, password} = this.state;
    if (name.length < 1) {
      ToastAndroid.show('Please input your fullname', ToastAndroid.LONG);
    } else if (email.length < 6) {
      ToastAndroid.show(
        'Please input a valid email address',
        ToastAndroid.LONG,
      );
    } else if (password.length < 6) {
      ToastAndroid.show(
        'Password must be at least 6 characters',
        ToastAndroid.LONG,
      );
    } else {
      // Action
      await auth
        .createUserWithEmailAndPassword(email, password)
        .then(async userCredentials => {
          db.ref('/user/' + userCredentials.user.uid)
            .set({
              name: this.state.name,
              status: 'Online',
              email: this.state.email,
            })
            .catch(error => console.log(error.message));

          console.log(userCredentials);
          ToastAndroid.show('Success', ToastAndroid.LONG);

          if (userCredentials.user) {
            userCredentials.user
              .updateProfile({
                displayName: this.state.name,
                photoURL: 'http://linkphoto.com',
              })
              .then(s => {
                this.props.navigation.navigate('Login');
              });
          }
        })
        .catch(error => {
          ToastAndroid.show(error.message, ToastAndroid.LONG);
        });
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
      <Image
          source={Logo}
          style={{position: 'absolute', alignItems: 'center', width: '100%'}}
        />
        <View style={{flex: 1, paddingTop: 330}}>
          <Content>
            <View style={{paddingLeft: 60}}>
              <Item style={{width: 300}}>
                <Input
                  style={{color: 'white'}}
                  onChangeText={name => this.setState({name})}
                  value={this.state.name}
                  placeholder="Name"
                />
              </Item>
            </View>
            <View style={{paddingLeft: 60}}>
              <Item style={{width: 300}}>
                <Input
                  style={{color: 'white'}}
                  onChangeText={email => this.setState({email})}
                  value={this.state.email}
                  placeholder="Email"
                />
              </Item>
            </View>
            <View style={{paddingLeft: 60}}>
              <Item style={{width: 300}}>
                <Input
                  style={{color: 'white'}}
                  secureTextEntry
                  onChangeText={password => this.setState({password})}
                  value={this.state.password}
                  placeholder="Password"
                />
              </Item>
            </View>
            <View style={{paddingTop: 10}}>
              <TouchableOpacity
                style={{
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#d89f71',
                  marginHorizontal: 150,
                  borderRadius: 20,
                }}
                onPress={this.handleSignUp}>
                <Text>Signup</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={{
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 75,
              }}
              onPress={() => this.props.navigation.navigate('Login')}>
              <Text style={{color: 'grey'}}>
                Already have account? Click here to Login!
              </Text>
            </TouchableOpacity>
          </Content>
        </View>
        </View>
    );
  }
}

export default RegisterScreen;
