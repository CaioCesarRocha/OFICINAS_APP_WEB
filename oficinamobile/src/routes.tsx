import React from "react";
import {NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Home from './pages/Home';
import Mechanicals from './pages/Mechanicals';
import Detail from './pages/Detail';


export type  RootStackParamList = {
    Home: undefined;
    Detail: undefined;
    Mechanicals: undefined;
  }
  
const AppStack = createStackNavigator<RootStackParamList>(); // funciona como roteamento para a applicacao


const Routes = () =>{
    return(
        <NavigationContainer>
            <AppStack.Navigator               
                screenOptions={{
                    headerShown: false,
                    cardStyle:{
                        backgroundColor: '#f0f0f5',
                    }
                }}
            >
                <AppStack.Screen name="Home" component={Home}/>
                <AppStack.Screen name="Mechanicals" component={Mechanicals}/>
                <AppStack.Screen name="Detail" component={Detail}/>              
            </AppStack.Navigator>
        </NavigationContainer>
    );
}


export default Routes;



