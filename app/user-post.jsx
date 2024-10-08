import { View, Pressable, FlatList, Alert,Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { db } from "./../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import PetItem from "../components/Home/PetItem";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
export default function UserPost() {
  const { user } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const nav = useNavigation();
  useEffect(() => {
    nav.setOptions({
      headerTitle: "Your posts",
    });
    user && getUserPost();
  }, [user]);
  const getUserPost = async () => {
    setLoading(true);
    setPosts([]);
    const q = query(
      collection(db, "Pets"),
      where("user.email", "==", user.primaryEmailAddress.emailAddress)
    );
    const snapShot = await getDocs(q);
    snapShot.forEach((doc) => {
      setPosts((posts) => [...posts, doc.data()]);
      console.log(doc.data());
    });
    setLoading(false);
  };
  const handleDelete = (docId) => {
    Alert.alert(
      "Do you want to delete?",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => deletePost(docId),
        },
      ]
    );
  };
  const deletePost = async (docId) => {
    await deleteDoc(doc(db, "Pets", docId));
    await getUserPost();
  };
  return (
    <View style={{ padding: 20, marginTop: 20 }}>
        {posts.length>0?
      <FlatList
        data={posts}
        onRefresh={getUserPost}
        refreshing={loading}
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
            <View
              style={{
                padding: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: Colors.WHITE,
                borderRadius: 20,
              }}
            >
              <PetItem pet={item} key={index} />
              <View
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  width: "100%",
                }}
              >
                <Pressable
                  onPress={() => handleDelete(item?.id)}
                  style={{ display: "flex", alignItems: "flex-end" }}
                >
                  <Ionicons name="trash" size={30} color={Colors.SECONDARY} />
                </Pressable>
              </View>
            </View>
          </Pressable>
        )}
      />
    :<Text style={{fontFamily:'outfit-medium',fontSize:20,textAlign:'center'}}>No post found.</Text>
    }
    </View>
  );
}
