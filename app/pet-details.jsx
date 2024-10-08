import { View, Text, ScrollView, Pressable } from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import PetInfo from "../components/PetDetails/PetInfo";
import PetSubInfo from "../components/PetDetails/PetSubInfo";
import PetAbout from "../components/PetDetails/PetAbout";
import PetOwner from "../components/PetDetails/PetOwner";
import Colors from "../constants/Colors";
import {
  query,
  collection,
  where,
  getDocs,
  setDoc,
  doc,
} from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import { db } from "./../config/FirebaseConfig";
export default function PetDetails() {
  const { pet } = useLocalSearchParams();
  const { user } = useUser();
  const recivedPet = pet ? JSON.parse(pet) : {};
  const parsedPet = {
    about:recivedPet?.about,
    address:recivedPet?.address,
    sex:recivedPet?.sex,
    id:recivedPet?.id,
    name:recivedPet?.name,
    imageUrl:recivedPet?.imageUrl,
    age:recivedPet?.age,
    user:recivedPet?.user,
    weight:recivedPet?.weight,
    category:recivedPet?.category,
   }

  const nav = useNavigation();
  const router = useRouter();
  useEffect(() => {
    nav.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);
  const initiateChat = async () => {
    const docId1 =
      user?.primaryEmailAddress?.emailAddress + "_" + parsedPet?.user?.email;
    const docId2 =
      parsedPet?.user?.email + "_" + user?.primaryEmailAddress?.emailAddress;
    const q = query(
      collection(db, "Chats"),
      where("id", "in", [docId1, docId2])
    );
    const snapShot = await getDocs(q);
    snapShot.forEach((chat) => {
      router.push({
        pathname: "/chat",
        params: { id: chat.id },
      });
    });
    if (snapShot?.docs?.length == 0) {
      await setDoc(doc(db, "Chats", docId1), {
        id: docId1,
        users: [
          {
            email: user?.primaryEmailAddress?.emailAddress,
            name: user?.fullName,
            imageUrl: user?.imageUrl,
          },
          {
            email: parsedPet?.user?.email,
            name: parsedPet?.user?.name,
            imageUrl: parsedPet?.user?.imageUrl,
          },
        ],
        userIds: [
          user?.primaryEmailAddress?.emailAddress,
          parsedPet?.user?.email,
        ],
      });
      router.push({
        pathname: "/chat",
        params: { id: docId1 },
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        {/* pet-info */}
        <PetInfo pet={parsedPet} />

        {/* pet-sub-info */}
        <PetSubInfo pet={parsedPet} />
        {/* about */}
        <PetAbout pet={parsedPet} />
        {/* owner-details */}
        <PetOwner pet={parsedPet} />
        <View style={{ height: 70 }}></View>
      </ScrollView>
      {/* adobt-me */}
      <View
        style={{
          position: "absolute",
          width: "100%",
          bottom: 0,
        }}
      >
        {parsedPet?.user?.email == user?.primaryEmailAddress?.emailAddress ? (
          <></>
        ) : (
          <Pressable
            onPress={initiateChat}
            style={{
              padding: 15,
              backgroundColor: Colors.PRIMARY,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontFamily: "outfit",
                fontSize: 20,
                color: Colors.WHITE,
              }}
            >
              Adopt Me.
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
