import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API, API_CREATE, API_POSTS, API_STATUS } from "../constants";

//Slice - To breakup Reducer's Logic

const initialState = {
  posts: [],
  status: API_STATUS.idle,
  error: null,
};

export const fetchPosts = createAsyncThunk("notes/fetchPosts", async () => {
  const token = await AsyncStorage.getItem("token");
  const response = await axios.get(API + API_POSTS, {
    headers: { Authorization: `JWT ${token}` },
  });
  return response.data;
});

export const addNewPost = createAsyncThunk(
  "notes/addNewPost",
  async (newPost) => {
    const token = await AsyncStorage.getItem("token");
    const response = await axios.post(API + API_CREATE, newPost, {
      headers: { Authorization: `JWT ${token}` },
    });
    return response.data;
  }
);


const notesSlice = createSlice({
  name: "notes",
  initialState,
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = API_STATUS.pending;
        // pending means loading
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = API_STATUS.fulfilled;
        // Add any fetched posts to the array
        // API_STATUS - A structured way of calling data from an API
        // concat means replacing a new post in my array
        // action.payload refers to the response.data
        // example of response.data is {id : 1, title: "Hello", content: "World"}
        // fulfilled means "success" status
        state.posts = state.posts.concat(action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = API_STATUS.rejected;
        state.error = action.error.message;
        console.log("Failed to fetch posts. Error:", action.error.message);
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
        // can be any status eg pending, rejected, idle, fulfilled
        // action.payload is the response data above
      });
  },
});

//export const { noteAdded } = notesSlice.actions;

export default notesSlice.reducer;