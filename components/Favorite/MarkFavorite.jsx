import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import Shared from "./../../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";
export default function MarkFavorite({ pet }) {
  const { user } = useUser();
  const [fav, setFav] = useState([]);
  useEffect(() => {
    user && getFav();
  }, [user]);
  const getFav = async () => {
    const result = await Shared.getFavList(user);
    console.log(result);
    setFav(result?.favorites ? result?.favorites : []);
    console.log(fav);
  };
  const addToFavorite = async () => {
    const lastFev = fav;
    lastFev.push(pet.id);
    await Shared.updateFavorite(user, lastFev);
    await getFav();
  };
  const removeFromFavorite = async () => {
    const lastFev =fav.filter((item) => item != pet.id);
    await Shared.updateFavorite(user, lastFev);
    await getFav();
  };

  return (
    <View>
      {fav?.includes(pet?.id) ? (
        <Pressable
          onPress={() => {
            removeFromFavorite();
          }}
        >
          <Ionicons name="heart" size={30} color={"red"} />
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {
            addToFavorite();
          }}
        >
          <Ionicons name="heart-outline" size={30} color={"black"} />
        </Pressable>
      )}
    </View>
  );
}
