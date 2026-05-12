import { z } from "zod";

export const promotionSchema = z
  .object({
    school: z.string().min(1, "School name is required"),
    grade: z.string().min(1, "Grade being promoted is required"),
    course: z.enum(
      [
        "CSS",
        "HTML 1",
        "Scratch",
        "Scratch Beginner",
        "Scratch Advanced",
        "Foundations of Coding 1",
      ],
      { message: "Please select a course" }
    ),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    leadName: z.string().min(1, "Lead tutor name is required"),
    leadContact: z
      .string()
      .min(1, "Lead tutor contact is required")
      .regex(/^\d+$/, "Contact must contain digits only"),
    assistantName: z.string().optional(),
    communicatedTo: z
      .string()
      .min(1, "Please enter who the promotion was communicated to"),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      return data.endTime > data.startTime;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

export type PromotionFormValues = z.infer<typeof promotionSchema>;
