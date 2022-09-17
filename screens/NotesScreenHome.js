import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    TextInput,
    
  } from "react-native";
  import React, { useEffect } from "react";
  import Animated, { FlipInYRight, FadeOutDown } from "react-native-reanimated"
  import { useDispatch, useSelector } from "react-redux";
  import { useNavigation } from "@react-navigation/native";
  import { API_STATUS, NOTES_SCREEN } from "../constants";
  import { fetchPosts } from "../features/notesSlice";



export default function NotesScreenHome() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  // state.notes refers to NotesSlice.js intial state
  // const initialState = {
    //posts: [],
    //status: API_STATUS.idle,
    //error: null,}
  const posts = useSelector((state) => state.notes.posts);
  const notesStatus = useSelector((state) => state.notes.status);
  const isLoading = notesStatus === API_STATUS.pending;
  
  // UseEffect Hook below
  useEffect(() => {
    if (notesStatus === API_STATUS.idle) {
      dispatch(fetchPosts());
    }
    // if idle = fetch posts if otherwise dispatch???  
    // Avoid multiple calls to database - for app optimisation/efficiency
  }, [notesStatus, dispatch]);


    function renderItem({ item }) {
      return (
        <Animated.View
          entering={FlipInYRight.delay(item.index * 200)}
          exiting={FadeOutDown.delay(item.index * 200)}
        >

        <TouchableOpacity 
        style={styles.noteCard} 
        onPress={() => navigation.navigate(NOTES_SCREEN.Details, item)}>
          <Text style={styles.noteCardTitle}>{item.title}</Text>
          <Text style={styles.noteCardBodyText}>
          KRW {item.content}
          </Text>
          <Text style={styles.noteCardBodyText}>
            SGD {item.content / 2}
          </Text>
        </TouchableOpacity>
        </Animated.View>
      
      );
    }


    // If isLoading = true
    // {isLoading && <ActivityIndicator />}
    // Will show <ActivityIndicator />}
    // otherwise it may show a <View/> an empty container
    // for optimisation?

    // If isLoading = false
    // {isLoading && <ActivityIndicator />}
    // Will show empty space ie nothing

    // {isLoading ? <ActivityIndicator/> : <View/>}
    // it works, but with extra code.


    return (
      <View style={styles.container}>

       <View style={styles.header} >
          <Image source={{uri: 'https://img.icons8.com/external-kiranshastry-gradient-kiranshastry/2x/external-checklist-airport-kiranshastry-gradient-kiranshastry.png'}}
          style={{width: 100, height: 100}} />

          <Text style={styles.logo}>Travel-List</Text>
      </View>

      <View style={styles.header} >
          <Text style={styles.rates}>Rate of Exchange: </Text>
          <Text style={styles.rates}>KRW  </Text>
          <TextInput style={{backgroundColor: "aquamarine", width: 50, borderWidth: 0.5, textAlign: 'center', borderRadius: 5,}}></TextInput>
          <Text style={styles.rates}> = SGD  </Text>          
          <TextInput style={{backgroundColor: "aquamarine", width: 50, borderWidth: 0.5, textAlign: 'center', borderRadius: 5,}}></TextInput>

       </View>
        
        {isLoading && <ActivityIndicator />}

    

    

        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(post) => post.id.toString()}
        />
  
        

        <View style={{ flex: 1 }} />
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(NOTES_SCREEN.Add)}
      >
          <Text style={styles.buttonText}>Add Item</Text>
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

    header: {
      flexDirection: 'row',
      paddingBottom: 30,
      marginBottom: 20,
    },

    rate: {
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

    noteCard: {
      borderColor: "gray",
      borderWidth: 1,
      padding: 15,
      borderRadius: 5,
      marginBottom: 15,
      flexDirection: 'row',
    },
    noteCardTitle: {
      fontSize: 13,
      fontWeight: "500",
      marginBottom: 7,
      flex: 1/3,
    },
    noteCardBodyText: {
      fontSize: 12,
      fontWeight: "300",
      flex: 1/3,
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