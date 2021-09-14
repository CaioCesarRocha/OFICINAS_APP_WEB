
import React from 'react';
import AppLoading from 'expo-app-loading';
import { StyleSheet, Text, View, StatusBar} from 'react-native';
import { Roboto_400Regular, Roboto_500Medium} from '@expo-google-fonts/roboto'; //fonts carregadas de um jeito facil
import { Ubuntu_700Bold, useFonts} from '@expo-google-fonts/ubuntu';


import Home from './src/pages/Home'

export default function App() {
  const [fontsLoaded] = useFonts({ //const criada para verifica se as fonts ja estao carregadas
    Roboto_400Regular, 
    Roboto_500Medium,
    Ubuntu_700Bold,
  });

  if(!fontsLoaded){
    <AppLoading/>// exibir uma tela antes do APP carregar...
  }

  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent/>
    <Home/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
