import React, { useEffect, useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { db } from "../../config/FirebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";
import { GiftedChat } from "react-native-gifted-chat";

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);

  const parseCreatedAt = (createdAt) => {
    if (!createdAt) return new Date();
    if (createdAt instanceof Date) return createdAt;
    if (typeof createdAt === "object" && createdAt.toDate)
      return createdAt.toDate();
    if (typeof createdAt === "string") return new Date(createdAt);
    if (typeof createdAt === "number") return new Date(createdAt);
    return new Date();
  };

  useEffect(() => {
    getUserDetails();

    const q = query(
      collection(db, "Chat", params.id, "Messages"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          ...data,
          createdAt: parseCreatedAt(data.createdAt),
        };
      });
      setMessages(messageData);
    });

    return () => unsubscribe();
  }, [params.id]);

  const getUserDetails = useCallback(async () => {
    const docRef = doc(db, "Chat", params.id);
    const docSnap = await getDoc(docRef);

    const result = docSnap.data();

    if (result && result.users) {
      const currentUser = result.users[0];
      const otherUser = result.users[1];

      navigation.setOptions({
        headerTitle: otherUser?.name,
      });
    }
  }, [params.id, navigation]);

  const onSend = useCallback(
    async (newMessages = []) => {
      const updatedMessages = newMessages.map((message) => ({
        ...message,
        createdAt: serverTimestamp(),
        user: {
          _id: user.primaryEmailAddress.emailAddress,
          name: user.fullName,
          avatar: user.imageUrl,
        },
      }));

      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, updatedMessages)
      );

      try {
        await addDoc(
          collection(db, "Chat", params.id, "Messages"),
          updatedMessages[0]
        );
      } catch (error) {
        console.error("Error adding message to Firestore:", error);
      }
    },
    [params.id, user]
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={onSend}
      user={{
        _id: user.primaryEmailAddress.emailAddress,
        name: user.fullName,
        avatar: user.imageUrl,
      }}
      renderUsernameOnMessage
      showAvatarForEveryMessage
    />
  );
}

const styles = StyleSheet.create({});
