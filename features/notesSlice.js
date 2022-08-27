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

export const updatePostThunk = createAsyncThunk(
  "posts/updatePost",
  async (updatedPost) => {
    // (updatedPost) is the action.payload here
    const token = await AsyncStorage.getItem("token");
    const response = await axios.put(
      API + API_POSTS + "/" + updatedPost.id,
      updatedPost,
      {
        headers: { Authorization: `JWT ${token}` },
      }
    );
    return response.data;
  }
);

export const deletePostThunk = createAsyncThunk(
  "posts/deletePost",
  async (id) => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(API + API_POSTS + `/${id}`, {
      headers: { Authorization: `JWT ${token}` },
    });
    return id;
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
      })

      .addCase(updatePostThunk.fulfilled, (state, action) => {
        const { id, title, content } = action.payload;
        // destructure the payload above.
        // const id = action.payload.id
        // const title = action.payload.title
        // const content = action.payload.content
        //  We are creating constants above.


        const existingPost = state.posts.find((post) => post.id === id);
        // update existing post above. === must be equal to 
        if (existingPost) {
          existingPost.title = title;
          existingPost.content = content;
          // if there is existing post, it will be overridden with the update.
        }
      })

      .addCase(deletePostThunk.fulfilled, (state, action) => {
        const id = action.payload;
        const updatedPosts = state.posts.filter((item) => item.id !== id);
        state.posts = updatedPosts;
      });
  },
});



//export const { noteAdded } = notesSlice.actions;

export default notesSlice.reducer;

//notesSlice consists of all the logic of the app.