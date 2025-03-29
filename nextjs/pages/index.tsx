import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Inventory Management System</h1>
      <div className={styles.grid}>
        <Link href="/inventory" className={styles.card}>
          <h2>Inventory &rarr;</h2>
          <p>Manage inventory items</p>
        </Link>

        <Link href="/inventory-check" className={styles.card}>
          <h2>Inventory Check &rarr;</h2>
          <p>Manage room assignments</p>
        </Link>

        <Link href="/users/create" className={styles.card}>
          <h2>Create User &rarr;</h2>
          <p>Add new users to the system</p>
        </Link>

        <Link href="/rooms/create" className={styles.card}>
          <h2>Create Room &rarr;</h2>
          <p>Add new rooms to the system</p>
        </Link>

        <Link href="/sync" className={styles.card}>
          <h2>Sync &rarr;</h2>
          <p>Synchronize inventory data</p>
        </Link>
      </div>
    </div>
  );
}