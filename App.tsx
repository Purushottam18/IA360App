import React from 'react'
import { Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/loginScreen/login';
import UploadScreen from './src/uploadScreen/uploadScreen';
import Upload from './src/uploadScreen/upload';

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="UploadScreen" component={UploadScreen} />
        <Stack.Screen name='Upload' component={Upload} />
        </Stack.Navigator>
      </NavigationContainer>
  )
}
