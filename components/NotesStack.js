import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { CAMERA_SCREEN, NOTES_SCREEN } from "../constants";
import NotesScreenAdd from "../screens/NotesScreenAdd";
import NotesScreenHome from "../screens/NotesScreenHome";
import NotesScreenDetails from "../screens/NotesScreenDetails";
import CameraScreen from "../screens/CameraScreen";

const NotesStackNav = createStackNavigator();

export default function NotesStack() {
  return (
    <NotesStackNav.Navigator>
      <NotesStackNav.Screen
        name={NOTES_SCREEN.Home}
        component={NotesScreenHome}
        options={{ headerShown: false }}
      />
      <NotesStackNav.Screen
        name={NOTES_SCREEN.Add}
        component={NotesScreenAdd}
        options={{ headerShown: false }}
      />
      <NotesStackNav.Screen
        name={NOTES_SCREEN.Details}
        component={NotesScreenDetails}
        options={{ headerShown: false }}
      />
      <NotesStackNav.Screen
        name={CAMERA_SCREEN}
        component={CameraScreen}
        options={{ headerShown: false }}
      />
    </NotesStackNav.Navigator>
  );
}