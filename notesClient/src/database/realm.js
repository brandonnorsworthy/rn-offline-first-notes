import Realm from 'realm';

const NoteSchema = {
  name: 'Note',
  properties: {
    _id: 'string',
    title: 'string',
    content: 'string',
    updatedAt: 'date',
    synced: { type: 'bool', default: false },
  },
  primaryKey: '_id',
};

export default new Realm({schema: [NoteSchema]});