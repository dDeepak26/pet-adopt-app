import { View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import Shared from "./../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";

export default function MarkFav({ pet, color = "black" }) {
  const { user } = useUser();
  const [favList, setFavList] = useState([]);

  useEffect(() => {
    if (user) {
      GetFav();
    }
  }, [user]);

  const GetFav = async () => {
    try {
      const result = await Shared.GetFavList(user);
      // console.log("Fetched favorites:", result);
      setFavList(result?.favorites || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  const AddToFav = async () => {
    try {
      const favResult = [...favList]; // Create a copy of the favList
      if (!favResult.includes(pet.id)) {
        favResult.push(pet.id);
      }
      // console.log("Updating favorites with:", favResult);
      await Shared.UpdateFav(user, favResult);
      GetFav(); // Refresh the favList
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const RemoveFromFav = async () => {
    try {
      const favResult = favList.filter((id) => id !== pet.id); // Remove pet.id from the list
      // console.log("Updating favorites with:", favResult);
      await Shared.UpdateFav(user, favResult);
      GetFav(); // Refresh the favList
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <View>
      {favList.includes(pet.id) ? (
        <Pressable onPress={() => RemoveFromFav()}>
          <Ionicons name="heart" size={30} color="red" />
        </Pressable>
      ) : (
        <Pressable onPress={() => AddToFav()}>
          <Ionicons name="heart-outline" size={30} color={color} />
        </Pressable>
      )}
    </View>
  );
}
