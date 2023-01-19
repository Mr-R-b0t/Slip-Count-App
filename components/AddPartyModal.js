import { View, Text, TextInput, Button } from 'react-native';
import React from 'react';
import AppStyles from '../styles/AppStyles';
import DropDownPicker from 'react-native-dropdown-picker';
import { db } from "../firebase";
import {collection, getDocs } from 'firebase/firestore';

export default function AddPartyModal(props) {
  let [party, setparty] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState([]);
  const [items, setItems] = React.useState([]);

  const GetUserData = async () =>{
    const userCol = collection(db, 'users');
    const userSnapshot = await getDocs(userCol);
    const userList = userSnapshot.docs.map(doc => doc.data());
    setItems(userList);
  }
  

  return (
    <View style={AppStyles.container}>
      <Text style={AppStyles.header}>Add party</Text>
      <TextInput 
          style={[AppStyles.textInput, AppStyles.darkTextInput]} 
          placeholder='Party Name'
          value={party}
          onChangeText={setparty} />
      <DropDownPicker
        placeholder="Select your Teammate"
        multiple={true}
        min={2}
        max={15}
        searchable={true}
        bottomOffset={150}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        onPress={GetUserData} 
      />
      <View style={[AppStyles.rowContainer, AppStyles.rightAligned, AppStyles.rightMargin]}>
        <Button title="Cancel" onPress={props.onClose} />
        <Button title="OK" onPress={() => {
          const players = value;
          props.addparty(party,players);
          setparty("");
          props.onClose();
        }} />
      </View>
    </View>
  );
}