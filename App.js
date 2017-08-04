import React, { Component, PropTypes } from 'react';
import { StyleSheet, Text, View, NavigatorIOS, TouchableHighlight, Image, AsyncStorage, Button, ScrollView, AlertIOS } from 'react-native';
import Storage from 'react-native-storage';
import moment from 'moment';
var idLocale = require('moment/locale/nl-be'); //for Indonesia locale
moment.locale('nl-be', idLocale);

export default class App extends React.Component {
  render() {
    return (
      <NavigatorIOS
        barTintColor='#000'
        titleTextColor='#fff'
        tintColor='#fff'
        initialRoute={{
          component: Home,
          title: 'Wie rijdt?',
          animated: true,
          passProps: { title: 'Festivolcruiser Home' }
        }}
        style={{flex: 1}}
      />
    );
  }
}

class Home extends React.Component {
  _onOverzicht = () => {
    storage.getAllDataForKey('rit').then(ritten => {
      this.props.navigator.push({
        component: Ritten,
        title: 'Overzicht Ritten',
        passProps: { title: 'Ritten', ritten: ritten },
      });
    });
  }

  _onBouba = () => {
    this.props.navigator.push({
      component: Cruise,
      title: 'Bouba rijdt!',
      passProps: { title: 'Op de baan!', driver: 'Bouba', start: Date.now() },
    });
  }

  _onNele = () => {
    this.props.navigator.push({
      component: Cruise,
      title: 'Nele rijdt!',
      passProps: { title: 'Op de baan!', driver: 'Nele', start: Date.now() },
    });
  }

  render() {
    return (
      <Image source={require('./assets/bg.jpg')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <TouchableHighlight onPress={this._onBouba}>
          <Image source={require('./assets/bouba.jpg')} style={styles.profo} />
        </TouchableHighlight>

        <TouchableHighlight onPress={this._onNele}>
          <Image source={require('./assets/nele.jpg')} style={styles.profo} />
        </TouchableHighlight>

        <TouchableHighlight onPress={this._onOverzicht}>
          <Text style={styles.rittenKnop}>Overzicht ritten</Text>
        </TouchableHighlight>

        <Image source={require('./assets/stubru.gif')} style={styles.stubru} />
        <Text style={styles.text}>xoxo van je favoriete stubru stagiair!</Text>
      </View>
      </Image>
    );
  }
}

class Cruise extends React.Component {
  onPressEindeRit = () => {
    var rit = {
    driver: this.props.driver,
    start: this.props.start,
    end: Date.now(),
    };

    storage.save({
    key: 'rit',  // Note: Do not use underscore("_") in key!
    id: Math.random(),	  // Note: Do not use underscore("_") in id!
    data: rit,
    expires: null
    });

    this.props.navigator.pop();
  }

  render() {
    return (
      <Image source={require('./assets/bg.gif')} style={styles.backgroundImage}>
      <View style={styles.container}>
          <Text style={styles.text}>Start: { moment(this.props.start).format('LLLL') }</Text>
          <Text style={styles.text}>Voorzichtig op de baan hé!</Text>
          <Button
            onPress={this.onPressEindeRit}
            title="Rit beëindigen"
            color="#DA0019"
            accessibilityLabel="Beëindig de rit en sla gegevens op."
          />
      </View>
      </Image>
    );
  }
}

class Ritten extends React.Component {
  onPressDelete = () => {
    AlertIOS.alert(
      'Alle data wissen!',
      'Hey schatjes, jullie staan op het punt alle data voor eeuwig en altijd te wissen, helemaal zeker dat je dit wil doen?',
      [
        {
          text: 'JUP! ALLES WEG!',
          onPress: () => {
            storage.clearMapForKey('rit');
            this.props.navigator.pop();
          },
        },
      ]
    );
  }

  render() {
    return (
      <Image source={require('./assets/bg.jpg')} style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
          {this.props.ritten.map(rit => {
            return (<Text style={styles.cell} key={Math.random(9999)}>{moment(rit.start).format('L') + ' ' + rit.driver + ' ' + moment(rit.start).format('LT') + ' - ' + moment(rit.end).format('LT')}</Text>);
          })}
          <Button
            onPress={this.onPressDelete}
            title="Alle data verwijderen"
            color="#DA0019"
            accessibilityLabel="Alle gegevens op je toestel verwijderen."
          />
      </ScrollView>
      </Image>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .5)',
  },
  backgroundImage: {
    flex: 1,
    alignSelf: 'stretch',
    width: null,
  },
  profo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    margin: 10,
  },
  stubru: {
    width: 100,
    height: 50,
  },
  text: {
    color: '#fff',
    fontSize: 18
  },
  rittenKnop: {
    color: '#fff',
    margin: 20,
    padding: 10,
    borderWidth: 2,
    borderColor: '#fff',
    fontWeight: "700",
  },
  cell: {
    padding: 10,
    borderBottomWidth: 2,
    borderColor: '#000',
    color: '#fff'
  },
  contentContainer: {
    backgroundColor: 'rgba(0, 0, 0, .7)',
  }
});

let storage = new Storage({
    size: 1000,
    storageBackend: AsyncStorage,
    defaultExpires: null,
    enableCache: true,
    sync : {
        // we'll talk about the details later.
    }
})
