import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Inventory Management System</h1>
      <nav>
        <ul>
          <li>
            <Link href="/inventory">Inventory Management</Link>
          </li>
          <li>
            <Link href="/sync">Sync Management</Link>
          </li>
          <li>
            <Link href="/users">User Management</Link>
          </li>
          <li>
            <Link href="/rooms">Room Management</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}