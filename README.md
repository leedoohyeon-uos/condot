
# CONDOT: AI-Powered Career Archive Platform

CONDOT is an AI-driven career management service that helps users structure, organize, and utilize their career experiences. By simply inputting raw text, the system automatically analyzes and archives experiences into structured data, which is then used for resume generation and career path predictions.

## System Architecture & Data Flow

The system operates through a four-stage pipeline: **Collection → Processing → AI Modeling → Service Output**.

### 1. Data Collection (User Input)
*   **Interaction:** Users enter career experiences via a natural language chat interface.
*   **Attachments:** Support for uploading evidence files (PPT, PDF) related to experiences.
*   **Storage:** Data is stored in **Firebase Firestore**, a scalable NoSQL database, structured by user ID and collections (Experiences, Applications, References).

### 2. Data Processing (Structuring)
*   **Parsing:** Raw text is analyzed to extract key metadata: `Title`, `Date Range`, `Category` (e.g., Competition, Internship), and `Keywords`.
*   **Content Structuring:** The system breaks down the narrative into the STAR method components:
    *   **S/T (Situation/Task):** Overview & Role
    *   **A (Action):** Skills Used
    *   **R (Result):** Outcomes & Learned Lessons
*   **Indexing:** Keywords and summaries are indexed to facilitate retrieval for RAG (Retrieval-Augmented Generation) tasks.

### 3. Model Utilization (Google Gemini API)
The core intelligence is powered by **Google Gemini 2.5 Flash**.

*   **Experience Analysis Agent:** Converts unstructured chat input into the standard JSON `Experience` schema.
*   **RAG Engine (Cover Letter Assistant):**
    *   Retrieves relevant user experiences based on the target job description.
    *   Retrieves successful reference materials (if available) as style guides.
    *   Generates a tailored cover letter (Personal Statement).
*   **Career Consultant Agent:**
    *   **Prediction:** Analyzes the user's entire portfolio to predict suitable job roles with compatibility scores.
    *   **Gap Analysis:** Compares the user's current profile against industry standards for a target role to identify missing skills and suggest an action plan.

### 4. Service Output (User Experience)
*   **Archive View:** Visualized 'Experience Cards' categorized by folders (Competition, Project, etc.).
*   **Timeline View:** A vertical, chronological visualization of the career path.
*   **Application Management:** Managing job applications and generated cover letters.
*   **Insight Dashboard:** Career roadmap and skill gap analysis results.

---

## Tech Stack

*   **Frontend:** React 19, TypeScript, Tailwind CSS
*   **AI:** Google Gemini API (`gemini-2.5-flash`)
*   **Backend / DB:** Firebase Authentication, Firestore
*   **Icons:** Lucide React

---

## Configuration Guide

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
