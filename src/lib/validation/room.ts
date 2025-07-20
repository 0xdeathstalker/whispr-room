import { z } from "zod";

export const formSchema = z.object({
  username: z.string().min(3, { message: "username should be atleast 3 characters" }),
  roomId: z.string().length(6, { message: "roomId should be 6 characters" }).optional().or(z.literal("")),
});

export type FormValues = z.infer<typeof formSchema>;
