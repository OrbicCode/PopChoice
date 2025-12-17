import styles from './Results.module.css';
import type { Match } from '../../App';

interface ResultsProps {
  onGoAgain: () => void;
  match: Match | null;
  isLoading: boolean;
  explanation: string | null;
}

export default function Results({ onGoAgain, match, isLoading, explanation }: ResultsProps) {
  return (
    <div className={styles.container}>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {!explanation?.includes('Sorry') ? (
            <h2>{`${match?.title} (${match?.release_year})`}</h2>
          ) : null}
          <p>{explanation && explanation}</p>
        </div>
      )}
      <button disabled={isLoading} onClick={onGoAgain} className={styles.button}>
        Go Again
      </button>
    </div>
  );
}
