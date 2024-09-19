import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";
import AboutPet from "../../components/PetDetails/AboutPet";
import OwnerInfo from "../../components/PetDetails/OwnerInfo";
import Colors from "../../constants/Colors";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/FirebaseConfig";

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
    // console.log("Pet details", pet);
  }, []);

  // Used to initiate chat between two user
  const initiateChat = async () => {
    const docId1 =
      user?.primaryEmailAddress?.emailAddress + "_" + pet?.userEmail;
    const docId2 =
      pet?.userEmail + "_" + user?.primaryEmailAddress?.emailAddress;
    // console.log("docIds", docId1, docId2);

    const q = query(
      collection(db, "Chat"),
      where("id", "in", [docId1, docId2])
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log("Document data:", doc.data());
      router.push({
        pathname: "/chat",
        params: { id: doc.id },
      });
    });
    if (querySnapshot.docs?.length == 0) {
      await setDoc(doc(db, "Chat", docId1), {
        id: docId1,
        users: [
          {
            email: user?.primaryEmailAddress?.emailAddress,
            image: user?.imageUrl,
            name: user?.fullName,
          },
          {
            email: pet?.userEmail,
            image: pet?.userImage,
            name: pet?.userName,
          },
        ],
      });
      router.push({
        pathname: "/chat",
        params: { id: docId1 },
      });
    }
  };

  return (
    <View>
      <ScrollView>
        {/* Pet info */}
        <PetInfo pet={pet} />
        {/* Pet SubInfo  */}
        <PetSubInfo pet={pet} />
        {/* about  */}
        <AboutPet pet={pet} />
        {/* owner detail  */}
        <OwnerInfo pet={pet} />
      </ScrollView>
      {/* Adopt me Button  */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={initiateChat} style={styles.adoptBtn}>
          <Text style={styles.adoptTxt}>Adopt Me</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    position: "absolute",
    width: "100%",
    bottom: 0,
  },
  adoptBtn: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
  },
  adoptTxt: {
    fontFamily: "outfit-medium",
    fontSize: 20,
    textAlign: "center",
  },
});
