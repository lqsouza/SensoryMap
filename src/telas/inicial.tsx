import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const logo = require('../../assets/logob.png');

export default function inicial() {
  const navigation = useNavigation();
  
  const handleSignup = () => {
    // @ts-ignore
    navigation.navigate('cadastro');
  };

    const handlePrincipal = () => {
      // @ts-ignore
      navigation.navigate('principal');
  };

  return (

    <View style={styles.container}>
      
      <Image source={logo} style={styles.logo} />

      <TouchableOpacity style={styles.button} onPress={handlePrincipal}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>CADASTRE-SE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#749773',
    padding: 16,
  },
  
  logo: {
    width: 190,
    height: 190,
    marginTop: -60,
    marginBottom: 44,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#ECEBE9',
    padding: 6,
    borderRadius: 20,
    alignItems: 'center',
    width: '50%',
  },
  buttonText: {
    color: '#000',
    fontSize: 35,
    fontFamily: 'Georgia',
  },
  signupButton: {
    position: 'absolute',
    bottom: -20,
    backgroundColor: '#ECEBE9',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '94%',
  },
  signupButtonText: {
    color: '#000',
    fontSize: 24,
  },
});
