import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

export default function RoomIdInput(props: { value: string | undefined; onChange: (...event: unknown[]) => void }) {
  return (
    <InputOTP
      value={props.value ?? ""}
      onChange={props.onChange}
      maxLength={6}
      pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
    >
      <InputOTPGroup>
        <InputOTPSlot index={0} />
        <InputOTPSlot index={1} />
        <InputOTPSlot index={2} />
        <InputOTPSlot index={3} />
        <InputOTPSlot index={4} />
        <InputOTPSlot index={5} />
      </InputOTPGroup>
    </InputOTP>
  );
}
