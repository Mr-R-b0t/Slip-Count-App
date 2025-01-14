import { View, Button, Text, Modal, SafeAreaView, ActivityIndicator, FlatList, Image, TouchableOpacity} from 'react-native';
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
  let [partyValue, setpartyValue] = React.useState([]);

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

  let displayRedCard = (count) => {
    if(count>0){
    switch (count){
      case 1:
        return(<Image source={require('../assets/rouge.png')}/>);
      case 2:
        return(<View style={[AppStyles.leftAligned]}>
          <Image source={require('../assets/rouge.png')}/>
          <Image source={require('../assets/rouge.png')}/>
          </View>);
      case 3:
        return(<View style={[AppStyles.leftAligned]}>
          <Image source={require('../assets/rouge.png')}/>
          <Image source={require('../assets/rouge.png')}/>
          <Image source={require('../assets/rouge.png')}/>
          </View>);
      case 4:
        return(<View style={[AppStyles.leftAligned]}>
          <Image source={require('../assets/rouge.png')}/>
          <Image source={require('../assets/rouge.png')}/>
          <Image source={require('../assets/rouge.png')}/>
          <Image source={require('../assets/rouge.png')}/>
          </View>);
      case 5:
        return(<View style={[AppStyles.leftAligned]}>
          <Image source={require('../assets/rouge.png')}/>
          <Image source={require('../assets/rouge.png')}/>
          <Image source={require('../assets/rouge.png')}/>
          <Image source={require('../assets/rouge.png')}/>
          <Image source={require('../assets/rouge.png')}/>
          </View>);
      default:
        return(<View style={[AppStyles.rowContainer]}>
          <Text style={AppStyles.header}>Joueur exclu de la fédération de DRIFT !!!</Text>
        </View>);
    };}
  };
  let displayYellowCard = (count) => {
    switch (count){
      case 1:
        return(<View style={AppStyles.leftAligned}>
          <Image source={require('../assets/jaune.png')}/>
          </View>);
      case 2:
        return(<View style={AppStyles.leftAligned}>
          <Image style={AppStyles.leftSmallMargin} source={require('../assets/jaune.png')}/>
          <Image style={AppStyles.leftSmallMargin} source={require('../assets/jaune.png')}/>
          </View>);
      case 3:
        return(<View style={AppStyles.leftAligned}>
          <Image style={AppStyles.leftSmallMargin} source={require('../assets/jaune.png')}/>
          <Image style={AppStyles.leftSmallMargin} source={require('../assets/jaune.png')}/>
          <Image style={AppStyles.leftSmallMargin} source={require('../assets/jaune.png')}/>
          </View>);
    }
  };

  let renderpartyItem = ({item}) => {
    return (
      <View>
      <View style={[AppStyles.rowContainer, AppStyles.rightMargin, AppStyles.leftMargin]}>
        <View style={[AppStyles.fillSpace,AppStyles.partyList]}>
          <Button
            title={item.id}
            color="grey"
            onPress={() => {console.log(item)}} 
          />
          <TouchableOpacity
            onPress={() => {setInfoModalVisible(true),setpartyValue(item)}}
            style={AppStyles.button}>
            <View style={[AppStyles.leftAligned,AppStyles.topSmalNegMargin]}>
              <Image
                style={AppStyles.headerIcon}
                source={require('../assets/sifflet.png')}
              />
              <Text style={AppStyles.titreButton}>Je siffle !!!</Text>
            </View>
          </TouchableOpacity>
          <FlatList
            data={item.user_info}
            renderItem={renderplayer}
          />
          <InlineTextButton style={AppStyles.header} text="Leave" color="black" onPress={() => deleteparty(item.id)} />
        </View>
      </View>
      </View>
    );
  }

  let renderplayer = ({item}) => {
    return (
      
      
        <View style={[AppStyles.rowContainer, AppStyles.rightMargin, AppStyles.leftMargin]}>
          <View style={[AppStyles.fillSpace,AppStyles.partyList]}>
            <Text style={AppStyles.titre}>{item.pseudo}</Text>
            <View style={[AppStyles.rowContainer, AppStyles.leftSmallMargin]}>
              {displayRedCard(item.redCard)}
            </View>
            <View style={[AppStyles.rowContainer, AppStyles.leftSmallMargin]}>
              {displayYellowCard(item.yellowCard)}
            </View>
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
          {isLoading ? <ActivityIndicator size="large" /> : showpartyList() }
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
  if(Platform.OS == 'android'){
    return(<SafeAreaView style={AppStyles.bottomAreaMargin}>
      <View style={[AppStyles.rowContainer, AppStyles.rightAligned, AppStyles.rightMargin]}>
        <InlineTextButton text="Manage Account" color="#258ea6" onPress={() => navigation.navigate("ManageAccount")}/>
      </View>
      <View><Image
      style={AppStyles.headerIcon}
        source={require('../assets/icon.png')}
      />
      <Text style={AppStyles.header}>Slip Count</Text>
      <Button 
        title="Add party" 
        onPress={() => setModalVisible(true)} 
        color="#fb4d3d" /></View>
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
        {auth.currentUser.emailVerified ? showContent() : showSendVerificationEmail()}
      
    </SafeAreaView>);
  }else{
  return (
    <SafeAreaView >
      <View style={[AppStyles.rowContainer, AppStyles.rightAligned, AppStyles.rightMargin, AppStyles.topMargin]}>
        <InlineTextButton text="Manage Account" color="#258ea6" onPress={() => navigation.navigate("ManageAccount")}/>
      </View>
      <View><Image
      style={AppStyles.headerIcon}
        source={require('../assets/icon.png')}
      />
      <Text style={AppStyles.header}>Slip Count</Text>
      <Button 
        title="Add party" 
        onPress={() => setModalVisible(true)} 
        color="#fb4d3d" /></View>
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
      
        {auth.currentUser.emailVerified ? showContent() : showSendVerificationEmail()}
      
    </SafeAreaView>
  )};
}