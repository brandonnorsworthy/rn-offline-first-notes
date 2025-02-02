# Offline-First Notes App with Sync

## Requirements
- Create, edit, and delete notes (title + text content).
- App works offline; notes are stored locally and sync to the server when online.
- Handle basic conflict resolution if the same note is edited on multiple devices.

# Things to Use
- Local Database like Realm or WatermelonDB.
- React Native CLI to see how database libraries integrate with native code.
- Minimal backend (Node/Express or any RESTful API) to store and fetch notes.
- Possibly Redux Toolkit or React Query to handle online/offline state, though not mandatory.

# Acceptance Criteria
- Local Persistence: Notes remain available after app restarts or when offline.
- Sync: When reconnected to the internet, local changes are pushed to the server.
- Conflict Handling: If a note is updated in two places, the app merges or shows a conflict resolution flow (at least detect and alert the user).

## Get started

install packages on server and client folder
```bash
cd notesClient && npm install
cd ../notesServer && npm install
```

### Run the server
Server has included readme file with API documentation

```bash
cd notesServer && npm start
```

### Run the client
```bash
cd notesClient && npm run android
```

## Image