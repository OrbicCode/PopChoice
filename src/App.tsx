import { useState } from 'react';
import './App.css';
import Header from './components/Header/Header';
import PromptForm from './components/PromptForm/PromptForm';
import Results from './components/Results/Results';

function App() {
  const [hasPromted, setHasPrompted] = useState(false);
  return (
    <main className='container-main'>
      <Header />
      {hasPromted ? (
        <Results setHasPrompted={setHasPrompted} />
      ) : (
        <PromptForm setHasPrompted={setHasPrompted} />
      )}
    </main>
  );
}

export default App;
