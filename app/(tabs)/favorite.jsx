import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Shared from "./../../Shared/Shared";
import { useUser } from "@clerk/clerk-expo";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import PetListItem from "./../../components/Home/PetListItem";

export default function Favorite() {
  const { user } = useUser();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [favPetList, setFavPetList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    if (user) {
      GetFavPetIds();
    }
  }, [user]);

  useEffect(() => {
    if (favoriteIds.length > 0) {
      GetFavPetList();
    }
  }, [favoriteIds]);

  // Fetching favorites list
  const GetFavPetIds = async () => {
    try {
      setLoader(true);
      const result = await Shared.GetFavList(user);
      setFavoriteIds(result?.favorites || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setLoader(false);
    }
  };

  // Fetching related pets list
  const GetFavPetList = async () => {
    try {
      setLoader(true);
      setFavPetList([]); // Reset the list before fetching new items
      const q = query(collection(db, "Pets"), where("id", "in", favoriteIds));
      const querySnapshot = await getDocs(q);
      const fetchedPets = [];
      querySnapshot.forEach((doc) => {
        fetchedPets.push(doc.data());
      });
      setFavPetList(fetchedPets);
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoader(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Favorite Pets</Text>

      <FlatList
        data={favPetList}
        numColumns={2}
        contentContainerStyle={styles.flatListContent}
        onRefresh={GetFavPetIds}
        refreshing={loader}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <PetListItem pet={item} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  headerText: {
    fontFamily: "outfit-medium",
    fontSize: 30,
    color: "#333",
    marginBottom: 20,
  },
  flatListContent: {
    justifyContent: "space-between",
  },
  itemContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
});
