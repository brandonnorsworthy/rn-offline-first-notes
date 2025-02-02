import realm from "../database/realm";
import { v4 as uuidv4 } from "uuid";

export const createNote = (title, content) => {
  realm.write(() => {
    realm.create("Note", {
      _id: uuidv4(),
      title,
      content,
      updatedAt: new Date(),
    });
  });
};

export const getNotes = () => {
  return realm.objects("Note").sorted("updatedAt", true);
};

export const updateNote = (id, updatedFields) => {
  realm.write(() => {
    let note = realm.objectForPrimaryKey("Note", id);
    if (note) {
      Object.keys(updatedFields).forEach((key) => {
        note[key] = updatedFields[key];
      });
      note.updatedAt = new Date();
    }
  });
};

export const deleteNote = (id) => {
  realm.write(() => {
    let note = realm.objectForPrimaryKey("Note", id);
    if (note) {
      realm.delete(note);
    }
  });
};
