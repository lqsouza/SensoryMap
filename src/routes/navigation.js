import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import inicial from '../telas/inicial';
import cadastro from '../telas/cadastro';
import principal from '../telas/principal';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="inicial">
        <Stack.Screen name="inicial" component={inicial} />
        <Stack.Screen name="cadastro" component={cadastro} />
        <Stack.Screen name="principal" component={principal} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}