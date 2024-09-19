import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { db } from "../../config/FirebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
} from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import { GiftedChat } from "react-native-gifted-chat";
import moment from "moment";

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    GetUserDetails();

    const unsubscribe = onSnapshot(
      collection(db, "Chat", params.id, "Messages"),
      (snapshort) => {
        const messageData = snapshort.docs.map((doc) => ({
          _id: doc.id,
          ...doc.data(),
        }));
        setMessages(messageData);
      }
    );
    return () => unsubscribe();
  }, []);

  const GetUserDetails = async () => {
    const docref = doc(db, "Chat", params.id);
    const docSnap = await getDoc(docref);

    const result = docSnap.data();
    console.log("Result", result);

    // current user [0] because it's an array and at index 0 current user is their in firebase
    const currentUser = result?.users[0];
    console.log("Current User: ", currentUser);

    // other user [1] because it's an array and at index 1 other user is their in firebase
    const otherUser = result?.users[1];
    console.log("Other User: ", otherUser);

    // set the header title to the other user's name
    navigation.setOptions({
      headerTitle: otherUser.name,
    });
  };

  const onSend = async (newMessages) => {
    setMessages((previousMessage) =>
      GiftedChat.append(previousMessage, newMessages)
    );
    newMessages[0].createdAt = moment().format("MM/DD/YYYY HH:mm:ss");
    // newMessages[0].createdAt = moment().format("LLL");
    // newMessages[0].createdAt = new Date();
    await addDoc(
      collection(db, "Chat", params?.id, "Messages"),
      newMessages[0]
    );
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      showUserAvatar={true}
      user={{
        _id: user.primaryEmailAddress.emailAddress,
        name: user.fullName,
        avatar: user.imageUrl,
      }}
    />
  );
}

const styles = StyleSheet.create({});
