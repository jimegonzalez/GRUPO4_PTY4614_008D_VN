import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import MapScreen from './src/screens/MapScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inicio">
        {/* Pantalla de Inicio (Menú) */}
        <Stack.Screen name="Inicio" component={HomeScreen} options={{ headerShown: false }} />

        {/* Otras pantallas que se navegan desde el menú */}
        <Stack.Screen name="GenerarRecorridos" component={MapScreen} />
        <Stack.Screen name="Configuracion" component={MapScreen} />
        <Stack.Screen name="Mapa" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}