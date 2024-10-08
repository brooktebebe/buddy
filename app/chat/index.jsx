import { View, Text, Dimensions } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { getDoc, doc, addDoc, collection, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from './../../config/FirebaseConfig'
import { useUser } from '@clerk/clerk-expo';
import { GiftedChat } from 'react-native-gifted-chat';
import moment from 'moment';
export default function ChatScreen() {
    const  params  = useLocalSearchParams();
    const nav = useNavigation();
    const {user}=useUser();
    const [messages,setMessages]=useState([])

    const getUserDetails = async () => {
        const docRef = doc(db, 'Chats', params?.id);
        const docSnapshot = await getDoc(docRef);
        const result = docSnapshot.data();
        const otherUser = result?.users?.filter(x=>x?.email!==user?.primaryEmailAddress.emailAddress)
        console.log(otherUser)
        nav.setOptions({
            headerTitle:otherUser[0].name
        })
    }
    useEffect(()=>{
        getUserDetails()
        const unsubscribe =onSnapshot(collection(db,'Chats',params.id,'Messages'),orderBy('CreatedAt'),(snapShot)=>{
            const messageData= snapShot.docs.map(doc=>({
                _id:doc.id,
                ...doc.data()
            }))
            setMessages(messageData)
        })
        return ()=> unsubscribe()
    },[])


    const onSend = useCallback(async (messages = []) => {
        messages[0].createdAt=moment().format('MM-DD-YYYY HH:mm:ss')
        // Update local state with new messages
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
        
        // Save each message to Firestore
        const chatRef = collection(db, 'Chats', params.id, 'Messages');
        
        try {
            for (const message of messages) {
                await addDoc(chatRef, message);
            }
        } catch (error) {
            console.error("Error saving message: ", error);
        }
    }, [db, params.id]);
    
    return (
        <GiftedChat
        
        messages={messages}
        onSend={messages => onSend(messages)}
        showUserAvatar={true}
        user={{
          _id: user?.primaryEmailAddress?.emailAddress,
          name:user?.fullName,
          avatar:user?.imageUrl
        }}
      />
    )
}