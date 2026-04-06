import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);

export function formatDate(dateString: string, format?: string): string {
  return dayjs(dateString.toString()).format(
    format ?? "dddd, MMMM Do, YYYY h:mm A"
  );
}
