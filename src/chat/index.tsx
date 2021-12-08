import Expo from 'expo';
import React, { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StatusBar, Text, TextInput, View } from 'react-native';
import io from 'socket.io-client';
import { styles } from './styles.native';

// Replace this URL with your own, if you want to run the backend locally!
const url = 'http://10.0.0.155:3333/';

interface message{
  id:string, 
  message:string, 
  date:{hours:number, seconds:number, milliseconds:number, minutes:number}
  server:string
}


export default function Chat (){
  const [socket, setSocket] = useState(io(url));

  const [messages, setMessages] = useState<message[]>([]) 
  const [code, setCode] = useState('')
  const [text, setText] = useState('')
  const [room, setRoom] = useState('')
  const [id, setId] = useState('')

  function sentMessage(message:string){
    const date = new Date();

    const newMessage = {
      message:message, 
      id:id, 
      server:room,
      date:{
        hours:date.getHours(),
        minutes: date.getMinutes(),
        seconds:date.getSeconds(),
        milliseconds:date.getMilliseconds(),
    }}

    setMessages([...messages, newMessage])
    socket.emit('chat', newMessage)
  }

  function Connect(){
      socket.emit('join', {code:code, id:socket.id})
      socket.once('statusJoin', log => setRoom(log.room));
      setId(socket.id);
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

          

          <ScrollView onContentSizeChange={(action)=>{}} style={styles.messageList}>
              {messages?.map((result)=>
              <View style={[styles.message, (result.id != id)&& {borderBottomRightRadius:20, 
                                                                borderBottomLeftRadius:0, 
                                                                backgroundColor:'#fff',
                                                                alignSelf:'flex-start',
                                                                } ]}>
                <Text style={styles.messageUserId}>{result.id}</Text>
                <Text>{result.message}</Text>
                <Text style={styles.messageTimer}>{result.date.hours}:{result.date.minutes}</Text>
              </View>
              )}

            
          </ScrollView>
          <View style={styles.code}>
            <TextInput value={text} style={[styles.codeText, {textAlign:'left', paddingLeft:7}]} onChangeText={text => setText(text)}/>
            <Button disabled={(room=='') || (text=='')} title='send' onPress={()=>{sentMessage(text); setText('')}}/>
          </View>
      </SafeAreaView>
    );
}

