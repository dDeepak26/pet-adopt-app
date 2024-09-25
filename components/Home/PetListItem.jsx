import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import { useRouter } from "expo-router";
import MarkFav from "../MarkFav";

export default function PetListItem({ pet }) {
  // console.log("Pet Image Url from firestore: " + pet.imageUrl);
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/pet-details",
          params: pet,
        })
      }
      style={styles.container}
    >
      <Image source={{ uri: pet?.imageUrl }} style={styles.image} />
      <View style={styles.favContainer}>
        <MarkFav pet={pet} color={"white"} />
      </View>
      <Text style={styles.name}>{pet.name}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.breed}>{pet.breed}</Text>
        <Text style={styles.age}>{pet.age} YRS</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 170, // Set a fixed width for the card, fits 2 items in a row with padding
    padding: 10,
    marginRight: 15,
    backgroundColor: Colors.WHITE,
    borderRadius: 10,
    overflow: "hidden", // Ensure children stay inside the container
  },
  image: {
    width: "100%", // Make image take the full width of the card
    height: 135,
    borderRadius: 10,
  },
  favContainer: {
    position: "absolute",
    zIndex: 10,
    right: 10,
    top: 10,
  },
  name: {
    fontFamily: "outfit-medium",
    fontSize: 18,
    marginTop: 10,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breed: {
    color: Colors.GRAY,
    fontFamily: "outfit-regular",
  },
  age: {
    fontFamily: "outfit-regular",
    color: Colors.PRIMARY,
    paddingHorizontal: 7,
    borderRadius: 10,
    fontSize: 11,
    backgroundColor: Colors.LIGHT_PRIMARY,
  },
});
