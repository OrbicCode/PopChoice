import styles from './Results.module.css';

interface ResultsProps {
  setHasPrompted: (boolean: boolean) => void;
}

export default function Results({ setHasPrompted }: ResultsProps) {
  return (
    <div className={styles.container}>
      <h2>Results</h2>
      <button onClick={() => setHasPrompted(false)} className={styles.button}>
        Go Again
      </button>
    </div>
  );
}
