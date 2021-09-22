import React, {useState, useEffect} from "react";
import Constants from 'expo-constants';
import { Feather as Icon} from '@expo/vector-icons' 
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert} from "react-native";
import { useRoute} from '@react-navigation/native';
import MapView, {Marker} from 'react-native-maps';
import * as Location from 'expo-location'; // importa todas as funções da library
import {StackNavigationProp} from '@react-navigation/stack';
import api  from '../../services/api';

type  RootStackParamList = {
  Mechanicals: undefined;
  Detail: {
    mechanical_id: number,
  }; 
}

type detailProps = StackNavigationProp<RootStackParamList, 'Mechanicals'>;

type Props = { navigation: detailProps; };

interface Item{
  id: number,
  title: string,
  image_url: string,
}

interface Mechanical{
  id: number,
  name: string,
  image: string,
  image_url: string,
  latitude: number,
  longitude: number,
}

interface Params{
  selectedUf: string,
  selectedCity: string,
}

const Mechanicals = ({navigation}: Props) =>{
    const [items ,setItems] = useState<Item[]>([]);
    const [mechanicals ,setMechanicals] = useState<Mechanical[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);

    const[initialPosition, setInitialPosition] = useState<[number, number]>([0,0]);

    const route = useRoute();
    const routeParams = route.params as Params;

    useEffect(() => {
      async function loadPosition(){
        const {status} = await Location.requestForegroundPermissionsAsync();

        if(status !== 'granted'){
          Alert.alert('Ooops...', 'Precisamos da sua permissão para obter a localização')
          return;
        }
        const location = await Location.getCurrentPositionAsync();

        const { latitude, longitude} = location.coords;

        setInitialPosition([
          latitude,
          longitude
        ]);
      } 
      loadPosition()   
    }, []);

    useEffect(() => {
      api.get('items').then(response =>{
            setItems(response.data)
      });
    }, []);

    useEffect(() => {
      api.get('mechanicals',{
        params:{
          city: routeParams.selectedCity,
          uf: routeParams.selectedUf,
          items: selectedItems
        }
      }).then(response =>{
        setMechanicals(response.data);
        console.log(response.data)
      })
    }, [selectedItems]); //vai chamar toda vez que o selected items mudar

    function handleNavigateBack(){
      navigation.goBack();
    }

    function handleNavigateToDetail(id: number){
      navigation.navigate('Detail', {mechanical_id: id});
    }

    function handleSelectItem(id: number){
      const alreadySelected = selectedItems.findIndex(item => item === id);//pra atualizar a lista selecionada sem somar o msm id
      if(alreadySelected >= 0){
          const filteredItems = selectedItems.filter(item => item !== id);
          setSelectedItems(filteredItems);
      }else{
          setSelectedItems([...selectedItems , id])
      }      
    };

    return (
        <>
        <View style={styles.container}>          
            <TouchableOpacity onPress={handleNavigateBack}> 
                <Icon name="arrow-left" color="#34cb79" size={20}></Icon>
            </TouchableOpacity>
            <Text style={styles.title}>Bem Vindo!</Text>
             
            <Text style={styles.description}>Encontre no mapa a Oficina mais próxima!</Text> 
            <View style={styles.mapContainer}>
                { initialPosition[0] !== 0 && (
                  <MapView 
                    style={styles.map}
                    loadingEnabled={initialPosition[0]===0} 
                    initialRegion={{
                      latitude: initialPosition[0], 
                      longitude: initialPosition[1],
                      latitudeDelta: 0.014,
                      longitudeDelta: 0.014
                    }}
                  >
                    {mechanicals.map(mechanical =>(
                      <Marker
                        key={String(mechanical.id)} 
                        style={styles.mapMarker}
                        onPress={() => handleNavigateToDetail(mechanical.id)}
                        coordinate={{
                          latitude:mechanical.latitude, 
                          longitude:mechanical.longitude
                        }}
                      >
                       <View style={styles.mapMarkerContainer}>
                          <Image 
                            style={styles.mapMarkerImage} 
                            source={{uri: mechanical.image_url}}
                          >             
                         </Image>
                         <Text style={styles.mapMarkerTitle}>{mechanical.name}</Text>
                       </View>
                     </Marker>
                    ))}
                  </MapView>
                )}
            </View>                              
        </View>
        <View style={styles.itemsContainer}>
            <ScrollView  
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingHorizontal: 20}}
            >
              {items.map(item=>(
                <TouchableOpacity 
                  style={[
                    styles.item,
                    selectedItems.includes(item.id) ? styles.selectedItem : {}                  
                  ]}
                  key = {String(item.id)} 
                  onPress={() => handleSelectItem(item.id)}
                  activeOpacity={0.6}//opacidade de quando clicar
                >
                  <Image style={{ width: 50, height: 50 }} source={{uri: item.image_url}}></Image>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                </TouchableOpacity>
              ))}
                
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
      fontSize: 9,
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