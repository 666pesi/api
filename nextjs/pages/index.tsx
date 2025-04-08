import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Správa majetku</h1>
      <ul>
        <li><Link href="/inventory">Majetok</Link></li>
        <li><Link href="/inventory-check">Zadanie úloh</Link></li>
        <li><Link href="/users/create">Užívatelia</Link></li>
        <li><Link href="/rooms/create">Miestnosti</Link></li>
        <li><Link href="/sync">Sync</Link></li>
      </ul>
    </div>
  );
}