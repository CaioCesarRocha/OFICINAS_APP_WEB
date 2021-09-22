import React, { useState, ChangeEvent, useEffect}  from 'react';
import { Feather as Icon} from '@expo/vector-icons' //ja vem prontos, nao precisa de install
import { View, Image, StyleSheet, ImageBackground,Text, TextInput, KeyboardAvoidingView, Platform} from 'react-native';
import {RectButton } from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';


type  RootStackParamList = {
  Home: undefined // definfido que os params são indefinidos
  Mechanicals: {
    selectedCity: string,
    selectedUf: string,
  } 
}

type mechanicalsProps = StackNavigationProp<RootStackParamList, 'Home'>;

type Props = { navigation: mechanicalsProps; };

interface IBGEUFResponse{
  sigla: string;
}
interface IBGECityResponse{
  nome: string;
}


const Home = ({navigation}: Props) => {

  const [ufs, setUfs] = useState<string[]>([]);
  const [citys, setCities] = useState<string[]>([])

  const [selectedUf, setSelectedUf] = useState('Selcione a UF');
  const [selectedCity, setSelectedCity] = useState('Selecione a Cidade');


  useEffect(() => {
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
        const ufInitials = response.data.map(uf => uf.sigla); 
        console.log(ufInitials)      
        setUfs(ufInitials);          
    });
    
}, []);

  useEffect(() => {// necessário carregar as citys sempre que a UF mudar
    if(selectedUf === '0'){
       return;
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
    .then(response => {
       const cityNames = response.data.map(city=> city.nome);
        setCities(cityNames);
    });
  }, [selectedUf]);


  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ImageBackground 
        source={require('../../assets/home-background.png')} 
        style={styles.container}
        imageStyle={{width: 274, height:368}} // style somente para o background
      >
        <View style={styles.main}>
            <Image style={styles.logo} source={require('../../assets/logo.png')}/>
            <View>
              <Text style={styles.title}>Seu marketplace de Oficinas Mecânicas</Text>
              <Text style={styles.description}> Ajudamos pessoas a encontrarem Oficinas próximas da localidade atual!</Text>
            </View>
          <View style={styles.footer}>
            <View>
              <Picker
                style={styles.picker}            
                selectedValue={selectedUf}
                onValueChange={(itemValue) => setSelectedUf(itemValue)}
              >
                <Picker.Item label={'Selecione a UF'} value={'0'}/>
                {
                  ufs.map((item, index) => {
                    return <Picker.Item value={item} label={item} key={index} />
                  })
                }          
              </Picker>

              <Picker
                style={styles.picker}            
                selectedValue={selectedCity}
                onValueChange={(itemValue) => setSelectedCity(itemValue)}
              >
                <Picker.Item label={'Selecione a City'} value={'0'}/>
                {
                  citys.map((item, index) => {
                    return <Picker.Item value={item} label={item} key={index} />
                  })
                }          
              </Picker>
              
            </View>
          </View>
        
          <RectButton style={styles.button} onPress={() => navigation.navigate('Mechanicals', {selectedUf, selectedCity})}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24}></Icon>
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 32,
    },

    logo:{
        width: 160,
        height: 135,
        alignSelf: 'center',
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
      marginTop: 32,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 16,
      fontFamily: 'Roboto_400Regular',
      maxWidth: 260,
      lineHeight: 24,
    },
  
    footer: {
      marginTop: 30,
    },
  
    select: {},

    picker:{
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
      marginTop: 15,
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