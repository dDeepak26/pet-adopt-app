import { View, FlatList, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import Category from "./Category";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import PetListItem from "./PetListItem";

export default function PetListByCategory() {
  const [petList, setPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    GetPetList("Dog");
  }, []);

  // Used to get Pet List on Category Selection
  const GetPetList = async (category) => {
    setLoader(true);
    setPetList([]);
    const q = query(collection(db, "Pets"), where("category", "==", category));
    const querySnapshot = await getDocs(q);

    const pets = querySnapshot.docs.map((doc) => doc.data());
    setPetList(pets);
    setLoader(false);
  };

  return (
    <View style={styles.container}>
      <Category category={(value) => GetPetList(value)} />
      <FlatList
        data={petList}
        style={styles.flatList}
        horizontal
        refreshing={loader}
        onRefresh={() => GetPetList("Dog")}
        renderItem={({ item }) => <PetListItem pet={item} />}
        keyExtractor={(item) => item.id} // Ensure each item has a unique key
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    marginTop: 10,
  },
});
