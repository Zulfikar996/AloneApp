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

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      email: '',
      password: '',
      latitude: null,
      longitude: null,
      errorMessage: null,
      visible: false,
      Onprosess: false,
      loading: false,
    };
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

  handleLogin = () => {
    const {email, password} = this.state;
    if (email.length < 6) {
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
      this.setState({loading: true})
      auth
        .signInWithEmailAndPassword(email, password)
        .then(async data => {
          console.log('CHAT HOME')
          this.setState({loading: false})
          this.props.navigation.navigate('Home');
        })
        .catch(error => console.log(error.message));
    }
  };

  render() {
    return (
      <View style={{flex:1}}>
        <Image source={Logo} style={{position: 'absolute',alignItems:'center', width: '100%'}} />
        <View style={{flex: 1, paddingTop: 330}}>
          <Content>
            <Form>
              <View style={{paddingLeft: 60}}>
                <Item style={{width: 300}}>
                  <Input
                    style={{color: 'white'}}
                    placeholder="Email"
                    onChangeText={email => this.setState({email})}
                  />
                </Item>
              </View>
              <View style={{paddingLeft: 60}}>
                <Item style={{width: 300}}>
                  <Input
                    style={{color: 'white'}}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={password => this.setState({password})}
                  />
                </Item>
              </View>
            </Form>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 40,
              }}>
              <Text style={{color: 'grey'}}>Forgot password?</Text>
            </View>
            <TouchableOpacity
              style={{
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#d89f71',
                marginHorizontal: 150,
                borderRadius: 20,
              }}
              onPress={this.handleLogin}>
              <Text>LogIn</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 75,
              }}
              onPress={() => this.props.navigation.navigate('Register')}>
              <Text style={{color: 'grey'}}>
                Don't have account yet? Click here to register!
              </Text>
            </TouchableOpacity>
          </Content>
        </View>
      </View>
    );
  }
}

export default LoginScreen;
