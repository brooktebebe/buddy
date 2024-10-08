import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons'

export default function PetOwner({pet}) {
  return (
    <View style={{
      paddingHorizontal:20,
      display:'flex',
      flexDirection :'row',
      alignItems:'center',
      gap:20,
      marginHorizontal:20,
      borderWidth:1,
      borderRadius:15,
      padding:10,
      borderColor:Colors.PRIMARY,
      backgroundColor:Colors.WHITE

    }}>
      <View style={{display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center' ,flex:1}}>
    <View style={{display:'flex',flexDirection:'row', gap:10}}>
    <Image source={{uri:pet?.user?.imageUrl}} style={{width:50,height:50,borderRadius:50}}/>
     <View>
     <Text style={{fontFamily:'outfit-medium',fontSize:17,color:Colors.SECONDARY}}>{pet?.user?.name}</Text>
     <Text style={{fontFamily:'outfit', color:Colors.GRAY}}>Pet Owner</Text>
     </View>
    </View>
     
     
      <Ionicons name='send-sharp' size={24} color={Colors.PRIMARY}/>
    </View>
    </View>
  )
}