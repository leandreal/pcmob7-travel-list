import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AUTH_SCREEN, API, API_WHOAMI, CAMERA_SCREEN } from "../constants";
import axios from "axios";

const imgPlaceholder = "https://picsum.photos/200";


export default function ProfileScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("loading...");
  const [photoUri, setPhotoUri] = useState(null);


  async function loadPhoto() {
    const photo = await AsyncStorage.getItem("photo_uri");
    setPhotoUri(photo);
  }

  async function loadUsername() {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await axios.get(API + API_WHOAMI, {
        headers: { Authorization: `JWT ${token}` },
      });
      setUsername(response.data.username);
    } catch (error) {
      console.log(error.response.data);
    }
  }

  useEffect(() => {
    const removeListener = navigation.addListener("focus", () => {
      loadUsername();
      loadPhoto();
    });

      loadUsername();
      loadPhoto();
    return () => {
      removeListener();
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header} >
          <Image source={{uri: 'https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/2x/external-checklist-airport-kiranshastry-gradient-kiranshastry.png'}}
          style={{width: 100, height: 100}} />

          <Text style={styles.logo}>Travel-List</Text>
      </View>

      <View>
        <Text style={styles.title}>Your Profile</Text>
        <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 10, textAlign: "center", color: "cadetblue" }}>
          your user name: {username}
      </Text>
      </View>
      
      <Image
        source={{ uri: photoUri ?? imgPlaceholder }}
        style={{ height: 100, width: 100, borderRadius: 100, marginVertical: 20, alignSelf: "center" }}
        />


      <TouchableOpacity
        style={styles.outlinedButton}
        onPress={() => navigation.navigate(CAMERA_SCREEN)}
      >
        <Text style={styles.outlinedButtonText}>Upload Photo</Text>
      </TouchableOpacity>
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          AsyncStorage.removeItem("token");
          setUsername("loading...");
          navigation.navigate(AUTH_SCREEN);
        }}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 100,
    padding: 25,
  },

  title: {
    fontWeight: "bold",
    fontSize: 40,
    marginBottom: 20,
    textAlign: "center",
    color: "darkturquoise",
  },

  header: {
    flexDirection: 'row',
    paddingBottom: 30,
    marginBottom: 20,
  },

  
  logo: {
    fontWeight: "bold",
    fontSize: 40,
    margin: 20,
    color: 'turquoise',
  },
  outlinedButton: {
    borderRadius: 3,
    borderWidth: 1,
    width: 120,
    alignSelf: "center",
  },
  outlinedButtonText: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 12,
    padding: 15,
    color: "black",
  },
  button: {
    backgroundColor: "turquoise",
    borderRadius: 15,
    width: "50%",
    alignSelf: 'center',
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "400",
    fontSize: 17,
    padding: 20,
    color: "black",
  },
});
