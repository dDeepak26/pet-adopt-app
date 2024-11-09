import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { db } from "../../config/FirebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import PetListItem from "../../components/Home/PetListItem";
import Colors from "../../constants/Colors";

export default function UserPost() {
  const [userPostList, setUserPostList] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigation = useNavigation();
  const { user } = useUser();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Your Posts",
    });
    user && GetUserPost();
  }, [user]);

  // To get user post
  const GetUserPost = async () => {
    setLoader(true);
    setUserPostList([]);
    const q = query(
      collection(db, "Pets"),
      where("userEmail", "==", user?.primaryEmailAddress.emailAddress)
    );
    const querySnapshort = await getDocs(q);

    querySnapshort.forEach((doc) => {
      // console.log("User Post: " + doc.data());
      setUserPostList((prev) => [...prev, doc.data()]);
    });
    setLoader(false);
  };

  // To handle delete button actions
  const OnDeletePost = (docId) => {
    Alert.alert(
      "Do you want to Delete?",
      "Do you really want to delete this post",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Click"),
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => detelePost(docId),
          style: "destructive",
        },
      ]
    );
  };

  // To delete post
  const detelePost = async (docId) => {
    await deleteDoc(doc(db, "Pets", docId));
    GetUserPost();
  };
  return (
    <View style={styles.container}>
      <Text style={styles.headerTxt}>Your Posts</Text>
      <FlatList
        data={userPostList}
        numColumns={2}
        refreshing={loader}
        onRefresh={GetUserPost}
        renderItem={({ item, index }) => (
          <View>
            <PetListItem pet={item} key={index} />
            <Pressable
              onPress={() => OnDeletePost(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonTxt}>Delete</Text>
            </Pressable>
          </View>
        )}
      />
      {userPostList?.length == 0 && <Text>No Post Found</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerTxt: {
    fontFamily: "outfit-medium",
    fontSize: 30,
  },
  deleteButton: {
    backgroundColor: Colors.RED,
    padding: 5,
    borderRadius: 7,
    marginTop: 5,
    marginRight: 10,
  },
  deleteButtonTxt: {
    color: Colors.WHITE,
    fontFamily: "outfit-medium",
    textAlign: "center",
  },
});
