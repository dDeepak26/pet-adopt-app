import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import PetInfo from "../../components/PetDetails/PetInfo";
import PetSubInfo from "../../components/PetDetails/PetSubInfo";
import AboutPet from "../../components/PetDetails/AboutPet";
import OwnerInfo from "../../components/PetDetails/OwnerInfo";
import Colors from "../../constants/Colors";

export default function PetDetails() {
  const pet = useLocalSearchParams();
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTransparent: true,
      headerTitle: "",
    });
  }, []);
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
        <TouchableOpacity style={styles.adoptBtn}>
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
