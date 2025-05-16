export type TimezoneOption = {
    value: string;
    name: string;
}

export const timezoneOptions: TimezoneOption[] = [
    { value: "UTC", name: "UTC" },
    { value: "Europe/London", name: "London (UTC+0)" },
    { value: "Europe/Paris", name: "Paris (UTC+1)" },
    { value: "Europe/Madrid", name: "Madrid (UTC+1)" },
    { value: "Europe/Berlin", name: "Berlin (UTC+1)" },
    { value: "Europe/Helsinki", name: "Helsinki (UTC+2)" },
    { value: "Europe/Istanbul", name: "Istanbul (UTC+3)" },
    { value: "Africa/Cairo", name: "Cairo (UTC+2)" },
    { value: "Asia/Dubai", name: "Dubai (UTC+4)" },
    { value: "Asia/Kolkata", name: "India Standard Time (UTC+5:30)" },
    { value: "Asia/Singapore", name: "Singapore (UTC+8)" },
    { value: "Asia/Tokyo", name: "Tokyo (UTC+9)" },
    { value: "Australia/Sydney", name: "Sydney (UTC+10)" },
    { value: "America/Sao_Paulo", name: "São Paulo (UTC-3)" },
    { value: "America/New_York", name: "New York (UTC-5)" },
    { value: "America/Chicago", name: "Chicago (UTC-6)" },
    { value: "America/Denver", name: "Denver (UTC-7)" },
    { value: "America/Los_Angeles", name: "Los Angeles (UTC-8)" },
    { value: "Pacific/Auckland", name: "Auckland (UTC+12)" },
  ];