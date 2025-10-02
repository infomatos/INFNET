import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';


import { COLORS } from './theme';

import { AuthProvider } from './hooks/useAuth';
import HomeScreen from './screens/HomeScreen';
import AdminScreen from './screens/AdminScreen';
import EventosScreen from './screens/EventosScreen';
import OfertasScreen from './screens/OfertasScreen';
import CursosScreen from './screens/CursosScreen';
import DashboardScreen from './screens/DashboardScreen';

const Stack = createNativeStackNavigator();


export default function App() {

  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {' '}
      <AuthProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: '#050505' },
              headerTintColor: '#fff',
              contentStyle: { backgroundColor: COLORS.fundo },
            }}>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'GUIA Church' }}
            />
            <Stack.Screen
              name="Admin"
              component={AdminScreen}
              options={{ title: 'Admin' }}
            />
            <Stack.Screen
              name="Cursos"
              component={CursosScreen}
              options={{ title: 'Cursos' }}
            />
            <Stack.Screen
              name="Ofertas"
              component={OfertasScreen}
              options={{ title: 'Ofertas' }}
            />
            <Stack.Screen
              name="Eventos"
              component={EventosScreen}
              options={{ title: 'Eventos' }}
            />
            <Stack.Screen
              name="Dashboard"
              component={DashboardScreen}
              options={{ title: 'Painel Dashboard' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
