import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <h1>Main Menu</h1>
      <nav>
        <ul>
          <li>
            <Link href="/inventory">Go to Inventory</Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}