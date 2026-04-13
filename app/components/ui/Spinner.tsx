export default function Spinner({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: "spin 0.8s linear infinite" }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <circle
        cx="20"
        cy="20"
        r="16"
        stroke="#DDDBFA"
        strokeWidth="4"
      />
      <path
        d="M36 20a16 16 0 0 0-16-16"
        stroke="#4F46E5"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
