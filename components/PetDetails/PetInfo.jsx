import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import MarkFav from "../MarkFav";

export default function PetInfo({ pet }) {
  console.log("Pet Image url from useLocalSearchParams: " + pet.imageUrl);

  return (
    <View>
      <Image source={{ uri: pet?.imageUrl }} style={styles.image} />
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.nameText}>{pet?.name}</Text>
          <Text
            style={styles.addressText}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {pet?.address}
          </Text>
        </View>
        <MarkFav pet={pet} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 400,
    objectFit: "cover",
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    width: "85%",
  },
  nameText: {
    fontFamily: "outfit-bold",
    fontSize: 27,
  },
  addressText: {
    fontFamily: "outfit-regular",
    fontSize: 16,
    color: Colors.GRAY,
  },
});
