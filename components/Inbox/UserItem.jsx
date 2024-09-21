import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import Colors from "./../../constants/Colors";
import { Link } from "expo-router";

export default function UserItem({ userInfo }) {
  return (
    <Link href={"/chat?id=" + userInfo.docId} style={styles.linkStyle}>
      <View style={styles.container}>
        <Image source={{ uri: userInfo?.image }} style={styles.imageStyle} />
        <Text style={styles.userName}>{userInfo.name}</Text>
      </View>
      <View style={styles.bottomBorder}></View>
    </Link>
  );
}

const styles = StyleSheet.create({
  linkStyle: {
    marginBottom: 15,
    borderBottomWidth: 0.2,
    borderColor: Colors.GRAY,
    paddingBottom: 10,
    marginTop: 10,
  },
  container: {
    marginVertical: 7,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  imageStyle: {
    width: 40,
    height: 40,
    borderRadius: 99,
  },
  userName: {
    fontFamily: "outfit-regular",
    fontSize: 20,
  },
  bottomBorder: {
    borderBottomWidth: 1,
    borderColor: Colors.GRAY,
    marginTop: 10,
  },
});
