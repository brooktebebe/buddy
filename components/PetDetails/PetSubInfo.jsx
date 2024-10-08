import { View } from 'react-native'
import React from 'react'
import PetSubInfoCard from './PetSubInfoCard'
export default function PetSubInfo({ pet }) {
    return (
        <View style={{ paddingHorizontal: 20 }}>
           <View style={{display:'flex',flexDirection:'row'}}>
            <PetSubInfoCard icon={require('./../../assets/images/calendar.png')} value={pet?.age +" Years"} title={"Age"}/>
            <PetSubInfoCard icon={require('./../../assets/images/bone.png')} value={pet?.breed} title={"Breed"}/>
        </View>
        <View style={{display:'flex',flexDirection:'row'}}>
        <PetSubInfoCard icon={require('./../../assets/images/sex.png')} value={pet?.sex} title={"Sex"}/>
            <PetSubInfoCard icon={require('./../../assets/images/weight.png')} value={pet?.weight+" Kg"} title={"Weight"}/>
           
        </View>
        </View>
    )
}