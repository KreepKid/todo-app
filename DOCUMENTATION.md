## Third-Party Code
- **Prisma**: Chosen as an ORM for SQLite because it is a recommended best practice that simplifies database interactions and avoids the need to write raw SQL.

- **Jest**: Selected for testing server actions due to strong community recommendations and my familiarity with its syntax from previous group projects.

- **React Testing Library**: Used alongside Jest for frontend testing because it is the recommended standard for testing React components from a user's perspective.


## Database Design
The application uses SQLite with Prisma as the ORM. The database consists of a single Task table to handle all data.

| Column Name | Data Type | Constraints / Notes |
| --- | --- | --- |
| id | Integer | Primary Key, Auto-incrementing |
| title | String | |
| description | String |
| dueDateDate | Time |
| topic | String |
| status | String | Restricted in UI to: "Todo", "In-Progress", "Complete" |
| archived | Boolean | Default: ***false***. Acts as a flag to hide tasks from the active list. |
| createdAtDate | Time | Default: current timestamp |

__Relationships:__ *The database intentionally uses a single Task table with no complex relational models. This minimalistic design was chosen to keep the data structure easy to understand and perfectly matches the scope of a local-first, single-user application.*



### AI Usage Declaration
* **Tools Used:** 
  * **Gemini Web (Gemini Pro & Thinking):** Used for project planning, database design, server action logic, test strategy, and documentation drafting.
  * **Claude-Windows-App (Claude Sonnet):** Used for frontend React component development and CSS styling.
* **Scope:** AI tools were used as pair-programming assistants for code generation, test drafting, and debugging.
* **Constraints & Redirections:** Inputs were constrained to local-first SQLite requirements without user authentication. Recommendations favoring complex setups (like multi-table relational schemas or unneeded packages) were redirected to keep the architecture minimal, readable, and compliant with the lab rubric.

### AI Transcripts
* [Transcript 1: Gemini Web (Planning, Database, Logic)] https://gemini.google.com/share/d/1_V65T2JPwCYUn9JYJxqrpeNAIvVuCMY_?usp=sharing
* [Transcript 2: Claude-Windows-App (Frontend & Styling)] https://claude.ai/share/ce7375e2-7809-415e-bc0c-e16363f377ea
