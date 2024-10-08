import { View, Text, FlatList, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Shared from "./../../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";
import { getDocs, query, where, collection } from "firebase/firestore";
import PetItem from "../../components/Home/PetItem";
import { db } from "../../config/FirebaseConfig";
import { useRouter } from "expo-router";
export default function Favorite() {
  const { user } = useUser();
  const [favPets, setFavPets] = useState([]);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  useEffect(() => {
    user && getFavPetIds();
  }, [user]);

  const getFavPetIds = async () => {
    setLoader(true);
    const result = await Shared.getFavList(user);
    setLoader(false);
    console.log("before");

    result?.favorites.length > 0 && (await getPetList(result?.favorites));
    console.log("after");
  };
  const getPetList = async (favorites) => {
    setLoader(true);
    setFavPets([]);
    const q = query(collection(db, "Pets"), where("id", "in", favorites));
    const snapShot = await getDocs(q);
    snapShot.forEach((doc) => {
      setFavPets((favPets) => [...favPets, doc.data()]);
    });
    setLoader(false);
  };
  return (
    <View style={{ padding: 20, marginTop: 20 }}>
      <Text style={{ fontFamily: "outfit-medium", fontSize: 30 }}>
        Favorite
      </Text>
      <FlatList
       contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
        data={favPets}
        onRefresh={getFavPetIds}
        refreshing={loader}
        numColumns={2}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/pet-details",
                params: { pet: JSON.stringify(item) },
              })
            }
          >
            <PetItem pet={item} key={index} />
          </Pressable>
        )}
      />
    </View>
  );
}
