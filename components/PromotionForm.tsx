"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldPath } from "react-hook-form";
import { promotionSchema, type PromotionFormValues } from "@/lib/schema";
import { submitForm } from "@/lib/submitForm";
import FormField from "./FormField";
import SuccessCard from "./SuccessCard";

const COURSES = [
  "CSS",
  "HTML 1",
  "Scratch",
  "Scratch Beginner",
  "Scratch Advanced",
  "Foundations of Coding 1",
] as const;

const SCHOOL_KEY = "sbk_school_name";

interface Step {
  title: string;
  subtitle: string;
  fields: FieldPath<PromotionFormValues>[];
}

const STEPS: Step[] = [
  {
    title: "School & Class",
    subtitle: "Which school and class is being promoted?",
    fields: ["school", "grade"],
  },
  {
    title: "Course",
    subtitle: "What course is the class being promoted to?",
    fields: ["course"],
  },
  {
    title: "Class Schedule",
    subtitle: "When does this class run?",
    fields: ["startTime", "endTime"],
  },
  {
    title: "Tutor Details",
    subtitle: "Who are the tutors for this class?",
    fields: ["leadName", "leadContact", "assistantName"],
  },
  {
    title: "Communication",
    subtitle: "Who was the promotion communicated to?",
    fields: ["communicatedTo"],
  },
];

const base =
  "w-full rounded-md border px-3 py-2.5 text-base text-gray-900 outline-none transition-colors bg-white";
const inputClass = `${base} border-[#D1D5DB] focus:border-[#2E75B6] focus:ring-2 focus:ring-[#2E75B6]/20`;
const inputErrorClass = `${base} border-[#DC2626] focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20`;

export default function PromotionForm() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [animKey, setAnimKey] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [submittedValues, setSubmittedValues] =
    useState<PromotionFormValues | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    shouldUnregister: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem(SCHOOL_KEY);
    if (saved) setValue("school", saved);
  }, [setValue]);

  async function goNext() {
    const valid = await trigger(STEPS[step].fields);
    if (!valid) return;
    setDirection("forward");
    setAnimKey((k) => k + 1);
    setStep((s) => s + 1);
  }

  function goBack() {
    setDirection("backward");
    setAnimKey((k) => k + 1);
    setStep((s) => s - 1);
  }

  async function onSubmit(values: PromotionFormValues) {
    setApiError(null);
    const result = await submitForm(values);
    if (result.ok) {
      localStorage.setItem(SCHOOL_KEY, values.school);
      setSubmittedValues(values);
      setSubmitted(true);
    } else {
      setApiError(result.error ?? "Something went wrong. Please try again.");
    }
  }

  function onInvalid(errs: object) {
    const errorKeys = Object.keys(errs) as (keyof PromotionFormValues)[];
    for (let i = 0; i < STEPS.length; i++) {
      if (STEPS[i].fields.some((f) => errorKeys.includes(f))) {
        setDirection(i < step ? "backward" : "forward");
        setAnimKey((k) => k + 1);
        setStep(i);
        break;
      }
    }
  }

  function handleReset() {
    const savedSchool = localStorage.getItem(SCHOOL_KEY) ?? "";
    reset();
    if (savedSchool) setValue("school", savedSchool);
    setStep(0);
    setDirection("forward");
    setAnimKey((k) => k + 1);
    setSubmitted(false);
    setSubmittedValues(null);
    setApiError(null);
  }

  if (submitted && submittedValues) {
    return (
      <SuccessCard
        school={submittedValues.school}
        grade={submittedValues.grade}
        onReset={handleReset}
      />
    );
  }

  const isLastStep = step === STEPS.length - 1;
  const current = STEPS[step];
  const animClass =
    direction === "forward" ? "step-enter-forward" : "step-enter-backward";

  return (
    <div className="px-4 py-6 flex flex-col gap-6">
      {/* Progress dots */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">
          Step {step + 1} of {STEPS.length}
        </span>
        <div className="flex items-center gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300 ${
                i === step
                  ? "w-6 h-2 bg-[#1A4F82]"
                  : i < step
                  ? "w-2 h-2 bg-[#2E75B6]"
                  : "w-2 h-2 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
        {/* Animated step panel */}
        <div key={animKey} className={`flex flex-col gap-5 ${animClass}`}>
          {/* Step heading */}
          <div className="flex flex-col gap-0.5 mb-1">
            <h2 className="text-lg font-semibold text-[#1A4F82]">
              {current.title}
            </h2>
            <p className="text-sm text-gray-500">{current.subtitle}</p>
          </div>

          {/* Step 1 — School & Class */}
          {step === 0 && (
            <>
              <FormField
                label="School Name"
                required
                error={errors.school?.message}
              >
                <input
                  {...register("school")}
                  type="text"
                  placeholder="e.g. Nairobi Primary School"
                  className={errors.school ? inputErrorClass : inputClass}
                />
              </FormField>

              <FormField
                label="Grade Being Promoted"
                required
                error={errors.grade?.message}
              >
                <input
                  {...register("grade")}
                  type="text"
                  placeholder="e.g. Grade 8 Blue"
                  className={errors.grade ? inputErrorClass : inputClass}
                />
              </FormField>
            </>
          )}

          {/* Step 2 — Course */}
          {step === 1 && (
            <FormField
              label="Course Promoted To"
              required
              error={errors.course?.message}
            >
              <select
                {...register("course")}
                defaultValue=""
                className={errors.course ? inputErrorClass : inputClass}
              >
                <option value="" disabled>
                  Select a course…
                </option>
                {COURSES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>
          )}

          {/* Step 3 — Schedule */}
          {step === 2 && (
            <>
              <FormField
                label="Class Start Time"
                required
                error={errors.startTime?.message}
              >
                <input
                  {...register("startTime")}
                  type="time"
                  className={errors.startTime ? inputErrorClass : inputClass}
                />
              </FormField>

              <FormField
                label="Class End Time"
                required
                error={errors.endTime?.message}
              >
                <input
                  {...register("endTime")}
                  type="time"
                  className={errors.endTime ? inputErrorClass : inputClass}
                />
              </FormField>
            </>
          )}

          {/* Step 4 — Tutors */}
          {step === 3 && (
            <>
              <FormField
                label="Lead Tutor Name"
                required
                error={errors.leadName?.message}
              >
                <input
                  {...register("leadName")}
                  type="text"
                  autoComplete="off"
                  className={errors.leadName ? inputErrorClass : inputClass}
                />
              </FormField>

              <FormField
                label="Lead Tutor Contact"
                required
                error={errors.leadContact?.message}
              >
                <input
                  {...register("leadContact")}
                  type="tel"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="e.g. 0712345678"
                  className={errors.leadContact ? inputErrorClass : inputClass}
                />
              </FormField>

              <FormField
                label="Assistant Tutor Name"
                error={errors.assistantName?.message}
              >
                <input
                  {...register("assistantName")}
                  type="text"
                  autoComplete="off"
                  placeholder="Leave blank if none"
                  className={
                    errors.assistantName ? inputErrorClass : inputClass
                  }
                />
              </FormField>
            </>
          )}

          {/* Step 5 — Communication */}
          {step === 4 && (
            <>
              <FormField
                label="Lead Tutor Communicated To"
                required
                error={errors.communicatedTo?.message}
              >
                <input
                  {...register("communicatedTo")}
                  type="text"
                  autoComplete="off"
                  placeholder="Name of person communicated to"
                  className={
                    errors.communicatedTo ? inputErrorClass : inputClass
                  }
                />
              </FormField>

              {apiError && (
                <div className="rounded-md border border-[#DC2626] bg-[#DC2626]/5 px-4 py-3 text-sm text-[#DC2626]">
                  {apiError}
                </div>
              )}
            </>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="mt-8 flex flex-col gap-3">
          {isLastStep ? (
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-[#1A4F82] py-3.5 text-base font-bold text-white transition-opacity disabled:opacity-60 active:opacity-80"
            >
              {isSubmitting ? "Submitting…" : "Submit Promotion Request"}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="w-full rounded-lg bg-[#1A4F82] py-3.5 text-base font-bold text-white active:opacity-80"
            >
              Next →
            </button>
          )}

          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              disabled={isSubmitting}
              className="text-sm font-medium text-gray-500 text-center py-1 disabled:opacity-40"
            >
              ← Back
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
