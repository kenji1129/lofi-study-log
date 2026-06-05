import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'

// Generic drag-to-reorder list. `children` is a render function:
//   (item, { ref, style, isDragging, handleProps }) => JSX
// Put `ref`+`style` on the row root and `handleProps` on the drag handle.
// onReorder is called with (activeId, overId).
export function SortableList({ items, getId, onReorder, className, children }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    // touch: long-press ~220ms to start dragging (so taps/scroll still work)
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 8 } }),
  )

  const ids = items.map(getId)

  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) onReorder(active.id, over.id)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className={className}>
          {items.map((item) => (
            <SortableRow key={getId(item)} id={getId(item)}>
              {(sortable) => children(item, sortable)}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

function SortableRow({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  // lock horizontal movement — only allow vertical reordering
  const style = {
    transform: transform ? `translate3d(0, ${Math.round(transform.y)}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 20 : undefined,
    position: isDragging ? 'relative' : undefined,
  }

  return children({
    ref: setNodeRef,
    style,
    isDragging,
    handleProps: {
      ref: setActivatorNodeRef,
      ...attributes,
      ...listeners,
      style: { touchAction: 'none', cursor: 'grab' },
    },
  })
}
