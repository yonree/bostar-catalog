type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

export type LeadSlaConfig = {
  timeZone: string;
  workdays: Set<number>;
  startMinutes: number;
  endMinutes: number;
  slaMinutes: number;
  holidays: Set<string>;
  primaryAssignee: string;
  backupAssignee: string;
  escalationAssignee: string;
};

export type LeadSlaSnapshot = {
  dueAt: Date;
  startedAt: Date;
  config: {
    timeZone: string;
    workdays: number[];
    startMinutes: number;
    endMinutes: number;
    slaMinutes: number;
    holidays: string[];
  };
};

function getZonedParts(date: Date, timeZone: string): ZonedParts {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const parts = formatter.formatToParts(date);
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(lookup.year),
    month: Number(lookup.month),
    day: Number(lookup.day),
    hour: Number(lookup.hour),
    minute: Number(lookup.minute),
    second: Number(lookup.second),
  };
}

function getOffsetMs(date: Date, timeZone: string) {
  const parts = getZonedParts(date, timeZone);
  const utcFromParts = Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second
  );
  return utcFromParts - date.getTime();
}

function zonedDateTimeToUtc(timeZone: string, parts: ZonedParts) {
  const wallTime = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
  let guess = wallTime;

  for (let index = 0; index < 4; index += 1) {
    const nextGuess = wallTime - getOffsetMs(new Date(guess), timeZone);
    if (nextGuess === guess) {
      break;
    }
    guess = nextGuess;
  }

  return new Date(guess);
}

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function isBusinessDate(year: number, month: number, day: number, config: LeadSlaConfig) {
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  const normalizedWeekday = weekday === 0 ? 7 : weekday;
  return config.workdays.has(normalizedWeekday) && !config.holidays.has(toDateKey(year, month, day));
}

function toMinutes(hour: number, minute: number) {
  return hour * 60 + minute;
}

function buildStartDate(year: number, month: number, day: number, config: LeadSlaConfig) {
  return zonedDateTimeToUtc(config.timeZone, {
    year,
    month,
    day,
    hour: Math.floor(config.startMinutes / 60),
    minute: config.startMinutes % 60,
    second: 0,
  });
}

function buildEndDate(year: number, month: number, day: number, config: LeadSlaConfig) {
  return zonedDateTimeToUtc(config.timeZone, {
    year,
    month,
    day,
    hour: Math.floor(config.endMinutes / 60),
    minute: config.endMinutes % 60,
    second: 0,
  });
}

function nextBusinessDayStart(date: Date, config: LeadSlaConfig) {
  const parts = getZonedParts(date, config.timeZone);
  const cursor = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));

  for (let index = 0; index < 370; index += 1) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const year = cursor.getUTCFullYear();
    const month = cursor.getUTCMonth() + 1;
    const day = cursor.getUTCDate();

    if (isBusinessDate(year, month, day, config)) {
      return buildStartDate(year, month, day, config);
    }
  }

  throw new Error('Unable to find next business day within one year');
}

function clampToBusinessWindow(date: Date, config: LeadSlaConfig) {
  const parts = getZonedParts(date, config.timeZone);
  const minutes = toMinutes(parts.hour, parts.minute);

  if (!isBusinessDate(parts.year, parts.month, parts.day, config)) {
    return nextBusinessDayStart(date, config);
  }

  if (minutes < config.startMinutes) {
    return buildStartDate(parts.year, parts.month, parts.day, config);
  }

  if (minutes >= config.endMinutes) {
    return nextBusinessDayStart(date, config);
  }

  return date;
}

function addBusinessMinutes(start: Date, minutes: number, config: LeadSlaConfig) {
  let cursor = clampToBusinessWindow(start, config);
  let remaining = minutes;

  while (remaining > 0) {
    const parts = getZonedParts(cursor, config.timeZone);
    const endOfDay = buildEndDate(parts.year, parts.month, parts.day, config);
    const available = Math.max(0, Math.floor((endOfDay.getTime() - cursor.getTime()) / 60000));

    if (remaining <= available) {
      return new Date(cursor.getTime() + remaining * 60_000);
    }

    remaining -= available;
    cursor = nextBusinessDayStart(new Date(endOfDay.getTime() + 60_000), config);
  }

  return cursor;
}

function parseWorkdays(value: string | undefined) {
  const raw = value || '1,2,3,4,5';
  const items = raw
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((item) => item >= 1 && item <= 7);
  return new Set(items.length ? items : [1, 2, 3, 4, 5]);
}

function parseClockMinutes(hours: string | undefined, minutes: string | undefined, fallback: number) {
  const parsedHours = Number(hours);
  const parsedMinutes = Number(minutes);

  if (Number.isInteger(parsedHours) && Number.isInteger(parsedMinutes)) {
    return parsedHours * 60 + parsedMinutes;
  }

  return fallback;
}

function parseHolidaySet(value: string | undefined) {
  return new Set(
    (value || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

export function getLeadSlaConfig(): LeadSlaConfig {
  return {
    timeZone: process.env.SLA_TIMEZONE || 'Asia/Shanghai',
    workdays: parseWorkdays(process.env.SLA_WORKDAYS),
    startMinutes: parseClockMinutes(process.env.SLA_START_HOUR, process.env.SLA_START_MINUTE, 8 * 60 + 30),
    endMinutes: parseClockMinutes(process.env.SLA_END_HOUR, process.env.SLA_END_MINUTE, 18 * 60),
    slaMinutes: Number(process.env.SLA_MINUTES || 30),
    holidays: parseHolidaySet(process.env.SLA_HOLIDAYS),
    primaryAssignee: process.env.DEFAULT_CN_SALES || 'cn-sales',
    backupAssignee: process.env.DEFAULT_BACKUP_ASSIGNEE || 'sales-backup',
    escalationAssignee: process.env.DEFAULT_SLA_ESCALATION || 'sales-manager',
  };
}

export function buildLeadSlaSnapshot(submittedAt: Date, config = getLeadSlaConfig()): LeadSlaSnapshot {
  const startedAt = clampToBusinessWindow(submittedAt, config);
  const dueAt = addBusinessMinutes(startedAt, config.slaMinutes, config);
  return {
    dueAt,
    startedAt,
    config: {
      timeZone: config.timeZone,
      workdays: [...config.workdays],
      startMinutes: config.startMinutes,
      endMinutes: config.endMinutes,
      slaMinutes: config.slaMinutes,
      holidays: [...config.holidays],
    },
  };
}

export function evaluateLeadTimeout(dueAt: Date | null, firstResponseAt: Date | null, now = new Date()) {
  if (!dueAt) {
    return { timedOut: false, timedOutAt: null as Date | null };
  }

  if (firstResponseAt) {
    return {
      timedOut: firstResponseAt.getTime() > dueAt.getTime(),
      timedOutAt: firstResponseAt.getTime() > dueAt.getTime() ? firstResponseAt : null,
    };
  }

  return {
    timedOut: now.getTime() > dueAt.getTime(),
    timedOutAt: now.getTime() > dueAt.getTime() ? now : null,
  };
}
