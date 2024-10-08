import { View, Text } from 'react-native'
import React from 'react'
import Header from '../../components/Home/Header'
import Slider from '../../components/Home/Slider'
import PetListByCategory from '../../components/Home/PetListByCategory'

export default function Home() {
  return (
    <View style={{
      padding:20,marginTop:20,
      flex:1,
    }}>
    {/* Header */}
    <Header/>
    {/* Slider */}
    <Slider/>
    {/* List of pets */}
    <PetListByCategory/>
    </View>
  )
}