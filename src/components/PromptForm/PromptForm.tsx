import { useState } from 'react';
import styles from './PromptForm.module.css';

interface PromptFormProps {
  onSubmit: (query: string, awnsers: Answers) => void;
}

export type Answers = {
  q1: string;
  q2: string;
  q3: string;
};

export default function PromptForm({ onSubmit }: PromptFormProps) {
  const [textareaValues, setTextareaValues] = useState<Answers>({
    q1: '',
    q2: '',
    q3: '',
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const combinedString = `${textareaValues.q1}. ${textareaValues.q2}. ${textareaValues.q3}`;
    onSubmit(combinedString, textareaValues);
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
