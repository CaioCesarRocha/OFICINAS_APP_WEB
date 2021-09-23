import React, {useEffect, useState} from 'react';
import { View,  StyleSheet} from "react-native";
import {Picker} from '@react-native-picker/picker';



interface Props{
    listaItens: string[];
    valueSelected: string;
    field: string;
    action: (itemValue: string) => void;
  }

const PickerComponent: React.FC<Props> = ({listaItens, valueSelected, field, action}) => {

    return(
        <View>           
            <Picker   
                style={styles.picker}   
                selectedValue={valueSelected}
                onValueChange={(itemValue) =>{action(itemValue)} }
            >
                <Picker.Item value='' label={`Selecione a ${field}`} />
                {
                    listaItens.map((item, index) => {
                        return <Picker.Item value={item} label={item} key={index} />
                    })
                }
            </Picker>
        </View>
    );
}

const styles = StyleSheet.create({
    picker:{
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    }
})

export default PickerComponent;


