// Configuration for CONDOT Web App
// Instructions: Rename this file or modify values directly to change environments.

export const CONFIG = {
  // App Metadata
  APP_NAME: "CONDOT",
  APP_VERSION: "1.0.0",

  // Firebase Configuration
  // Replace these values with your Firebase Project Settings
  FIREBASE: {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  },

  // Firestore Paths
  FIRESTORE: {
    ROOT_COLLECTION: "",
    APP_ID: ""
  },

  // Feature Flags
  FEATURES: {
    ENABLE_ATTACHMENTS: true,
    ENABLE_RAG: true,
    ENABLE_TIMELINE_V2: true
  }

};
