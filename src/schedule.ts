export type TimeRange = {
  start: Date;
  end: Date;
};

export type Appointment = TimeRange & {
  id: string;
  professionalId: string;
};

export class InvalidRangeError extends Error {
  constructor() {
    super("O horário de fim precisa ser depois do início.");
    this.name = "InvalidRangeError";
  }
}

export function assertValidRange(range: TimeRange): void {
  if (range.end.getTime() <= range.start.getTime()) {
    throw new InvalidRangeError();
  }
}

export function rangesOverlap(left: TimeRange, right: TimeRange): boolean {
  assertValidRange(left);
  assertValidRange(right);
  return left.start < right.end && right.start < left.end;
}

export function hasConflict(
  existing: readonly Appointment[],
  requested: TimeRange & { professionalId: string },
): boolean {
  assertValidRange(requested);
  return existing.some(
    (appointment) =>
      appointment.professionalId === requested.professionalId &&
      rangesOverlap(appointment, requested),
  );
}
