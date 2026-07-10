interface MenuProps {
  onPrev: () => void;
  onNext: () => void;
  onAll: () => void;
  onSave: () => void;
  onInfo: () => void;
}

/** Primary menu row: Prev · Next · All · Save · Info */
export default function Menu({ onPrev, onNext, onAll, onSave, onInfo }: MenuProps) {
  return (
    <div className="menu-row">
      <button className="menu-item menu-item--static" onClick={onPrev}>
        Prev
      </button>
      <button className="menu-item menu-item--static" onClick={onNext}>
        Next
      </button>
      <button className="menu-item menu-item--static" onClick={onAll}>
        All
      </button>
      <button className="menu-item menu-item--static" onClick={onSave}>
        Save
      </button>
      <button className="menu-item menu-item--static" onClick={onInfo}>
        Info
      </button>
    </div>
  );
}
