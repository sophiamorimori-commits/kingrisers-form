'use client';
import { DEFAULT_CATEGORIES } from '@/lib/categories';
import type { CategoryId } from '@/types/calendar';

interface Props {
  selected: CategoryId[];
  onChange: (ids: CategoryId[]) => void;
}

export default function CategoryFilter({ selected, onChange }: Props) {
  const toggle = (id: CategoryId) => {
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const allSelected = selected.length === 0;

  return (
    <div className="flex gap-1.5 px-4 py-2 overflow-x-auto scrollbar-none">
      <button
        className="flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full transition-colors"
        style={{
          background: allSelected ? 'var(--accent)' : 'var(--bg-subtle)',
          color: allSelected ? '#fff' : 'var(--text-secondary)',
        }}
        onClick={() => onChange([])}
      >
        All
      </button>
      {DEFAULT_CATEGORIES.filter((c) => c.isVisible).map((cat) => {
        const active = selected.includes(cat.id as CategoryId);
        return (
          <button
            key={cat.id}
            className="flex-shrink-0 flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full transition-colors"
            style={{
              background: active ? cat.color + '22' : 'var(--bg-subtle)',
              color: active ? cat.color : 'var(--text-secondary)',
              border: active ? `1px solid ${cat.color}40` : '1px solid transparent',
            }}
            onClick={() => toggle(cat.id as CategoryId)}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: cat.color }}
            />
            {cat.labelEn}
          </button>
        );
      })}
    </div>
  );
}
