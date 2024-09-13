import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import Colors from "./../../constants/Colors";

export default function Category({ category }) {
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Dog");

  useEffect(() => {
    GetCategories();
  }, []);

  // Used to Get Category list from DB
  const GetCategories = async () => {
    setCategoryList([]);
    const snapshot = await getDocs(collection(db, "Category"));
    const categories = snapshot.docs.map((doc) => doc.data());
    setCategoryList(categories);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Category</Text>
      <FlatList
        data={categoryList}
        numColumns={4}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(item.name);
              category(item.name);
            }}
            style={styles.itemContainer}
          >
            <View
              style={[
                styles.categoryContainer,
                selectedCategory === item.name &&
                  styles.selectedCategoryContainer,
              ]}
            >
              <Image source={{ uri: item?.imageUrl }} style={styles.image} />
            </View>
            <Text style={styles.itemText}>{item?.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.name} // Ensure each item has a unique key
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  title: {
    fontFamily: "outfit-medium",
    fontSize: 20,
  },
  itemContainer: {
    flex: 1,
    alignItems: "center",
    margin: 5,
  },
  categoryContainer: {
    backgroundColor: Colors.LIGHT_PRIMARY,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.PRIMARY,
  },
  selectedCategoryContainer: {
    backgroundColor: Colors.SECONDARY,
    borderColor: Colors.SECONDARY,
  },
  image: {
    width: 40,
    height: 40,
  },
  itemText: {
    textAlign: "center",
    fontFamily: "outfit-regular",
  },
});
