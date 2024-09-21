import { View, Text, StyleSheet, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import UserItem from "../../components/Inbox/UserItem";

export default function Inbox() {
  const { user } = useUser();
  const [userList, setUserList] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    GetUserLists();
  }, [user]);

  // Get user list depending on current user email
  const GetUserLists = async () => {
    setLoader(true);
    setUserList([]);
    const q = query(
      collection(db, "Chat"),
      where("userIds", "array-contains", user.primaryEmailAddress.emailAddress)
    );

    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      setUserList((prevList) => [...prevList, doc.data()]);
    });
    setLoader(false);
  };

  // Filter the list of other user in one state
  const MapOtherUserList = () => {
    const list = [];
    userList.forEach((record) => {
      const otherUser = record.users?.filter(
        (user) => user?.email != user?.primaryEmailAddress?.emailAddress
      );

      const result = {
        docId: record.id,
        ...otherUser[0],
      };
      list.push(result);
    });
    console.log(list);
    return list;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.inboxHeader}>Inbox</Text>
      <FlatList
        data={MapOtherUserList()}
        onRefresh={GetUserLists}
        refreshing={loader}
        style={{
          marginTop: 20,
        }}
        renderItem={({ item, index }) => (
          <UserItem userInfo={item} key={index} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 5,
  },
  inboxHeader: {
    fontFamily: "outfit-medium",
    fontSize: 30,
  },
});
