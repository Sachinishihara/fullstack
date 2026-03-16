#New Note Diagram (SPA)

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server

    User->>Browser: Types a note and clicks Save
    Browser->>Browser: Adds note locally and re-renders list
    Browser->>Server: POST /new_note_spa with note JSON
    Server-->>Browser: 201 Created
    Browser-->>User: Updated notes list visible
