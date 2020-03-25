import React, {Component} from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
import {Thumbnail} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ava from '../../../image/logoava.png';
import {TouchableOpacity} from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-picker';
import {auth, db} from '../../config/config';
import firebase from 'firebase'


class ProfileScreen extends Component {
  state = {
    imageSource: require('../../../image/logoava.png'),
    upload: false,
  };
  onLogout = async () => {
    const id = auth.currentUser.uid;
    await db
      .ref('/user/' + id)
      .child('status')
      .set('offline');
    auth.signOut().then(res => console.warn('oke'));
  };

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
            <TouchableOpacity>
              <Text style={{fontSize: 17, fontWeight: 'bold'}}>
                Display Name
              </Text>
              <Text style={{fontSize: 15}}>nanti name</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomColor: 'grey',
              borderBottomWidth: 0.5,
              justifyContent: 'center',
              height: 75,
            }}>
            <TouchableOpacity>
              <Text style={{fontSize: 17, fontWeight: 'bold'}}>Email</Text>
              <Text style={{fontSize: 15}}>nanti email</Text>
            </TouchableOpacity>
          </View>
          {/* {photo && (
            <Image
              source={{uri: photo.uri}}
              style={{width: 100, height: 100}}
            />
          )} */}
        </View>
      </>
    );
  }
}

export default ProfileScreen;
