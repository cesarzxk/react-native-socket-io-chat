import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
    container: {
      height:'100%',
      width:'100%',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal:10,
      paddingVertical:10
    },
    code:{
      flexDirection: 'row',
      width:'100%', 
      alignItems:'center',
      justifyContent:'center',
    },
    codeText:{
      borderWidth:1,
      flex:1,
      height:40,
      marginRight:10,
      textAlign:'center',
      borderColor:'#ddd'
    },
  
    status:{
      width:'100%',
      textAlign:'center',
      textAlignVertical:'center'
    },
  
    messageList:{
      width:'100%',
      backgroundColor:'#00ff0022',
    
    },
  
    message:{
      maxWidth:'80%',
      backgroundColor:'#5ff5',
      marginTop:10,
      marginHorizontal:10,
      borderRadius:20,
      borderBottomRightRadius:0,
      padding:5,
      alignSelf:'flex-end',
    },
    messageUserId:{
      alignSelf:'center',
      fontSize:12,
      fontWeight:'bold',
      marginBottom:4
    },
  
    messageTimer:{
      alignSelf:'flex-end',
      marginRight:10,
      fontSize:9,
    }
  
  });