import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./../config/FirebaseConfig";

// Fetching favorites list
const GetFavList = async (user) => {
  try {
    // Ensure user's email is available
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      throw new Error("User email is not available");
    }

    const docRef = doc(db, "UserFavPet", userEmail);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // If the document doesn't exist, create it with an empty favorites array
      await setDoc(docRef, {
        email: userEmail,
        favorites: [],
      });
      return { favorites: [] }; // Return the newly created document with an empty favorites array
    }
  } catch (error) {
    console.error("Error fetching favorites list:", error);
    throw error; // Rethrow error to handle it higher up if needed
  }
};

// Updating the favorites list
const UpdateFav = async (user, favResult) => {
  try {
    // Ensure that favResult is an array
    if (!Array.isArray(favResult)) {
      throw new Error("favorites must be an array");
    }

    // Ensure user's email is available
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    if (!userEmail) {
      throw new Error("User email is not available");
    }

    const docRef = doc(db, "UserFavPet", userEmail);
    await updateDoc(docRef, {
      favorites: favResult,
    });
  } catch (error) {
    console.error("Error updating favorites:", error);
  }
};

export default {
  GetFavList,
  UpdateFav,
};
