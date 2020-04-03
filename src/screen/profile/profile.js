import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TextInput,
  ToastAndroid
} from 'react-native';
import {Thumbnail} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import {auth, db} from '../../config/config';
import firebase from 'firebase';
import User from '../../../user';

class ProfileScreen extends Component {
  state = {
    imageSource: require('../../../image/logoava.png'),
    upload: false,
  };

  state = {
    imageSource: {uri: User.photo},
    upload: false,
    names: '',
    name: User.name,
    photo: User.photo,
    email: User.email
  };

  onSubmitName = async () => {
    const { name } = this.state;
    if(name.length < 1) {
      ToastAndroid.show(
        'Please input a valid Name',
        ToastAndroid.LONG )
    } else {
      User.name = name,
      await this.updateUser()
          }

  }

  updateUser = () => {
    db.ref('/user/').child(auth.currentUser.uid).set(User)
    ToastAndroid.show('Success', ToastAndroid.LONG);
  }

  changeImage = () => {
    const options = {
      quality: 0.7,
      allowsEditing: true,
      mediaType: 'photo',
      noData: true,
      storageOptions: {
        skipBackup: true,
        waitUntilSaved: true,
        path: 'images',
        cameraRoll: true,
      },
    };
    ImagePicker.showImagePicker(options, response => {
      if (response.error) {
        console.log(error);
      } else if (!response.didCancel) {
        this.setState(
          {
            upload: true,
            imageSource: {uri: response.uri},
          },
          this.uploadFile,
        );
      }
    });
  };

  updateUserImage = async imageUrl => {
    const id = auth.currentUser.uid;
    auth.currentUser.photo = imageUrl;
    await db
      .ref('/user/' + id)
      .child('photo')
      .set(imageUrl);
    Alert.alert('Succes', 'image changed successfull');
    this.setState({upload: false, imageSource: {uri: imageUrl}});
  };

  uploadFile = async () => {
    const file = await this.uriToBlob(this.state.imageSource.uri);
    firebase
      .storage()
      .ref(`profile/${auth.currentUser.uid}.png`)
      .put(file)
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then(url => this.updateUserImage(url))
      .catch(error => {
        this.setState({
          upload: false,
          imageSource: require('../../../image/logoava.png'),
        });
        Alert.alert('Error', 'Error on upload Image');
      });
  };

  uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };

      xhr.onerror = function() {
        reject(new Error('Error on upload image'));
      };

      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
  };

  render() {
    return (
      <>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={this.changeImage}>
            {this.state.upload ? (
              <ActivityIndicator size="large" />
            ) : (
              <Thumbnail large source={this.state.imageSource} />
            )}
          </TouchableOpacity>
        </View>
        <View style={{flex: 6}}>
          <View
            style={{
              borderBottomColor: 'grey',
              borderBottomWidth: 0.5,
              justifyContent: 'center',
              height: 75,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 6}}>
                <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                  Display Name
                </Text>
                <TextInput value={this.state.name} onChangeText={(text) => this.setState({name : text})} style={{fontSize: 15}} />
              </View>
              <View style={{flex: 1}}>
                <TouchableOpacity onPress={this.onSubmitName}>
                <Icon
                    name="save"
                    style={{fontSize: 25, color: 'grey', paddingTop: 10}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              borderBottomColor: 'grey',
              borderBottomWidth: 0.5,
              justifyContent: 'center',
              height: 75,
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 6}}>
                <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                  Email
                </Text>
                <Text style={{fontSize: 15}} > {this.state.email}</Text>
              </View>
            </View>
          </View>
        </View>
      </>
    );
  }
}

export default ProfileScreen;
