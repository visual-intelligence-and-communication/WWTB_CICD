import { DATE_LOCALE, DATE_VARIANT_OPTIONS } from "@/constants/date/format";

const formatDate = (date, variant = "short") =>
  (new Intl.DateTimeFormat(DATE_LOCALE, DATE_VARIANT_OPTIONS[variant]).format(
    date
  ));

export default formatDate;
