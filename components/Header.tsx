export default function Header() {
  return (
    <header className="bg-[#1A4F82] px-4 pt-5 pb-4">
      <div className="flex flex-col items-center gap-2">
        <img
          src="/logo.png"
          alt="Smart Brains Kenya"
          className="w-52 h-auto"
        />
        <p className="text-white/90 text-sm font-medium tracking-wide text-center">
          Class Promotion Request
        </p>
      </div>
    </header>
  );
}
