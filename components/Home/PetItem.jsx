import { View, Text, Image } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";

export default function PetItem({ pet }) {
  return (
    <View
      style={{
        display:'flex',
        padding: 10,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        marginLeft:10,
        marginRight:10,
        marginTop:5,
        marginBottom:5,
      }}
    >
      <Image
        source={{ uri: pet?.imageUrl }}
        style={{
          height: 135,
          width: 150,
          objectFit: "cover",
          borderRadius: 10,
        }}
      />

        
   
      <Text
        style={{
          fontFamily: "outfit-medium",
          fontSize: 18,
        }}
      >
        {pet?.name.toUpperCase()}
      </Text>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: Colors.GRAY, fontFamily: "outfit" }}>
          {pet?.breed}
        </Text>
        <Text style={{ color: Colors.PRIMARY, fontFamily: "outfit" }}>
          {pet?.age} Years
        </Text>
      </View>
      </View>
  );
}
