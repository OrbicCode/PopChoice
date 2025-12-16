import popcorn from '/popcorn.png';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header>
      <div className={styles.content}>
        <img
          src={popcorn}
          alt='A popcorn bucket with wide sparkling eyes.'
          width={80}
          height={90}
        />
        <h1>PopChoice</h1>
      </div>
    </header>
  );
}
