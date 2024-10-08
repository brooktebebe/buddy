import { View } from "react-native";
import React, { useEffect, useState } from "react";
import Category from "./Category"; // Assumes this is a component
import { db } from "../../config/FirebaseConfig";
import { getDocs, collection, query, where } from "firebase/firestore";
import ItemList from "./ItemList";
import { FlatList } from "react-native"; // Use FlatList from 'react-native'
import { StyleSheet } from "react-native";
import Colors from "../../constants/Colors";
// import PetItem from './petItem';
export default function PetListByCategory() {
  const [pets, setPets] = useState([]);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    getPets(); // Call getPets on component mount
  }, []);

  const getPets = async (category) => {
    try {
      setLoader(true);
      setPets([]);
      const q = query(
        collection(db, "Pets"),
        where("category", "==", category ? category : "dogs")
      );
      const snapShot = await getDocs(q);
      const petsArray = [];
      snapShot.forEach((pet) => {
        const petData = pet.data(); // Get the pet data
        petsArray.push(petData); // Push the complete pet object to the array
      });
      setPets(petsArray); // Update the pets state with the entire array
      setLoader(false);
    } catch (error) {
      console.error("Error fetching pets: ", error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Assuming Category is a component that passes the selected category back */}
      <Category category={(value) => getPets(value)} />
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          padding:5
        }}
      >
        <FlatList
         contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onRefresh={getPets}
          refreshing={loader}
          numColumns={2}
          data={pets}
          keyExtractor={(item, index) => index.toString()} // Use index if no unique key is available
          renderItem={({ item }) => <ItemList pet={item} key={item.id} />}
          showsVerticalScrollIndicator={false} // Optional: hides the scroll indicator
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
