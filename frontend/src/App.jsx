import React, { useState } from 'react';
import ChatPane from './components/ChatPane';
import FormRendererPane from './components/FormRendererPane';
import './index.css';

function App() {
  const [conversationId, setConversationId] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentSchema, setCurrentSchema] = useState(null);
  const [previousSchema, setPreviousSchema] = useState(null);
  const [formVersion, setFormVersion] = useState(0);

  const handleSchemaUpdate = (newSchema, newVersion, newConversationId) => {
    setPreviousSchema(currentSchema);
    setCurrentSchema(newSchema);
    setFormVersion(newVersion);
    if (newConversationId) {
      setConversationId(newConversationId);
    }
  };

  return (
    <div className="app-container">
      <div className="left-pane" data-testid="chat-pane">
        <ChatPane
          conversationId={conversationId}
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          onSchemaUpdate={handleSchemaUpdate}
        />
      </div>
      <div className="right-pane" data-testid="form-renderer-pane">
        <FormRendererPane
          currentSchema={currentSchema}
          previousSchema={previousSchema}
          formVersion={formVersion}
        />
      </div>
    </div>
  );
}

export default App;
