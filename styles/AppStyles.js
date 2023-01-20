import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  imageContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16
  },
  noPadding: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "red"
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginVertical: 4,
  },
  fillSpace: {
    flex: 1
  },
  rightAligned: {
    justifyContent: "flex-end"
  },
  leftAligned:{
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topMargin: {
    marginTop: 25
  },
  bottomMargin: {
    marginBottom: 16
  },
  rightMargin: {
    marginRight: 16
  },
  leftMargin: {
    marginLeft: 16
  },
  leftSmallMargin: {
    marginLeft: 4
  },
  backgroundCover: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    opacity: 0.7,
    padding: 16
  },
  lightText: {
    color: "#fff"
  },
  errorText: {
    color: "#ff0000"
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    alignSelf: "center"
  },
  titre: {
    fontSize: 17,
    alignSelf: "center"
  },
  headerIcon: {
    alignSelf: "center"
  },
  textInput: {
    alignSelf: 'stretch',
    padding: 8,
    borderBottomWidth: 2,
    marginVertical: 8
  },
  partyList: {
    alignSelf: 'stretch',
    padding: 8,
    backgroundColor: 'grey',
    borderWidth: 2,
    borderRadius: 10,
    marginVertical: 8
  },
  lightTextInput: {
    borderBottomColor: "#ffffff"
  },
  darkTextInput: {
    borderBottomColor: "#000000"
  },
  inlineTextButton: {
    color: "#87F1FF"
  },
  pressedInlineTextButton: {
    color: "#87F1FF",
    opacity: 0.6
  },
  bottomAreaMargin: {
    marginBottom: 470
  }
});