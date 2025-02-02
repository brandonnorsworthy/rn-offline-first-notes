import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import notesService from '../services/notesService';
import {Note} from '../services/models';
import NetInfo from '@react-native-community/netinfo';
import {useNetwork} from '../providers/NetworkProvider';

interface CurrentNote {
  title: string;
  content: string;
  id?: string;
}

export default function Index() {
  const [note, setNote] = useState<CurrentNote>({title: '', content: ''});
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<boolean>(false);
  const [error, setError] = useState('');

  const {isConnected} = useNetwork();

  useEffect(() => {
    function loadNotes() {
      const savedNotes = notesService.getNotes(false);
      if (!savedNotes) {
        return;
      }
      console.log(savedNotes);
      // setNotes(savedNotes);
    }

    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected) {
        console.log('Online - Syncing notes!');
        notesService.syncNotesToServer();
      } else {
        console.log('Offline - Working locally.');
      }
    });

    loadNotes();
    return () => unsubscribe();
  }, []);

  function createError(message: string) {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  }

  function validateNote() {
    if (!note.title.trim()) {
      return createError('Task title cannot be empty');
    }
    if (!note.content.trim()) {
      return createError('Task content cannot be empty');
    }

    return true;
  }

  const addNote = async () => {
    if (!validateNote()) {
      return;
    }

    const newNoteObj = await notesService.createNote(
      note.title,
      note.content,
      isConnected,
    );

    setNotes(prev => [...prev, newNoteObj]);
    setNote({title: '', content: ''});
    Keyboard.dismiss();
  };

  function saveEditedNote() {
    if (!validateNote()) {
      return;
    }

    notesService.updateNote(note.id!, note, isConnected);
    setNotes(prev => [...prev, {...note, id: note.id!, synced: false}]);
    setNote({title: '', content: ''});
    setEditingNote(false);
  }

  function editNote(eNote: Note) {
    setNote({title: eNote.title, content: eNote.content, id: eNote.id});
    setNotes(prev => prev.filter(n => n.id !== eNote.id));
    setEditingNote(true);
  }

  function deleteNote(id: string) {
    notesService.deleteNote(id, isConnected);
    setNotes(prev => prev.filter(n => n.id !== id));
  }

  function handleNoteTitleChange(newText: string) {
    setNote(prev => ({...prev, title: newText}));
  }

  function handleNoteContentChange(newText: string) {
    setNote(prev => ({...prev, content: newText}));
  }

  return (
    <SafeAreaView style={{margin: 16}}>
      {/* - Add */}
      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'center',
          width: '100%',
        }}>
        <View style={{flexDirection: 'column', height: 80}}>
          <TextInput
            style={{
              flex: 1,
              height: 40,
              backgroundColor: 'lightgray',
              fontWeight: 'bold',
              paddingHorizontal: 20,
              paddingVertical: 5,
              borderRadius: 5,
            }}
            placeholder="note title"
            value={note.title}
            onChangeText={newText => handleNoteTitleChange(newText)}
          />

          <TextInput
            style={{
              flex: 1,
              height: 40,
              backgroundColor: 'lightgray',
              fontWeight: 'bold',
              paddingHorizontal: 20,
              paddingVertical: 5,
              borderRadius: 5,
            }}
            placeholder="note content"
            value={note.content}
            onChangeText={newText => handleNoteContentChange(newText)}
          />
        </View>

        {editingNote ? (
          <Button title={'Save Note'} onPress={saveEditedNote} />
        ) : (
          <Button title={'Add Note'} onPress={addNote} />
        )}
      </View>

      {/* - Error */}
      {error ? (
        <Text style={{height: 20, color: 'red', textAlign: 'center'}}>
          {error}
        </Text>
      ) : (
        <View style={{height: 20}} />
      )}

      {notes.map(noteItem => (
        <View
          key={noteItem.id}
          style={{
            backgroundColor: 'lightgray',
            marginTop: 10,
            padding: 10,
            borderRadius: 15,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              textDecorationLine: 'none',
            }}>
            {noteItem.title}
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {/* - edit */}
            <Button
              title="Edit"
              color={'orange'}
              onPress={() => editNote(noteItem)}
            />

            {/* - delete */}
            <Button
              title="Delete"
              color={'red'}
              onPress={() => deleteNote(noteItem.id)}
            />
          </View>
        </View>
      ))}
    </SafeAreaView>
  );
}
