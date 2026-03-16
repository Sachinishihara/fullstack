 New Note Diagram (Traditional App)

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server

    User->>Browser: Types a note and clicks Save
    Browser->>Server: POST /new_note with note data
    Server-->>Browser: 302 redirect to /notes
    Browser->>Server: GET /notes (HTML)
    Browser->>Server: GET /main.css
    Browser->>Server: GET /main.js
    Browser->>Server: GET /data.json
    Server-->>Browser: Notes JSON (includes new note)
    Browser-->>User: Renders updated note list
