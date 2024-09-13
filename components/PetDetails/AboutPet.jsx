import { View, Text, Pressable, StyleSheet } from "react-native";
import React, { useState } from "react";
import Colors from "../../constants/Colors";

export default function AboutPet({ pet }) {
  const [readMore, setReadMore] = useState(false);

  const handlePress = () => {
    setReadMore(!readMore);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>About {pet?.name}</Text>
      <Text style={styles.description} numberOfLines={readMore ? 50 : 3}>
        {pet?.about}
      </Text>
      <Pressable onPress={handlePress}>
        <Text style={styles.toggleText}>
          {readMore ? "Show Less" : "Read More"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 20,
  },
  description: {
    fontFamily: "outfit-regular",
    fontSize: 16,
  },
  toggleText: {
    fontFamily: "outfit-medium",
    fontSize: 14,
    color: Colors.SECONDARY,
  },
});
