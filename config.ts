// Configuration for CONDOT Web App
// Instructions: Rename this file or modify values directly to change environments.

export const CONFIG = {
  // App Metadata
  APP_NAME: "CONDOT",
  APP_VERSION: "1.0.0",

  // Firebase Configuration
  // Replace these values with your Firebase Project Settings
  FIREBASE: {
    apiKey: "AIzaSyD_pvRcJqKJDZORVZXZxGMeUh5nm9WsGqg",
    authDomain: "condot-54aa7.firebaseapp.com",
    projectId: "condot-54aa7",
    storageBucket: "condot-54aa7.firebasestorage.app",
    messagingSenderId: "676984883944",
    appId: "1:676984883944:web:2daa45a76f827c129a575d",
    measurementId: "G-KLEE3RTDSX"
  },

  // Firestore Paths
  FIRESTORE: {
    ROOT_COLLECTION: "artifacts",
    APP_ID: "condot-web"
  },

  // Feature Flags
  FEATURES: {
    ENABLE_ATTACHMENTS: true,
    ENABLE_RAG: true,
    ENABLE_TIMELINE_V2: true
  }
};