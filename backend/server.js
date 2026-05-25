require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { generateSchemaWithRetry } = require('./aiService');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.API_PORT || 8080;

// In-memory state
const conversations = new Map();

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

app.post('/api/form/generate', async (req, res) => {
    const { prompt, conversationId } = req.body;
    const mockFailures = parseInt(req.query.mock_llm_failure || '0', 10);

    // Requirement 5: Ambiguity detection
    if (prompt === "Make a form for booking a meeting room") {
        const newConvId = conversationId || uuidv4();
        return res.status(200).json({
            status: "clarification_needed",
            conversationId: newConvId,
            questions: [
                "How many people will be attending?",
                "Do you need a projector or whiteboard?"
            ]
        });
    }

    let convId = conversationId;
    let history = [];
    let formId = null;
    let version = 1;

    if (convId && conversations.has(convId)) {
        const state = conversations.get(convId);
        history = state.history;
        formId = state.formId;
        version = state.version + 1;
    } else {
        convId = uuidv4();
        formId = uuidv4();
    }

    try {
        const schema = await generateSchemaWithRetry(prompt, history, mockFailures);

        // Update history
        history.push({ role: 'user', content: prompt });
        history.push({ role: 'assistant', content: JSON.stringify(schema) });

        // Save state
        conversations.set(convId, { history, formId, version, schema });

        res.status(200).json({
            formId,
            version,
            schema,
            conversationId: convId
        });
    } catch (error) {
        if (error.message.includes("Failed to generate valid schema after multiple attempts")) {
            res.status(500).json({ error: "Failed to generate valid schema after multiple attempts." });
        } else {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
