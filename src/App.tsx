import { useState } from 'react';
import { openai, supabase } from './lib/config';
import './App.css';
import Header from './components/Header/Header';
import PromptForm from './components/PromptForm/PromptForm';
import Results from './components/Results/Results';
import type { Answers } from './components/PromptForm/PromptForm';

export type Match = {
  content: string;
  id: number;
  release_year: number;
  similarity: number;
  title: string;
};

function App() {
  const [screen, setScreen] = useState<'form' | 'results'>('form');
  const [match, setMatch] = useState<Match | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function createQueryEmbedding(query: string) {
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;
    return queryEmbedding;
  }

  async function findNearestMatch(queryEmbedding: number[]) {
    const { data, error } = await supabase.rpc('match_movies', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 1,
    });
    if (error) throw error;
    return data;
  }

  async function handleSubmit(query: string, answers: Answers) {
    setScreen('results');
    setIsLoading(true);

    try {
      const queryEmbedding = await createQueryEmbedding(query);
      const matchResponse = await findNearestMatch(queryEmbedding);
      setMatch(matchResponse[0]);
      const matchForAI: Match = matchResponse[0];

      const chatResponse = await openai.chat.completions.create({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'system',
            content: `
              You are a helpful and enthusiastic movie recommender. 
              I have setup questions 3 questions to be answered. 
              Q1: What’s your favorite movie and why?
              Q2: Are you in the mood for something new or a classic?
              Q3: Do you wanna have fun or do you want something serious?
              I will provide you with the answers given by the user along with some context about the movie.
              You will then formulate a response in 3 - 5 sentences about why the movie is a perfect match for the user.
              Do not make up any answers if no context is provided. Just reply by saying: "Sorry there is not a movie that matches your criteria."
            `,
          },
          {
            role: 'user',
            content: `
              User Answers:
                Q1: ${answers.q1}
                Q2: ${answers.q2}
                Q3: ${answers.q3}

              Movie Context: ${matchForAI.content}
            `,
          },
        ],
      });
      const chatCompletionContent = chatResponse.choices[0].message.content;
      setExplanation(chatCompletionContent);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  function handleGoAgain() {
    setScreen('form');
    setIsLoading(false);
  }

  return (
    <main className='container-main'>
      <Header />
      {screen === 'results' ? (
        <Results
          onGoAgain={handleGoAgain}
          isLoading={isLoading}
          match={match}
          explanation={explanation}
        />
      ) : (
        <PromptForm onSubmit={handleSubmit} />
      )}
    </main>
  );
}

export default App;
