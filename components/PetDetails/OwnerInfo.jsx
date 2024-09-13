import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function OwnerInfo({ pet }) {
  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Image source={{ uri: pet?.userImage }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.userName}>{pet?.userName}</Text>
          <Text style={styles.userRole}>Pet Owner</Text>
        </View>
      </View>
      <Ionicons name="send-sharp" size={24} color={Colors.PRIMARY} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 70,
    paddingHorizontal: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.PRIMARY,
    backgroundColor: Colors.WHITE,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "black",
    marginRight: 20,
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontFamily: "outfit-medium",
    fontSize: 17,
  },
  userRole: {
    fontFamily: "outfit-regular",
    color: Colors.GRAY,
  },
});
