import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function Tools() {
  return (
    <div className="mx-auto max-w-xl px-4 pb-32 pt-safe">
      <h1 className="pt-5 text-2xl font-extrabold">Tools</h1>
      <Link to="/settings" className="card mt-4 flex items-center gap-3 p-4 font-semibold">
        <Settings size={20} /> Settings · Backup · AI key
      </Link>
    </div>
  );
}
