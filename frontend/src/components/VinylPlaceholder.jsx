export default function VinylPlaceholder({ className = "" }) {
  return (
    <div className={`vinyl-spin ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="98" fill="#0D0F22" />
        <circle cx="100" cy="100" r="98" fill="none" stroke="#E0B23C" strokeOpacity="0.15" strokeWidth="1" />
        {[88, 76, 64, 52].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="#E0B23C" strokeOpacity="0.12" strokeWidth="0.75" />
        ))}
        <circle cx="100" cy="100" r="34" fill="#E0B23C" />
        <circle cx="100" cy="100" r="34" fill="none" stroke="#12142B" strokeOpacity="0.2" strokeWidth="1" />
        <circle cx="100" cy="100" r="4" fill="#12142B" />
      </svg>
    </div>
  );
}