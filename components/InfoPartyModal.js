import { View, Text, Image, Button } from 'react-native';
import React from 'react';
import AppStyles from '../styles/AppStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from "../firebase";
import {doc,setDoc} from 'firebase/firestore';
import BouncyCheckbox from 'react-native-bouncy-checkbox'

export default function InfoPartyModal(props) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState();
    const [items, setItems] = React.useState([]);
    let [cartonRouge, setcartonRouge] = React.useState(false);
    let [cartonJaune, setcartonJaune] = React.useState(false);
    const [newInfo, setnewInfo] = React.useState(props.partyValue.user_info);

    let getDrifters = async () =>{
        let userList = [];
        props.partyValue.user_info.forEach(element => userList.push({"label":element.pseudo,"value":element.userId}));
        setItems(userList);
    }
    let checkRed = (isChecked) => {
        if(isChecked){
            isChecked=true;
            setcartonRouge(true);
        }else{isChecked=false;setcartonRouge(false)}
    };
    let checkYellow = (isChecked) => {
        if(isChecked){
            isChecked=true;
            setcartonJaune(true);
        }else{isChecked=false;setcartonJaune(false)}
    };

    let addRed = (element)=>{
        if(element.userId==value){
            element.redCard += 1; 
        }
    };
    let addYellow = (element)=>{
        if(element.userId==value){
            element.yellowCard += 1; 
            if (element.yellowCard >= 3){
                element.redCard += 1; 
                element.yellowCard = 0;
            };
        };
    };

    return (
      <View style={AppStyles.container}>
        <Image
            style={[AppStyles.headerIcon,AppStyles.topNegMargin]}
            source={require('../assets/drift.png')}
        />
        <Text style={AppStyles.header}>Qui a dérapé ?</Text>
        <DropDownPicker
            placeholder="Select the drifter"
            searchable={true}
            bottomOffset={150}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            onPress={getDrifters} 
        />
        <BouncyCheckbox 
            style={AppStyles.rowContainer}
            isChecked={false}
            size={25}
            fillColor="red"
            unfillColor="#FFFFFF"
            text="Carton Rouge"
            iconStyle={{ borderColor: "red" }}
            onPress={(isChecked) => {checkRed(isChecked)}}
        />
        <BouncyCheckbox
            style={AppStyles.rowContainer}
            size={25}
            fillColor="yellow"
            unfillColor="#FFFFFF"
            text="Carton Jaune"
            iconStyle={{ borderColor: "yellow" }}
            onPress={(isChecked) => { checkYellow(isChecked)}}
        />
        <View style={[AppStyles.rowContainer, AppStyles.rightAligned, AppStyles.rightMargin]}>
            <Button title="Cancel" onPress={props.onClose} />
            <Button title="OK" onPress={async() => {
            if(cartonRouge){newInfo.forEach(element => addRed(element))};
            if(cartonJaune){newInfo.forEach(element => addYellow(element))};
            const CardRef = doc(db, 'partys', props.partyValue.id);
            setDoc(CardRef, { user_info: newInfo}, { merge: true });
            props.onClose();
            }} />
        </View>
      </View>
    );
  }