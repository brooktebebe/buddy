import { View, Text, FlatList, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-expo'
import {query} from "firebase/database"
import {collection,getDocs,where}from "firebase/firestore"
import {db}from './../../config/FirebaseConfig'
import UserItem from '../../components/Inbox/UserItem'
import Colors from '../../constants/Colors'
export default function Inbox() {
  const [usersList,setUsersList]=useState([])
  const [loader,setLoader]=useState(false);
  useEffect(()=>{
    user&&getUserList();
  },[user])
  // get users list
  const {user} =useUser();
  const getUserList=async ()=>{
    setLoader(true)
    setUsersList([])
    const q =query(collection(db,'Chats'),where('userIds','array-contains',user?.primaryEmailAddress?.emailAddress))
    const querySnapshot=await getDocs(q);
    querySnapshot.forEach(doc=>{
      setUsersList(usersList=>[...usersList,doc.data()])
    })
    setLoader(false)
  }
  const friendsList =()=>{
    const friends =[];
    usersList.forEach((recored)=>{
      const friend=recored.users?.filter(frn=>frn?.email != user.primaryEmailAddress.emailAddress)
      const res = {
        docId:recored.id,
        ...friend[0]
      }
      friends.push(res)
    })
    return friends
  }
  return (
    <View style={{
      marginTop:20,
      padding:20,
    }}> 
      <Text style={{
        fontFamily:'outfit-medium',
        fontSize:30
      }}>Inbox</Text>
      <FlatList
      refreshing={loader}
      onRefresh={getUserList}
      style={{
        marginTop:20
      }}
      data={friendsList()}
      renderItem={(item,index)=>(
        <UserItem userInfo={item} key={index}/>
      )}
      />
    </View>
  )
}