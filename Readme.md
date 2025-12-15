# Configuration Guide

To change the connected cloud, database information, and API addresses, please follow these steps:

1.  **Open `config.ts`**:
    Navigate to the root directory and open the `config.ts` file.

2.  **Update Firebase Config**:
    Locate the `FIREBASE` object within the `CONFIG` constant.
    Replace the values for `apiKey`, `authDomain`, `projectId`, etc., with your new Firebase project credentials found in the Firebase Console (Project Settings > General).

    ```typescript
    FIREBASE: {
      apiKey: "YOUR_NEW_API_KEY",
      authDomain: "your-project.firebaseapp.com",
      // ... other fields
    }
    ```

3.  **Update Database Paths**:
    If you wish to change the root collection for Firestore, modify the `FIRESTORE` object.

    ```typescript
    FIRESTORE: {
      ROOT_COLLECTION: "new-artifacts-root", // Change this
      APP_ID: "new-app-id"
    }
    ```

4.  **Save**:
    Save the `config.ts` file. The application will automatically reload with the new configuration settings.

This method allows for centralized management of environment-specific variables without needing complex build tools in the current environment.