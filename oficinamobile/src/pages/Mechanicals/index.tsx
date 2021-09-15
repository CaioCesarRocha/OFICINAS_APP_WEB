import React from "react";
import Constants from 'expo-constants';
import { Feather as Icon} from '@expo/vector-icons' 
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView} from "react-native";
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';
import { SvgUri} from 'react-native-svg';


const Mechanicals = () =>{
    const navigation = useNavigation();

    function handleNavigateBack(){
        navigation.goBack();
    }

    return (
        <>
        <View style={styles.container}>          
            <TouchableOpacity onPress={handleNavigateBack}> 
                <Icon name="arrow-left" color="#34cb79" size={20}></Icon>
            </TouchableOpacity>
            <Text style={styles.title}>Bem Vindo!</Text>
             
            <Text style={styles.description}>Encontre no mapa a Oficina mais próxima!</Text> 
            <View style={styles.mapContainer}>
                <MapView style={styles.map}/>
            </View>                              
        </View>
        <View style={styles.itemsContainer}>
            <ScrollView  
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 20}}
            >
                <TouchableOpacity style={styles.item} onPress={() => {}}>
                    <Image style={{ width: 50, height: 50 }} source={{uri: 'http://192.168.100.2:3333/uploads/componentes.png'}}></Image>
                    <Text style={styles.itemTitle}>Componentes</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
        </>
    );
}

export default Mechanicals;


const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 32,
      paddingTop: 20 + Constants.statusBarHeight,
    },

    backIcon:{

    },
  
    title: {
      fontSize: 20,
      fontFamily: 'Ubuntu_700Bold',
      marginTop: 24,
    },
  
    description: {
      color: '#6C6C80',
      fontSize: 16,
      marginTop: 4,
      fontFamily: 'Roboto_400Regular',
    },
  
    mapContainer: {
      flex: 1,
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
      marginTop: 16,
    },
  
    map: {
      width: '100%',
      height: '100%',
    },
  
    mapMarker: {
      width: 90,
      height: 80, 
    },
  
    mapMarkerContainer: {
      width: 90,
      height: 70,
      backgroundColor: '#34CB79',
      flexDirection: 'column',
      borderRadius: 8,
      overflow: 'hidden',
      alignItems: 'center'
    },
  
    mapMarkerImage: {
      width: 90,
      height: 45,
      resizeMode: 'cover',
    },
  
    mapMarkerTitle: {
      flex: 1,
      fontFamily: 'Roboto_400Regular',
      color: '#FFF',
      fontSize: 13,
      lineHeight: 23,
    },
  
    itemsContainer: {
      flexDirection: 'row',
      marginTop: 16,
      marginBottom: 32,
    },
  
    item: {
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#eee',
      height: 120,
      width: 120,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingTop: 20,
      paddingBottom: 16,
      marginRight: 8,
      alignItems: 'center',
      justifyContent: 'space-between',
  
      textAlign: 'center',
    },
  
    selectedItem: {
      borderColor: '#34CB79',
      borderWidth: 2,
    },
  
    itemTitle: {
      fontFamily: 'Roboto_400Regular',
      textAlign: 'center',
      fontSize: 13,
    },
  });