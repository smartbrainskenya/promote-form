"use client";

import { useState, useRef, useEffect } from "react";

const SCHOOLS = [
  "Acacia Crest",
  "Acacia Crest Academy",
  "ACK Machakos",
  "ACK St. James Academy & Junior School",
  "Accurate Schools",
  "Al-ameen Academy Kitisuru",
  "Al-ameen Academy Pangani",
  "Al-ameen Academy Wilson",
  "Al-ameen Pangani",
  "Apex School",
  "Arkyard",
  "Arrahmah School",
  "Bambiland School",
  "Bethel School",
  "Brainston School",
  "Brilliance Junior",
  "Bristar Schools",
  "Brook Haven School",
  "Brookhill Academy",
  "Brookshine School",
  "Carmel Catholic Primary School",
  "Chantilly Schools",
  "Cornerbrook School",
  "Cornerbrook School Juja",
  "Cornerstone Academy",
  "Daisy Flowers",
  "De Paul Austin Academy",
  "Emammy School",
  "Epren Academy",
  "Fanaka Junior School",
  "Fanaka School",
  "Faulu",
  "Furaha School",
  "Grace Tassel",
  "Greater Lite",
  "Greenyard School",
  "Hebron School",
  "Jonathan Gloag",
  "Kanzi School",
  "Kids Learning Center",
  "Kinderville Junior School",
  "Kinderstart School",
  "Kings and Queens Academy",
  "Kirawa Road School",
  "Kirawa School",
  "Lily Academy (Githurai 45)",
  "Lily Academy (Mwihoko)",
  "Lite View Junior Academy",
  "Little Wonder",
  "Machakos Academy",
  "Maleeka School",
  "Maxwell Adventist Preparatory School",
  "Mirema School",
  "Mother Teresa Fantoni School",
  "Mumwe Oak",
  "Nissi Stars",
  "Notre Dame School",
  "Oasis of Success",
  "Ohana Education Centre",
  "Olive Ngunya School",
  "Ongata Academy",
  "PEFA Donholm School",
  "Plainsview Academy",
  "Precious Cornerstone",
  "Prestige",
  "Rays of Grace",
  "Rockside Academy",
  "Rose of Sharon Academy",
  "Ruaraka Academy",
  "Ruaraka School",
  "SFS Primary School",
  "Shamiri School",
  "Solidarity Primary School",
  "St. Bakhita Eagles Plains",
  "St. Bakhita Sabaki",
  "St. John's Junior School",
  "St. Jude",
  "St. Mary",
  "Starlite",
  "Starlite Utawala",
  "Sukari PCEA Kahawa",
  "Summer Brook School",
  "Sunrise Garden",
  "Sunrise of Africa",
  "Syokimau Adventist",
  "The CanaBrook School",
  "The Elegant Achievers",
  "The Marion Farmhouse",
  "The Marion School",
  "The Stepping Stones Elementary",
  "Tumaini International School",
  "Valence School",
  "Yari School",
];

interface Props {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

const base =
  "w-full rounded-md border px-3 py-2.5 text-base text-gray-900 outline-none transition-colors bg-white";
const inputClass = `${base} border-[#D1D5DB] focus:border-[#2E75B6] focus:ring-2 focus:ring-[#2E75B6]/20`;
const inputErrorClass = `${base} border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20`;

export default function SchoolCombobox({ value, onChange, onBlur, error }: Props) {
  const [query, setQuery] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync display when the form resets or localStorage restores the value
  useEffect(() => {
    setQuery(value ?? "");
  }, [value]);

  const filtered = query.trim()
    ? SCHOOLS.filter((s) => s.toLowerCase().includes(query.toLowerCase().trim()))
    : SCHOOLS;

  const noResults = query.trim().length > 0 && filtered.length === 0;

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    setQuery(text);
    onChange(text);
    setOpen(true);
  }

  function selectSchool(school: string) {
    setQuery(school);
    onChange(school);
    setOpen(false);
  }

  function addAsOther() {
    const trimmed = query.trim();
    setQuery(trimmed);
    onChange(trimmed);
    setOpen(false);
  }

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
        placeholder="Search for a school…"
        autoComplete="off"
        className={error ? inputErrorClass : inputClass}
      />

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-56 overflow-y-auto"
        >
          {filtered.map((school) => (
            <li key={school} role="option" aria-selected={school === value}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectSchool(school);
                }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                  school === value
                    ? "bg-[#2E75B6]/10 text-[#1A4F82] font-medium"
                    : "text-gray-900 hover:bg-[#2E75B6]/10"
                }`}
              >
                {school}
              </button>
            </li>
          ))}

          {noResults && (
            <li role="option" aria-selected={false}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addAsOther();
                }}
                className="w-full text-left px-3 py-2.5 text-sm font-medium text-[#2E75B6] hover:bg-[#2E75B6]/10 transition-colors flex items-center gap-2"
              >
                <span className="text-[#2E75B6]">+</span>
                Add &ldquo;{query.trim()}&rdquo; as other
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
