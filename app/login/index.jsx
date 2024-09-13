import React, { useCallback } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import Colors from "./../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({
          redirectUrl: Linking.createURL("/(tabs)/home", { scheme: "myapp" }),
        });

      if (createdSessionId) {
        // Handle session creation
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          source={require("./../../assets/images/login.png")}
          style={styles.image}
        />
        <View style={styles.content}>
          <Text style={styles.title}>Ready to make a new friend?</Text>
          <Text style={styles.subtitle}>
            Let's adopt the pet which you like and make there life happy again
          </Text>

          <Pressable onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    height: "100%",
  },
  image: {
    width: "100%",
    height: 500,
  },
  content: {
    padding: 20,
    display: "flex",
    alignItems: "center",
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 30,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "outfit-regular",
    fontSize: 18,
    textAlign: "center",
    color: Colors.GRAY,
  },
  button: {
    padding: 14,
    marginTop: 100,
    backgroundColor: Colors.PRIMARY,
    width: "100%",
    borderRadius: 14,
  },
  buttonText: {
    fontFamily: "outfit-medium",
    textAlign: "center",
  },
});
