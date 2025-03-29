import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Inventory Management System</h1>
      <nav>
        <ul>
          <li><Link href="/inventory">Inventory Management</Link></li>
          <li><Link href="/inventory-check">Inventory Check</Link></li>
          <li><Link href="/users">User Management</Link></li>
          <li><Link href="/rooms">Room Management</Link></li>
        </ul>
      </nav>
    </div>
  );
}