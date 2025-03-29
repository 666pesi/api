import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Inventory Management</h1>
      <ul>
        <li><Link href="/inventory">Inventory</Link></li>
        <li><Link href="/inventory-check">Inventory Check</Link></li>
        <li><Link href="/users/create">Create User</Link></li>
        <li><Link href="/rooms/create">Create Room</Link></li>
        <li><Link href="/sync">Sync</Link></li>
      </ul>
    </div>
  );
}