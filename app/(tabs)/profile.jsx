import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Colors from "./../../constants/Colors";
import { useRouter } from "expo-router";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const Menu = [
    {
      id: 1,
      name: "Add New Pet",
      icon: "add-circle",
      path: "/add-new-pet",
    },
    {
      id: 2,
      name: "My Post",
      icon: "bookmark",
      path: "/user-post",
    },
    {
      id: 3,
      name: "Favorites",
      icon: "heart",
      path: "/(tabs)/favorite",
    },
    {
      id: 4,
      name: "Inbox",
      icon: "chatbubble",
      path: "/(tabs)/inbox",
    },
    {
      id: 5,
      name: "Logout",
      icon: "exit",
      path: "logout",
    },
  ];

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      // Redirect to login screen immediately after successful sign out
      router.replace("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert(
        "Sign Out Error",
        "An error occurred while signing out. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onPressMenu = (item) => {
    if (item.path === "logout") {
      Alert.alert("Confirm Logout", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: handleSignOut },
      ]);
    } else {
      router.push(item.path);
    }
  };

  // If user is null or undefined, show a loading state or redirect
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.profileHeader}>Profile</Text>
        <View style={styles.userContainer}>
          <Image source={{ uri: user?.imageUrl }} style={styles.userImage} />
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userEmail}>
            {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>
        <FlatList
          data={Menu}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onPressMenu(item)}
              style={styles.navBar}
              disabled={isLoading}
            >
              <Ionicons
                name={item.icon}
                size={30}
                color={Colors.PRIMARY}
                style={styles.iconStyle}
              />
              <Text style={styles.navBarText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    padding: 20,
    marginTop: 20,
  },
  profileHeader: {
    fontFamily: "outfit-medium",
    fontSize: 30,
  },
  userContainer: {
    display: "flex",
    alignItems: "center",
    marginVertical: 25,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 99,
  },
  userName: {
    fontFamily: "outfit-bold",
    fontSize: 20,
    marginTop: 6,
  },
  userEmail: {
    fontFamily: "outfit-regular",
    fontSize: 16,
    color: Colors.GRAY,
  },
  navBar: {
    marginVertical: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.WHITE,
    padding: 10,
    borderRadius: 10,
  },
  iconStyle: {
    padding: 10,
    backgroundColor: Colors.LIGHT_PRIMARY,
    borderRadius: 10,
  },
  navBarText: {
    fontFamily: "outfit-regular",
    fontSize: 20,
  },
});
