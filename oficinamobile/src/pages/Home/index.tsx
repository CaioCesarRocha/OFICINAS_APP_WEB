import React from 'react';
import { Feather as Icon} from '@expo/vector-icons' //ja vem prontos, nao precisa de install
import { View, Image, StyleSheet, ImageBackground,Text} from 'react-native';
import {RectButton } from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';


type  RootStackParamList = {
  Home: undefined // definfido que os params são indefinidos
  Mechanicals: undefined; 
}

type mechanicalsProps = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = { navigation: mechanicalsProps; };


const Home = ({navigation}: Props) => {
  
  return (
    <ImageBackground 
      source={require('../../assets/home-background.png')} 
      style={styles.container}
      imageStyle={{width: 274, height:368}} // style somente para o background
    >
      <View style={styles.main}>
          <Image style={styles.logo} source={require('../../assets/logo.png')}/>
          <Text style={styles.title}>Seu marketplace de Oficinas Mecânicas</Text>
          <Text style={styles.description}> Ajudamos pessoas a encontrarem Oficinas próximas da localidade atual!</Text>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={() => navigation.navigate('Mechanicals')}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24}></Icon>
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },

    logo:{
        width: 250,
        height: 90,
    },
  
    main: {
      flex: 1,
      justifyContent: 'center',
    },
  
    title: {
      color: '#322153',
      fontSize: 32,
      fontFamily: 'Ubuntu_700Bold',
      maxWidth: 260,
      marginTop: 64,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {},
  
    select: {},
  
    input: {
      height: 60,
      backgroundColor: '#FFF',
      borderRadius: 10,
      marginBottom: 8,
      paddingHorizontal: 24,
      fontSize: 16,
    },
  
    button: {
      backgroundColor: '#34CB79',
      height: 60,
      flexDirection: 'row',
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center',
      marginTop: 8,
    },
  
    buttonIcon: {
      height: 60,
      width: 60,
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      flex: 1,
      justifyContent: 'center',
      textAlign: 'center',
      color: '#FFF',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    }
  });

export default Home;