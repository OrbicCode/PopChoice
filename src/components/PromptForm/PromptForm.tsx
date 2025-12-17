import { useState } from 'react';
import { openai, supabase } from '../../lib/config';
import styles from './PromptForm.module.css';

interface PromptFormProps {
  setHasPrompted: (boolean: boolean) => void;
}

export default function PromptForm({ setHasPrompted }: PromptFormProps) {
  const [textareaValues, setTextareaValues] = useState({
    q1: '',
    q2: '',
    q3: '',
  });

  async function createQueryEmbedding(query: string) {
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    });
    const queryEmbedding = embeddingResponse.data[0].embedding;
    return queryEmbedding;
  }

  async function findNearestMatch(queryEmbedding: number[]) {
    const { data } = await supabase.rpc('match_movies', {
      query_embedding: queryEmbedding,
      match_threshold: 0.5,
      match_count: 1,
    });
    return data;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setHasPrompted(true);
    const combinedString = `${textareaValues.q1}. ${textareaValues.q2}. ${textareaValues.q3}`;
    const queryEmbedding = await createQueryEmbedding(combinedString);
    const matches = await findNearestMatch(queryEmbedding);
    console.log(matches);
  }
  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <label>{'What’s your favorite movie and why?'}</label>
        <textarea
          onChange={(e) => setTextareaValues({ ...textareaValues, q1: e.target.value })}
          value={textareaValues.q1}
          placeholder={
            'The Shawshank Redemption \nBecause it taught me to never give up hope no matter how hard life gets'
          }
        ></textarea>
      </div>
      <div>
        <label>{'Are you in the mood for something new or a classic?'}</label>
        <textarea
          onChange={(e) => setTextareaValues({ ...textareaValues, q2: e.target.value })}
          value={textareaValues.q2}
          placeholder={'I want to watch movies that were released after 1990'}
        ></textarea>
      </div>
      <div>
        <label>{'Do you wanna have fun or do you want something serious?'}</label>
        <textarea
          onChange={(e) => setTextareaValues({ ...textareaValues, q3: e.target.value })}
          value={textareaValues.q3}
          placeholder={'Do you wanna have fun or do you want something serious?'}
        ></textarea>
      </div>
      <button>Let's Go</button>
    </form>
  );
}
