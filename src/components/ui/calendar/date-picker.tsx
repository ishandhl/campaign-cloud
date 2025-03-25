
import * as React from "react";
import { Calendar } from "@/components/ui/calendar";

type DatePickerProps = React.ComponentProps<typeof Calendar>;

export const DatePicker: React.FC<DatePickerProps> = (props) => {
  return <Calendar {...props} />;
};
