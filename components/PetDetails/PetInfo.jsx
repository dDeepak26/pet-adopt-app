import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import Colors from "../../constants/Colors";
import MarkFav from "../MarkFav";

export default function PetInfo({ pet }) {
  const [imageUrl, setImageUrl] = useState(pet.imageUrl);

  useEffect(() => {
    const fetchPetImageUrl = async () => {
      try {
        const petDocRef = doc(db, "Pets", pet.id);
        const petDocSnap = await getDoc(petDocRef);

        if (petDocSnap.exists()) {
          const petData = petDocSnap.data();
          // console.log("Fetched imageUrl from Firestore:", petData.imageUrl);
          setImageUrl(petData.imageUrl);
        } else {
          console.log("No such pet document!");
        }
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };

    fetchPetImageUrl();
  }, [pet.id]);

  return (
    <View>
      <Image source={{ uri: imageUrl }} style={styles.image} />
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
