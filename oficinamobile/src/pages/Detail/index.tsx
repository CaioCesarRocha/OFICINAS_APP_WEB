import React, { useState, useEffect} from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text, SafeAreaView, Linking} from "react-native";
import { Feather as Icon, FontAwesome} from '@expo/vector-icons' 
import { useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RectButton } from 'react-native-gesture-handler';
import api  from '../../services/api';
import * as MailComposer from 'expo-mail-composer';


type  RootStackParamList = {
    Detail: undefined; 
  }
type pageProps = StackNavigationProp<RootStackParamList, 'Detail'>;
  
type Props = { navigation: pageProps; };

interface Params{
  mechanical_id: number
}
interface Data{
  mechanical:{
    image: string,
    image_url: string,
    name: string,
    email: string,
    whatsapp: string,
    city: string,
    uf: string,
  },
  items: {
    title: string,
  }[];
}

const Detail = ({navigation}: Props)=>{
  const [data, setData] = useState<Data>({} as Data);

  const route = useRoute();
  console.log(route.params)
  const routeParams = route.params as Params;

  useEffect(() => {
    api.get(`mechanicals/${routeParams.mechanical_id}`).then(response =>{
      console.log(response.data)
      setData(response.data)
    })
  }, []);
    
  function handleNavigateBack(){
        navigation.goBack();
  }
  function handleWhatsapp(){
    Linking.openURL(`whatsapp://send?phone=${data.mechanical.whatsapp}&text=Preciso dos serviços da oficina`);
  }
  function handleComposeMail(){
    MailComposer.composeAsync({
      subject: 'Interesse nos serviços da Oficina', //deixa assunto setado
      recipients: [data.mechanical.email]
    });
  }

  if(!data.mechanical){ //exibe nada antes de carregar o data. Ideal era tela de loading.
    return null
  }

  return (
    <SafeAreaView style={styles.safearea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}> 
          <Icon name="arrow-left" color="#34cb79" size={20}></Icon>
        </TouchableOpacity>
        <Image style={styles.mechanicalImage} source={{uri: data.mechanical.image_url}}></Image>
        <Text style={styles.mechanicalName}>{data.mechanical.name}</Text>
        <Text style={styles.mechanicalItems}>
          {data.items.map(item => item.title).join(', ')}
        </Text>
        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>{data.mechanical.city}- {data.mechanical.uf}</Text>
        </View>
      </View>
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" size={20} color="#FFF"/>
          <Text style={styles.buttonText}>WhatsApp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#FFF"/>
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>          
      </View>
    </SafeAreaView>
  );
}

export default Detail;


const styles = StyleSheet.create({
    safearea:{
        flex: 1
    },
    container: {
      flex: 1,
      padding: 32,
      paddingTop: 20,
      marginTop: 30
    },
  
    mechanicalImage: {
      width: '100%',
      height: 120,
      resizeMode: 'cover',
      borderRadius: 10,
      marginTop: 32,
    },
  
    mechanicalName: {
      color: '#322153',
      fontSize: 28,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    mechanicalItems: {
      fontFamily: 'Roboto_400Regular',
      fontSize: 16,
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    address: {
      marginTop: 32,
    },
    
    addressTitle: {
      color: '#322153',
      fontFamily: 'Roboto_500Medium',
      fontSize: 16,
    },
  
    addressContent: {
      fontFamily: 'Roboto_400Regular',
      lineHeight: 24,
      marginTop: 8,
      color: '#6C6C80'
    },
  
    footer: {
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: '#999',
      paddingVertical: 20,
      paddingHorizontal: 32,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    
    button: {
      width: '48%',
      backgroundColor: '#34CB79',
      borderRadius: 10,
      height: 50,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
  
    buttonText: {
      marginLeft: 8,
      color: '#FFF',
      fontSize: 16,
      fontFamily: 'Roboto_500Medium',
    },
  });