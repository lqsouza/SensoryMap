import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import WhiteSquare from './WhiteSquare';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import firebaseConfig from '../firebaseConfig';

const logo = require('../../assets/logob.png');


// Inicialize o Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

export default function Cadastro() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    nome: '',
    senha: ''
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[com]+$/;
    return emailRegex.test(email);
  };

  const handleSignup = async () => {
    let hasErrors = false;
    const newErrors = {
      email: '',
      nome: '',
      senha: ''
    };

    if (!nome.trim()) {
      newErrors.nome = 'Preencha o campo nome';
      hasErrors = true;
    }

    if (!email.trim()) {
      newErrors.email = 'Preencha o campo email';
      hasErrors = true;
    } else if (!validateEmail(email)) {
      newErrors.email = 'Email inválido. Use formato: exemplo@email.com';
      hasErrors = true;
    }

    if (!senha) {
      newErrors.senha = 'Preencha o campo senha';
      hasErrors = true;
    } else if (senha.length < 8) {
      newErrors.senha = 'A senha deve ter 8 caracteres';
      hasErrors = true;
    }

    setErrors(newErrors);

    if (!hasErrors) {
      try {
        // Cria o usuário no Firebase Authentication
        const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, senha);

        // Salva os dados do usuário no Firestore
        await db.collection('users').doc(userCredential.user?.uid).set({
          nome,
          email
        });

        // Faz o login automático do usuário
        await firebase.auth().signInWithEmailAndPassword(email, senha);

        // Navega para a tela inicial
        // @ts-ignore
        navigation.navigate('inicial');
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível criar a conta. Tente novamente.');
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.squareWrapper}>
        <Image source={logo} style={styles.logo} />
        <WhiteSquare width={340} height={500} style={styles.squareContainer}>
          <Text style={styles.title}>CADASTRE-SE</Text>
          
          <TextInput 
            placeholder="Nome" 
            style={[styles.input, errors.nome ? styles.inputError : null]}
            value={nome}
            onChangeText={(text) => {
              setNome(text);
              setErrors(prev => ({...prev, nome: ''}));
            }}
            placeholderTextColor="#666"
          />
          {errors.nome ? <Text style={styles.errorText}>{errors.nome}</Text> : null}

          <TextInput 
            placeholder="E-mail" 
            style={[styles.input, errors.email ? styles.inputError : null]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors(prev => ({...prev, email: ''}));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#666"
          />
          {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

          <TextInput 
            placeholder="Senha" 
            style={[styles.input, errors.senha ? styles.inputError : null]}
            value={senha}
            onChangeText={(text) => {
              setSenha(text);
              setErrors(prev => ({...prev, senha: ''}));
            }}
            secureTextEntry={true}
            maxLength={8}
            placeholderTextColor="#666"
          />
          {errors.senha ? <Text style={styles.errorText}>{errors.senha}</Text> : null}

          <TouchableOpacity 
            style={styles.button}
            onPress={handleSignup}
          >
            <Text style={styles.buttonText}>Criar Conta</Text>
          </TouchableOpacity>
        </WhiteSquare>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#749773',
  },
  squareWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: -60,
  },
  squareContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 16,
    fontWeight: 'bold',
    fontFamily: 'Georgia',
  },
  input: {
    height: 35,
    borderColor: '#749773',
    borderWidth: 1,
    marginBottom: 4,
    paddingHorizontal: 10,
    width: 280,
    borderRadius: 5,
    backgroundColor: '#95B094',
    color: '#000',
    fontSize: 15,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 8,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  logo: {
    width: 190,
    height: 190,
    marginBottom: 64,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#95B094',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '40%',
    marginTop: 20,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
