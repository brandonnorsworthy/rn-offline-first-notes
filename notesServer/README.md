# Notes Server

## Description

This is a simple notes server that allows you to create, read, update, and delete notes. It uses a SQLite database to store the notes.

## Running

```
npm install
npm start
```

## Endpoint Examples

### Create a New Note (POST /notes)

#### Request:

`POST /notes`

```json
{
  "title": "First Note",
  "content": "This is the content of the first note.",
  "updatedAt": "2024-02-02T12:00:00Z"  // Optional: Defaults to current time if omitted
}
```

#### Response (201 Created):

```json
{
  "id": "c1d2a3f4-5b6e-7890-1234-56789abcdef0",
  "title": "First Note",
  "content": "This is the content of the first note.",
  "updatedAt": "2024-02-02T12:00:00Z"
}
```

### Get All Notes (GET /notes)

#### Request:

`GET /notes`

#### Response:

```json
[
  {
    "id": "c1d2a3f4-5b6e-7890-1234-56789abcdef0",
    "title": "First Note",
    "content": "This is the content of the first note.",
    "updatedAt": "2024-02-02T12:00:00Z"
  },
  {
    "id": "a2b3c4d5-6e7f-8901-2345-6789abcdef12",
    "title": "Second Note",
    "content": "Here’s another note for testing.",
    "updatedAt": "2024-02-02T13:30:00Z"
  }
]
```

3. Get a Single Note (GET /notes/:id)
#### Request:

`GET /notes/c1d2a3f4-5b6e-7890-1234-56789abcdef0`

#### Response:

```json
{
  "id": "c1d2a3f4-5b6e-7890-1234-56789abcdef0",
  "title": "First Note",
  "content": "This is the content of the first note.",
  "updatedAt": "2024-02-02T12:00:00Z"
}
```

### Update an Existing Note (PUT /notes/:id)

#### Request:

`PUT /notes/c1d2a3f4-5b6e-7890-1234-56789abcdef0`

```json
{
  "title": "Updated First Note",
  "content": "Updated content with more details.",
  "updatedAt": "2024-02-02T14:00:00Z"
}
```

#### Response:
```json
{
  "id": "c1d2a3f4-5b6e-7890-1234-56789abcdef0",
  "title": "Updated First Note",
  "content": "Updated content with more details.",
  "updatedAt": "2024-02-02T14:00:00Z"
}
```

### Delete a Note (DELETE `/notes/:id`)

#### Request:
`DELETE /notes/c1d2a3f4-5b6e-7890-1234-56789abcdef0`

#### Response:
```json
{
  "id": "c1d2a3f4-5b6e-7890-1234-56789abcdef0",
  "title": "Updated First Note",
  "content": "Updated content with more details.",
  "updatedAt": "2024-02-02T14:00:00Z"
}
```