import { use } from 'react';
import EditMenuItemClient from './EditMenuItemClient';

// This is a Server Component that can use React.use()
export default function EditMenuItemPage({ params }: { params: { id: string } }) {
  // Unwrap the params using React.use()
  const id = use(Promise.resolve(params.id));
  
  return <EditMenuItemClient id={id} />;
}