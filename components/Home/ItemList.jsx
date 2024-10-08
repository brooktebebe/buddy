import { View, Text,Image, Pressable } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { useRouter } from 'expo-router'
export default function ItemList({pet}) {
  const imageUrl = encodeURIComponent(pet?.imageUrl)
  console.log(imageUrl);
   const filteredPet = {
    about:pet?.about,
    address:pet?.address,
    sex:pet?.sex,
    id:pet?.id,
    name:pet?.name,
    imageUrl:imageUrl,
    age:pet?.age,
    user:pet?.user,
    weight:pet?.weight,
    category:pet?.category,
   }
  const router = useRouter();
  let serializedPet = JSON.stringify(filteredPet);
  return (
    <Pressable onPress={()=>router.push({
      pathname:'/pet-details',
      params:{pet:serializedPet}
    })}>
    <View
    style={{
        marginLeft:10,
        marginRight:10,
        marginTop:5,
        marginBottom:5,
        padding:10,
        backgroundColor:Colors.WHITE,
        borderRadius:10
    }}
    >
      <Image source={{uri:pet?.imageUrl}} style={{
        height:135,
        width:150,
        objectFit:'cover',
        borderRadius:10
      }}/>
      <Text
      style={{
        fontFamily:'outfit-medium',
        fontSize:18
      }}
      
      >{pet?.name}</Text>
      <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between'}}>
        <Text style={{color:Colors.GRAY,fontFamily:'outfit'}}>{pet?.breed}</Text>
        <Text style={{color:Colors.PRIMARY,fontFamily:'outfit'}}>{pet?.age} Years</Text>
      </View>
    </View>
    </Pressable>
  )
}