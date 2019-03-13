/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { ScrollView, Button, Platform, StyleSheet, Text, View, TextInput } from 'react-native';
import firebase from 'firebase';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

  state = {
    name: '',
    text: '',
    dataList: [],
  };


  componentWillMount() {
    console.log('componentWillMount');
    const config = {
      apiKey: '*',
      authDomain: '*',
      databaseURL: '*',
      projectId: '*',
      storageBucket: '*',
      messagingSenderId: '*'
    };
    firebase.initializeApp(config);

    firebase.database().ref('/users/001').set({
      name: 'Rodrigo'
    }).then(() => {
      console.log('inserido');
    }).catch(t => {
      console.log(t);
    });
  }

  componentDidMount = async () => {

    firebase.database().ref('chat').limitToLast(10).on('value', (s) => {
      console.log('componentDidMount 2');
      console.log(s);

      const data = s.toJSON();

      if (data) {
        const dataList = Object.keys(data).map(s => ({
          name: data[s].name,
          text: data[s].text
        }));
        this.setState({ dataList });
      }



    });

  };


  render() {
    const { dataList } = this.state;
    console.log(dataList);

    return (
      <View style={ styles.container }>
        <Text style={{margin: 10,}}>Nome:</Text>
        <TextInput style={{margin: 10, height: 40, borderColor: 'gray', borderWidth: 1}} onChangeText={ (text) => this.setState({ name: text }) } value={ this.state.name }/>
        <ScrollView style={{flex: 2}}>
        { dataList && dataList.map(d => {
          return (
            <View style={{padding: 2}}>
              <Text>nome: { d.name }</Text>
              <Text>{ d.text }</Text>
            </View>
          );
        }) }
        </ScrollView>
        <TextInput style={{margin: 10, height: 40, borderColor: 'gray', borderWidth: 1}} onChangeText={ (text) => this.setState({ text }) } value={ this.state.text }/>
        <Button onPress={ () => {
          firebase.database().ref(`chat/${ dataList.length + 1 }`).set({
            name: this.state.name,
            text: this.state.text
          }).then(() => {
            this.setState({ text: '' });
          }).catch(t => {
            console.log(t);
          });
        } } title={ 'Enviar' }/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    marginTop: 50,
  },

});
