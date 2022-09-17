import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { nanoid } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { addNewPost } from "../features/notesSlice";
import { CAMERA_SCREEN } from "../constants";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function NotesScreenAdd() {
  const navigation = useNavigation();
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [image, setImage] = useState("../assets/placeholder.jpeg");
  const dispatch = useDispatch();
  //useDispatch hook above

  async function loadImage() {
    const photo = await AsyncStorage.getItem("photo_uri");
    setImage(photo)
  }
  useEffect(() => {
    const removeListener = navigation.addListener("focus", () => {
  
      loadImage();
    });


      loadImage();
    return () => {
      removeListener();
    };
  }, []);
  
  // if every is a truthy value - truthy/falsey value - boolean
  const canSave = [noteTitle, noteBody].every(Boolean);

  async function savePost() {
    if (canSave) {
      try {
        const post = {
          id: nanoid(),
          // nanoid is a function that gives us a random id.
          title: noteTitle,
          content: noteBody,
        };
        await dispatch(addNewPost(post));
      } catch (error) {
        console.error("Failed to save the post: ", error);
      } finally {
        navigation.goBack();
      }
      // finally means go back to Home Page 
    }
  }


  return (
     <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <FontAwesome name={"arrow-left"} size={24} color={"black"} />
      </TouchableOpacity>

      

      <Image
        source={{ uri: image }} 
        style={{ height: 150, width: 150, borderRadius: 150, marginTop: 30, marginBottom: 30, alignSelf: "center", }}
        />

      <TouchableOpacity onPress={() => navigation.navigate(CAMERA_SCREEN, {fromNotes: true})} style={{ alignSelf: "center" }}>
        <FontAwesome name={"camera"} size={24} color={"black"}/>
      </TouchableOpacity>

      <Text style={{ textAlign: "center", marginTop: 10, marginBottom: 30, }} >Upload Receipt Here</Text>

      <TextInput
        style={styles.noteTitle}
        placeholder={"Add Item Here"}
        value={noteTitle}
        onChangeText={(text) => setNoteTitle(text)}
        selectionColor={"gray"}
      />
      <TextInput
        style={styles.noteBody}
        placeholder={"Enter Amount Here"}
        value={noteBody}
        onChangeText={(text) => setNoteBody(text)}
        selectionColor={"gray"}
        multiline={true}
      />
      <View style={{ flex: 1 }} />
      <TouchableOpacity 
        style={styles.button} 
        onPress={async () => await savePost()}>
        <Text style={styles.buttonText}>Update List</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    padding: 25,
  },
  noteTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginTop: 30,
    marginBottom: 25,
  },
  noteBody: {
    fontSize: 15,
    fontWeight: "400",
  },
  button: {
    backgroundColor: "turquoise",
    borderRadius: 15,
    width: "50%",
    marginBottom: 20,
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