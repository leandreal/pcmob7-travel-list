import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { API_STATUS } from "../constants";
import { db } from "../firebase";

//Slice - To breakup Reducer's Logic

const initialState = {
  posts: [],
  status: API_STATUS.idle,
  error: null,
};

export const fetchPosts = createAsyncThunk("notes/fetchPosts", async () => {
  const querySnapshot = await getDocs(collection(db, "notes"));
  const notes = querySnapshot.docs.map((doc, index) => {
    // doc.data() = {title: 'shoes', content:'100KRW' }
    return { id: doc.id, ...doc.data(), index };
  });
  return notes;
});

export const addNewPost = createAsyncThunk(
  "notes/addNewPost",
  async (newPost) => {
    await setDoc(doc(db, "notes", newPost.id), newPost);
    return newPost;
  }
);

export const updatePostThunk = createAsyncThunk(
  "posts/updatePost",
  async (updatedPost) => {
    await updateDoc(doc(db, "notes", updatedPost.id), updatedPost);
    return updatedPost;
  }
);


export const deletePostThunk = createAsyncThunk(
  "posts/deletePost",
  async (id) => {
    await deleteDoc(doc(db, "notes", id));
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

      //.addCase(updatePostThunk.fulfilled, (state, action) => {
        // const { id, title, content } = action.payload;
        // destructure the payload above.
        // const id = action.payload.id
        // const title = action.payload.title
        // const content = action.payload.content
        //  We are creating constants above.


        //const existingPost = state.posts.find((post) => post.id === id);
        // update existing post above. === must be equal to 
        //if (existingPost) {
          //existingPost.title = title;
          //existingPost.content = content;
          // if there is existing post, it will be overridden with the update.
       // }
      //})

      .addCase(updatePostThunk.fulfilled, (state, action) => {
        const { id } = action.payload;
        const posts = state.posts;
        const post = posts.find((post) => post.id === id);
        const postIndex = posts.indexOf(post);
        if (~postIndex) posts[postIndex] = action.payload;
      })


      .addCase(deletePostThunk.fulfilled, (state, action) => {
        const id = action.payload;
        const updatedPosts = state.posts.filter((item) => item.id !== id);
        // filter removes anything that does not equal to our id.  
        // filter shows only those that equate to the id.

        state.posts = updatedPosts;
      });
  },
});



//export const { noteAdded } = notesSlice.actions;

export default notesSlice.reducer;

//notesSlice consists of all the logic of the app.