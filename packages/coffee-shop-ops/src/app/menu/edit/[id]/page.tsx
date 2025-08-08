import EditMenuItemClient from './EditMenuItemClient';

export default function EditMenuItemPage({ params }: { params: { id: string } }) {
  return <EditMenuItemClient id={params.id} />;
}
