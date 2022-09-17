import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useRef, useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  
} from "react-native";
import { useDispatch } from "react-redux";
import { deletePostThunk, updatePostThunk } from "../features/notesSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CAMERA_SCREEN } from "../constants";

export default function NotesScreenDetails() {
  const route = useRoute();
  // useRoute is like useState but doesnt update the variable itself
  const titleInputRef = useRef();
  const navigation = useNavigation();
  const params = route.params;
  const [noteTitle, setNoteTitle] = useState(params.title);
  const [noteBody, setNoteBody] = useState(params.content);
 
  const [editable, setEditable] = useState(false);
  const [image, setImage] = useState("../assets/placeholder.jpeg");
  const dispatch = useDispatch();
  const id = params.id;

  //console.log(route.params);

  async function updatePost(id) {
    try {
      const updatedPost = {
        id,
        title: noteTitle,
        content: noteBody,
      
      };
      console.log(updatedPost)
      await dispatch(updatePostThunk(updatedPost));
    } catch (error) {
      console.error("Failed to update the post: ", error);
    } finally {
      navigation.goBack();
    }
  }

  async function deletePost(id) {
    try {
      await dispatch(deletePostThunk(id));
    } catch (error) {
      console.error("Failed to update the post: ", error);
    } finally {
      navigation.goBack();
    }
  }

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

  //KB Avoiding View - moves keyboard to the top???

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >


      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name={"arrow-left"} size={24} color={"black"} />
        </TouchableOpacity>

      
        <View style={{ flex: 1 }} />

        <TouchableOpacity
          onPress={() => {
            setEditable(!editable);
            if (!editable) {
              setTimeout(() => titleInputRef.current.focus(), 100);
            } else {
              setTimeout(() => titleInputRef.current.blur(), 100);
            }
            //need to wait cos editable for a while 100ms is 0.1 secs.
          }}
        >
          <FontAwesome
            name={"pencil"}
            size={24}
            color={editable ? "forestgreen" : "black"}
            // if screen can edit - it will be green.   if not, it will be black.
          />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => deletePost(id)} 
          style={{ marginLeft: 15 }}>
          
          
          <FontAwesome name={"trash"} size={24} color={"black"} />
        </TouchableOpacity>
      </View>


      <Image
        source={{ uri: image }} 
        style={{ height: 150, width: 150, borderRadius: 150, marginTop: 30, marginBottom: 30, alignSelf: "center", }}
        />

      <TouchableOpacity onPress={() => navigation.navigate(CAMERA_SCREEN, {fromDetails: true})} style={{ alignSelf: "center" }}>
        <FontAwesome name={"camera"} size={24} color={"black"}/>
      </TouchableOpacity>

      <Text style={{ textAlign: "center", marginTop: 10, marginBottom: 30, }} >Upload Receipt Here</Text>


      <TextInput
        style={styles.noteTitle}
        placeholder={"Enter Expense Details Here"}
        value={noteTitle}
        onChangeText={(text) => setNoteTitle(text)}
        selectionColor={"gray"}
        editable={editable}
        ref={titleInputRef}
        
      />
      <TextInput
        style={styles.noteBody}
        placeholder={"Enter Expense Amount Here"}
        value={noteBody}
        onChangeText={(text) => setNoteBody(text)}
        selectionColor={"gray"}
        editable={editable}
        
      />
      
      <View style={{ flex: 1 }} />
      <TouchableOpacity 
        style={styles.button} 
        onPress={async () => updatePost(id)}>

        <Text style={styles.buttonText}>Save</Text>
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
    marginTop: 30,
    marginBottom: 25,
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