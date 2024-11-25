// WhiteSquare.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const WhiteSquare = ({ width, height, style, children }) => {
  return (
    <View
      style={[
        styles.square,
        { width: width, height: height },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  square: {
    backgroundColor: '#ECEBE9', // Cor de fundo do quadrado
    borderRadius: 20,        // Bordas arredondadas (opcional)
    shadowColor: '#000',    // Sombra (opcional)
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 50,          // Sombra no Android (opcional)
    paddingLeft: 0,           // Adiciona preenchimento interno
  },
});

export default WhiteSquare;
