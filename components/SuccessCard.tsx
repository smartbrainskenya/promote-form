interface SuccessCardProps {
  school: string;
  grade: string;
  onReset: () => void;
}

export default function SuccessCard({
  school,
  grade,
  onReset,
}: SuccessCardProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-10 px-6">
      <div className="w-14 h-14 rounded-full bg-[#16A34A]/10 flex items-center justify-center">
        <svg
          className="w-8 h-8 text-[#16A34A]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-[#1A4F82]">
          Submitted successfully
        </h2>
        <p className="text-sm text-gray-600">
          {school} &mdash; {grade}
        </p>
      </div>

      <button
        onClick={onReset}
        className="mt-2 text-sm font-medium text-[#2E75B6] underline underline-offset-2"
      >
        Submit another
      </button>
    </div>
  );
}
