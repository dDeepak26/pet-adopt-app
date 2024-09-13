import { View, Image, FlatList, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

export default function Slider() {
  const [sliderList, setSliderList] = useState([]);

  useEffect(() => {
    GetSliders();
  }, []);

  // Fetch sliders from the database
  const GetSliders = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Sliders"));
      const sliders = snapshot.docs.map((doc) => doc.data());
      setSliderList(sliders);
    } catch (error) {
      console.error("Error fetching sliders: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={sliderList}
        renderItem={({ item }) => (
          <View style={styles.sliderItem}>
            <Image
              source={{ uri: item?.imageUrl }}
              style={styles.sliderImage}
            />
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 15,
  },
  sliderItem: {
    marginRight: 15,
  },
  sliderImage: {
    width: Dimensions.get("window").width * 0.9,
    height: 170,
    borderRadius: 15,
  },
});
