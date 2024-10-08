import { View, Text, Image, FlatList, Pressable } from "react-native";
import React,{useCallback} from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Colors from "./../../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
export default function Profile() {
  const { user } = useUser();
  const router = useRouter();
  const {signOut} = useAuth();
  const menu = [
    {
      id: 1,
      name: "Add New Pet",
      icon: "add-circle",
      path: "/add-new-pet",
    },
    {
      id: 5,
      name: "My Posts",
      icon: "bookmark",
      path: "/user-post",
    },
    {
      id: 2,
      name: "Favorites",
      icon: "heart",
      path: "/(tabs)/favorite",
    },
    {
      id: 3,
      name: "Inbox",
      icon: "mail",
      path: "/(tabs)/inbox",
    },
    {
      id: 4,
      name: "Logout",
      icon: "exit",
      path: "logout",
    },
  ];
  const clickListner= async (item)=>{
    if(item?.path !=='logout'){
      router.push({
        pathname:item?.path
      })
    }else{
      await handleLogout();
    }
  }

  const handleLogout = useCallback(async () => {
    try {
        await signOut();
        router.push('/'); // Redirect to the login screen
    } catch (err) {
        console.error('Logout error', err);
        alert('An error occurred during logout. Please try again.');
    }
}, [router, signOut]);
  return (
    <View
      style={{
        padding: 20,
        marginTop: 20,
      }}
    >
      <Text style={{ fontFamily: "outfit-medium", fontSize: 30 }}>Profile</Text>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginVertical: 25,
        }}
      >
        <Image
          source={{ uri: user?.imageUrl }}
          style={{
            width: 80,
            height: 80,
            borderRadius: 99,
          }}
        />
        <Text style={{ fontFamily: "outfit-bold", fontSize: 20 }}>
          {user?.fullName}
        </Text>
        <Text
          style={{ fontFamily: "outfit", fontSize: 16, color: Colors.GRAY }}
        >
          {user?.primaryEmailAddress?.emailAddress}
        </Text>
      </View>
      <View>
        <FlatList
          data={menu}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={()=>clickListner(item)}
              key={index}
              style={{
                marginVertical: 10,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: Colors.WHITE,
                borderRadius: 10,
                padding: 10,
              }}
            >
              <Ionicons
                style={{
                  padding: 10,
                  backgroundColor: Colors.CREAME,
                  borderRadius: 10,
                }}
                name={item?.icon}
                size={30}
                color={Colors.PRIMARY}
              />
              <Text style={{ fontFamily: "outfit", fontSize: 20 }}>
                {item?.name}
              </Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}
