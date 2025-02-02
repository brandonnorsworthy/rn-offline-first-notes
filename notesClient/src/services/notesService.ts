import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import realm from '../database/realm';
import {Note} from './models';
import axios from 'axios';
import { UpdateMode } from 'realm';

const BASE_API_URL = 'http://localhost:3000';

interface UpdatedFields {
  title?: string;
  content?: string;
  completed?: boolean;
}

const markNoteAsSynced = (id: string) => {
  realm.write(() => {
    const note = realm.objectForPrimaryKey<Note>('Note', id);
    if (note) {
      (note as any).synced = true;
    }
  });
};

const createNote = async (
  title: string,
  content: string,
  isConnected: boolean,
): Promise<Note> => {
  const noteId = uuidv4();
  const noteDate = new Date();
  let synced = false;

  if (isConnected) {
    try {
      await axios.post(`${BASE_API_URL}/notes`, {
        id: noteId,
        title,
        content,
        updatedAt: noteDate,
      });
      markNoteAsSynced(noteId);
      synced = true;
    } catch (error) {
      console.log('Error syncing note:', error);
    }
  }

  // Save note locally in Realm
  realm.write(() => {
    realm.create('Note', {
      _id: noteId,
      title,
      content,
      updatedAt: noteDate,
      synced,
    });
  });

  return {
    id: noteId,
    title,
    content,
    updatedAt: noteDate,
    synced,
  };
};

const getNotes = async (isConnected: boolean): Promise<Note[]> => {
  if (isConnected) {
    try {
      const response = await axios.get(`${BASE_API_URL}/notes`);
      const notes = response.data;

      // Update local Realm database with fetched notes
      realm.write(() => {
        notes.forEach((note: Note) => {
          realm.create('Note', note, UpdateMode.Modified);
        });
      });

      return notes;
    } catch (error) {
      console.log('Error fetching notes:', error);
    }
  }

  return realm
    .objects<Note>('Note')
    .sorted('updatedAt', true)
    .toJSON() as Note[];
};

const updateNote = async (
  id: string,
  updatedFields: UpdatedFields,
  isConnected: boolean,
): Promise<void> => {
  realm.write(() => {
    let note = realm.objectForPrimaryKey<Note>('Note', id);
    if (note) {
      Object.keys(updatedFields).forEach(key => {
        (note as any)[key] = updatedFields[key as keyof UpdatedFields];
      });
      note.updatedAt = new Date();
      note.synced = false; // Mark note as not synced
    }
  });

  if (isConnected) {
    try {
      await axios.put(`${BASE_API_URL}/notes/${id}`, updatedFields);
      markNoteAsSynced(id);
    } catch (error) {
      console.log('Error syncing updated note:', error);
    }
  }
};

const deleteNote = async (id: string, isConnected: boolean): Promise<void> => {
  realm.write(() => {
    let note = realm.objectForPrimaryKey<Note>('Note', id);
    if (note) {
      realm.delete(note);
    }
  });

  if (isConnected) {
    try {
      await axios.delete(`${BASE_API_URL}/notes/${id}`);
    } catch (error) {
      console.log('Error deleting note from server:', error);
    }
  }
};

const syncNotesToServer = async () => {
  const unsyncedNotes = realm.objects<Note>('Note').filtered('synced == false');

  for (const note of unsyncedNotes) {
    try {
      await axios.post(`${BASE_API_URL}/notes`, {
        id: note.id,
        title: note.title,
        content: note.content,
        updatedAt: note.updatedAt,
      });
      markNoteAsSynced(note.id);
    } catch (error) {
      console.log('Error syncing note:', error);
    }
  }
};

export default {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
  syncNotesToServer,
};
