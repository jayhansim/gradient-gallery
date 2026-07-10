interface CounterProps {
  index: number; // zero-based
  total: number;
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "01/05" — reflects the actual number of gradients. */
export default function Counter({ index, total }: CounterProps) {
  return (
    <p className="counter">
      {pad(index + 1)}/{pad(total)}
    </p>
  );
}
