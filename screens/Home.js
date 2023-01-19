import { View, Button, Text, Modal, SafeAreaView, ActivityIndicator, FlatList, Image, ScrollView} from 'react-native';
import InlineTextButton from '../components/InlineTextButton';
import AppStyles from '../styles/AppStyles';
import { auth, db } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore"; 
import { sendEmailVerification } from 'firebase/auth';
import React from 'react';
import AddPartyModal from '../components/AddPartyModal';
import InfoPartyModal from '../components/InfoPartyModal';



export default function Home({ navigation }) {
  let [modalVisible, setModalVisible] = React.useState(false);
  let [infoModalVisible, setInfoModalVisible] = React.useState(false);
  let [isLoading, setIsLoading] = React.useState(true);
  let [isRefreshing, setIsRefreshing] = React.useState(false);
  let [partys, setpartys] = React.useState([]);
  var [partyValue, setpartyValue] = React.useState([]);

  let loadpartyList = async () => {
    const q = query(collection(db, "partys"), where("users_id", "array-contains", auth.currentUser.uid));

    const querySnapshot = await getDocs(q);
    let partys = [];
    querySnapshot.forEach((doc) => {
      let party = doc.data();
      party.id = doc.id;
      partys.push(party);
    });

    setpartys(partys);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  if (isLoading) {
    loadpartyList();
  }

  let deleteparty = async (partyId) => {
    await deleteDoc(doc(db, "partys", partyId));
    let updatedpartys = [...partys].filter((item) => item.id != partyId);
    setpartys(updatedpartys);
  };

  let renderpartyItem = ({item}) => {
    return (
      <View style={[AppStyles.rowContainer, AppStyles.rightMargin, AppStyles.leftMargin]}>
        <View style={[AppStyles.fillSpace,AppStyles.partyList]}>
          <Button
            title={item.id}
            color="grey"
            onPress={() => {console.log(item)}} 
          />
          <Button 
          title="Je siffle !!!" 
          onPress={() => {setInfoModalVisible(true),setpartyValue(item)}} 
          color="#fb4d3d" />
          <FlatList
            data={item.user_info}
            renderItem={renderplayer}
          />
        </View>
        <InlineTextButton text="Leave" color="#258ea6" onPress={() => deleteparty(item.id)} />
      </View>
    );
  }

  let renderplayer = ({item}) => {
    return (
      <View style={[AppStyles.rowContainer, AppStyles.rightMargin, AppStyles.leftMargin]}>
        <View style={[AppStyles.fillSpace,AppStyles.partyList]}>
        
          <Text style={AppStyles.titre}>{item.pseudo}</Text>
          <Text>Carton ROUGE : {item.redCard}</Text>
          <Text>Carton JAUNE : {item.yellowCard}</Text>
          
        </View>
       
      </View>
    );
  }

  let showpartyList = () => {
    return (
        <FlatList
          ItemSeparatorComponent={
            Platform.OS !== 'android' &&
            (({highlighted}) => (
              <View
                style={[style.separator, highlighted && {marginLeft: 0}]}
              />
            ))
          }
          data={partys}
          refreshing={isRefreshing}
          onRefresh={() => {
            loadpartyList();
            setIsRefreshing(true);
          }}
          renderItem={renderpartyItem}
          keyExtractor={item => item.id} 
        />
      
    )
  };

  let showContent = () => {
    return (
      <View>
        <ScrollView>
          <Button 
            title="Add party" 
            onPress={() => setModalVisible(true)} 
            color="#fb4d3d" />
          {isLoading ? <ActivityIndicator size="large" /> : showpartyList() }
        </ScrollView>
      </View>
    );
  };

  let showSendVerificationEmail = () => {
    return (
      <View style={AppStyles.header}>
        <Text style={AppStyles.topMargin}>Please verify your email to use party</Text>
        <Button style={AppStyles.topMargin} title="Send Verification Email" onPress={() => sendEmailVerification(auth.currentUser)} />
      </View>
    );
  };

  let addparty = async (party,players) => {
    var liste_info=[];
    var users_Id=[];
    for (const element of players) {
      const userSnapshot = await getDocs(query(collection(db, "users"), where("value", "==", element)));
      const userList = userSnapshot.docs.map(doc => doc.data());
      let user_info = {
        pseudo:userList[0].label,
        userId: userList[0].value,
        redCard:0,
        yellowCard:0
      };
      users_Id.push(userList[0].value);
      liste_info.push(user_info);
    }
    let partyToSave = {
      userId: auth.currentUser.uid,
      user_info:liste_info,
      users_id:users_Id,
    };
    const docRef = await setDoc(doc(db, "partys", party), partyToSave);

    partyToSave.id = docRef.id;

    let updatedpartys = [...partys];
    updatedpartys.push(partyToSave);

    setpartys(updatedpartys);
  };
  
  return (
    <SafeAreaView>
      <View style={[AppStyles.rowContainer, AppStyles.rightAligned, AppStyles.rightMargin, AppStyles.topMargin]}>
        <InlineTextButton text="Manage Account" color="#258ea6" onPress={() => navigation.navigate("ManageAccount")}/>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <AddPartyModal 
          onClose={() => setModalVisible(false)}
          addparty={addparty} />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}>
        <InfoPartyModal 
          onClose={() => setInfoModalVisible(false)}
          partyValue={partyValue}
          />
      </Modal>
      <ScrollView
        showsVerticalScrollIndicator={false}
        >
        <Image
          style={AppStyles.headerIcon}
          source={require('../assets/icon.png')}
        />
        <Text style={AppStyles.header}>Slip Count</Text>
        {auth.currentUser.emailVerified ? showContent() : showSendVerificationEmail()}
      </ScrollView>
    </SafeAreaView>
  )
}