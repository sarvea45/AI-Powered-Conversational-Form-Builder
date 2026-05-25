# AI-Powered Conversational Form Builder

A full-stack application that allows users to generate complex, dynamic web forms through a conversational AI interface. The backend forces the LLM to output valid JSON Schema (Draft 7), handles multi-turn conversations, and incorporates a robust retry mechanism on validation failures. The frontend renders this schema in real-time, supports custom conditional logic (`x-show-when`), and highlights schema differences across conversation turns.

## Architecture

- **Backend:** Node.js + Express. Interacts with OpenAI to generate JSON Schema. Implements server-side validation against Draft 7 meta-schema using `ajv`. Includes retry loops for reliable AI outputs.
- **Frontend:** React + Vite. Uses `@rjsf/core` for live form rendering based on the dynamically updated JSON Schema. Implements a split-pane layout to simultaneously chat and preview.

## Setup Instructions

This project is fully containerized with Docker.

1. Create your environment file based on the example:
   ```bash
   cp backend/.env.example backend/.env
   ```
   *Note: Be sure to populate `LLM_API_KEY` with your OpenAI API key in `backend/.env` for actual form generation. The system will fall back to dummy mock testing if the key is default/empty for some tests.*

2. Start the application:
   ```bash
   docker-compose up --build
   ```

3. Access the application:
   - **Frontend:** http://localhost:3000
   - **Backend API:** http://localhost:8080

## Design Choices

- **Server-Side Validation:** Validating the LLM output strictly on the backend before sending it to the client ensures that the frontend only ever receives valid, renderable schemas. The auto-retry mechanism acts as a robust self-correction loop.
- **Live State Filtering (`x-show-when`):** Instead of building a complex custom widget for every field type in `@rjsf/core`, conditional logic is handled by wrapping the renderer and dynamically pruning the schema `properties` based on the current `formData`. This is lightweight and scalable.
- **Diff Calculation:** Schema diffing is done using `deep-diff` to provide granular insights into how the AI altered the form structure between turns, improving the UX for non-technical users iteratively building forms.
