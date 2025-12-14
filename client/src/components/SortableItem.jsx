import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: '15px',
    margin: '10px 0',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    cursor: 'grab',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <span>{props.children}</span>
      <button 
        onClick={(e) => {
          e.stopPropagation(); 
          props.onDelete();
        }}
        style={{ background: 'transparent', border: 'none', color: 'red', cursor: 'pointer', fontSize: '1.2rem' }}
      >
        ×
      </button>
    </div>
  );
}