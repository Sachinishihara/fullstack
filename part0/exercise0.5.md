
---

### **exercise0.5.md – Single Page App (SPA) Visit**

```markdown
# SPA Visit Diagram

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant Server

    User->>Browser: Opens SPA page /spa
    Browser->>Server: GET /spa (HTML)
    Browser->>Server: GET /main.css
    Browser->>Server: GET /spa.js
    Browser->>Server: GET /data.json
    Server-->>Browser: Notes JSON
    Browser-->>User: Renders notes list (SPA)
