import { View, Text, ScrollView } from "react-native";
import React from "react";
import Header from "../../components/Home/Header";
import Slider from "../../components/Home/Slider";
import PetListByCategory from "../../components/Home/PetListByCategory";

export default function Home() {
  return (
    <ScrollView
      style={{
        padding: 20,
        marginTop: 20,
      }}
    >
      {/* Header */}
      <Header />

      {/* Slider */}
      <Slider />

      {/* PetList + Category */}
      <PetListByCategory />

      {/* Add New Pet OPtion */}
    </ScrollView>
  );
}
