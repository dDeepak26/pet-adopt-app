import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import Colors from "../../constants/Colors";
import { Picker } from "@react-native-picker/picker";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db, storage } from "../../config/FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useUser } from "@clerk/clerk-expo";

export default function AddNewPet() {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    category: "Dog",
    sex: "Male",
  });
  const [gender, setGender] = useState();
  const [category, setCategory] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [image, setImage] = useState();
  const [loader, setLoader] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add New Pet",
    });

    GetCategories();
  }, []);

  const GetCategories = async () => {
    setCategoryList([]);
    const snapshot = await getDocs(collection(db, "Category"));
    const categories = snapshot.docs.map((doc) => doc.data());
    // console.log(categories);
    setCategoryList(categories);
  };

  const imagePicker = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const handleInputChange = (fieldName, fieldValue) => {
    // console.log(fieldName, fieldValue);
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onSubmit = () => {
    if (Object.keys(formData).length != 8) {
      ToastAndroid.show("Please fill all the Details", ToastAndroid.SHORT);
      return;
    }
    uploadImage();
  };

  const uploadImage = async () => {
    setLoader(true);
    const res = await fetch(image);
    const blobImage = await res.blob();
    const storageRef = ref(storage, "/PetAdoptApp/" + Date.now() + ".jpg");

    uploadBytes(storageRef, blobImage)
      .then((snapshot) => {
        // console.log("Image Uploaded");
      })
      .then((res) => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          // console.log("Image Url", downloadUrl);
          saveFormData(downloadUrl);
        });
      });
  };

  const saveFormData = async (imageUrl) => {
    const docId = Date.now().toString();
    await setDoc(doc(db, "Pets", docId), {
      ...formData,
      imageUrl: imageUrl,
      userName: user?.fullName,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      userImage: user?.imageUrl,
      id: docId,
    });
    setLoader(false);
    router.replace("/(tabs)/home");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Add New Pet for Adoption</Text>
      {/* image picker container */}
      <Pressable onPress={imagePicker}>
        {!image ? (
          <Image
            source={require("./../../assets/images/placeHolder.jpg")}
            style={styles.image}
          />
        ) : (
          <Image source={{ uri: image }} style={styles.image} />
        )}
      </Pressable>
      {/*Input Container for Pet Name */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTextLabel}>Pet Name *</Text>
        <TextInput
          style={styles.inputText}
          onChangeText={(value) => handleInputChange("name", value)}
        />
      </View>
      {/* Input Picker Container for Pet Category */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTextLabel}>Category *</Text>
        <Picker
          selectedValue={selectedCategory}
          style={styles.inputText}
          onValueChange={(itemValue, itemIndex) => {
            setSelectedCategory(itemValue);
            handleInputChange("category", itemValue);
          }}
        >
          {categoryList.map((category, index) => (
            <Picker.Item
              key={index}
              label={category.name}
              value={category.name}
            />
          ))}
        </Picker>
      </View>
      {/*Input Container for Pet Breed */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTextLabel}>Breed *</Text>
        <TextInput
          style={styles.inputText}
          onChangeText={(value) => handleInputChange("breed", value)}
        />
      </View>
      {/*Input Container for Pet Age */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTextLabel}>Age *</Text>
        <TextInput
          style={styles.inputText}
          keyboardType="numeric"
          onChangeText={(value) => handleInputChange("age", value)}
        />
      </View>
      {/* Input Picker Container for Pet Gender */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTextLabel}>Gender *</Text>
        <Picker
          style={styles.inputText}
          selectedValue={gender}
          onValueChange={(itemValue, itemIndex) => {
            setGender(itemValue);
            handleInputChange("sex", itemValue);
          }}
        >
          <Picker.Item label="Male" value="male" />
          <Picker.Item label="Female" value="female" />
        </Picker>
      </View>

      {/*Input Container for Pet Weight */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTextLabel}>Weight *</Text>
        <TextInput
          style={styles.inputText}
          keyboardType="numeric"
          onChangeText={(value) => handleInputChange("weight", value)}
        />
      </View>
      {/*Input Container for Pet Address */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTextLabel}>Address *</Text>
        <TextInput
          style={styles.inputText}
          onChangeText={(value) => handleInputChange("address", value)}
        />
      </View>
      {/*Input Container for Pet About */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputTextLabel}>About *</Text>
        <TextInput
          style={styles.inputText}
          numberOfLines={5}
          multiline={true}
          onChangeText={(value) => handleInputChange("about", value)}
        />
      </View>
      {/* Submit Button */}
      <TouchableOpacity
        disabled={loader}
        style={styles.submitBtn}
        onPress={onSubmit}
      >
        {loader ? (
          <ActivityIndicator size={"large"} />
        ) : (
          <Text style={styles.submitText}>Submit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerTitle: {
    fontFamily: "outfit-medium",
    fontSize: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: Colors.GRAY,
  },
  inputContainer: {
    marginVertical: 5,
  },
  inputTextLabel: {
    marginVertical: 5,
    fontFamily: "outfit-regular",
  },
  inputText: {
    padding: 10,
    backgroundColor: Colors.WHITE,
    borderRadius: 7,
    // borderWidth: 1,
    // borderColor: Colors.GRAY,
    fontFamily: "outfit-regular",
  },
  submitBtn: {
    padding: 15,
    marginVertical: 10,
    marginBottom: 50,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 7,
  },
  submitText: {
    fontFamily: "outfit-medium",
    textAlign: "center",
  },
});
