import React from "react";
import { SafeAreaView, Text, Image, StyleSheet } from "react-native";

export default function OfflineScreen() {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        resizeMode="contain"
        source={require("./assets/images/offline-illustration.jpg")}
        style={styles.vector}
      />
      <Text style={styles.textBold}>Network Issue</Text>
      <Text style={styles.text}>Please check your Internet connection.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  vector: {
    width: 300,
    height: 300,
  },
  textBold: {
    fontWeight: "bold",
    color: "#505050",
    fontSize: 18,
  },
  text: {
    paddingTop: 10,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 80,
  },
});
