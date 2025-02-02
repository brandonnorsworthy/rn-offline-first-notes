import Realm from 'realm';

const NoteSchema = {
  name: 'Note',
  properties: {
    _id: 'string',
    title: 'string',
    content: 'string',
    updatedAt: 'date',
  },
  primaryKey: '_id',
};

export default new Realm({schema: [NoteSchema]});