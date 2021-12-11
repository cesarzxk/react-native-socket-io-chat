import Expo from 'expo';
import React, { useEffect, useRef, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StatusBar, Text, TextInput, View, ScrollViewProps} from 'react-native';
import io from 'socket.io-client';
import { styles } from './styles.native';

// Replace this URL with your own, if you want to run the backend locally!
const url = 'https://cesarzxk-socketio-chat-server.herokuapp.com/';

interface message{
  id:string, 
  message:string, 
  time:{hours:number, seconds:number, milliseconds:number, minutes:number},
  date:{day:number, mouth:number, year:number},
  server:string,
  key:string,
}


export default function Chat (){
  const [socket, setSocket] = useState(io(url));
  
  const [messages, setMessages] = useState<message[]>([]) 
  const [code, setCode] = useState('')
  const [text, setText] = useState('')
  const [room, setRoom] = useState('')
  const [id, setId] = useState('')

  let ChatRef = useRef<ScrollView>(null)

  function sentMessage(message:string){
    if (code != ''){
      setText('')
      const date = new Date();

      let newMessage = {
        key:'',
        message:message, 
        id:id, 
        server:room,
        date:{
          day:date.getDay(),
          year:date.getFullYear(),
          mouth:date.getMonth(),
        },
        time:{
          hours:date.getHours(),
          minutes: date.getMinutes(),
          seconds:date.getSeconds(),
          milliseconds:date.getMilliseconds(),
      }}

      newMessage.key=CreateMessageKey(newMessage);

      setMessages([...messages, newMessage])
      socket.emit('chat', newMessage)
    }
  }

  function Connect(){
      socket.emit('join', {code:code, id:socket.id})
      socket.once('statusJoin', log => setRoom(log.room));
      setId(socket.id);
  }

  function CreateMessageKey(msg:message){
    const date = `${msg.date.day}/${msg.date.mouth}/${msg.date.year}`
    const time = `${msg.time.hours}:${msg.time.minutes}:${msg.time.seconds}:${msg.time.milliseconds}`
    return  `${msg.id};${date};${time}`
  }

  useEffect(()=>{
      socket.once('messages', (data)=>{
        setMessages([...messages, data])
      })
  },[messages])
 

    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor='#fff'/>
          <View style={styles.code}>
            <Text> Room Code: </Text>
            <TextInput value={code} style={styles.codeText} onChangeText={text => setCode(text)}/>
            <Button title='Enter' onPress={Connect}/>
          </View>

          <Text style={styles.status}>Conected: {room}</Text>

          <ScrollView ref={ChatRef} onContentSizeChange={()=>{ChatRef.current?.scrollToEnd()}} style={styles.messageList}>

              {messages?.map((result)=>
              <View 
              key={result.key}
              style={[
                styles.message, (result.id != id)&&
                {
                  borderBottomRightRadius:20, 
                  borderBottomLeftRadius:0, 
                  backgroundColor:'#fff',
                  alignSelf:'flex-start',
                }
                ]}>
                <Text>{}</Text>
                <Text style={styles.messageUserId}>{result.id}</Text>
                <Text>{result.message}</Text>
                <Text style={styles.messageTimer}>{result.time.hours}:{result.time.minutes}</Text>
              </View>
              )}

            
          </ScrollView>
          <View style={styles.code}>
            <TextInput value={text} 
            style={[styles.codeText, {textAlign:'left', paddingLeft:7}]} 
            onChangeText={text => setText(text)}
            onSubmitEditing={()=>{sentMessage(text); }}
            />
            
            <Button 
            disabled={(room=='') || (text=='')} 
            title='send' 
            onPress={()=>{sentMessage(text); setText('')}}/>
          </View>
      </SafeAreaView>
    );
}

