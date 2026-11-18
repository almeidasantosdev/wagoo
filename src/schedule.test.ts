import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { InvalidRangeError, hasConflict, type Appointment } from "./schedule.ts";

const at = (hour: number, minute = 0) => new Date(2026, 2, 18, hour, minute);

const agenda: Appointment[] = [
  {
    id: "a1",
    professionalId: "ana",
    start: at(9),
    end: at(10),
  },
  {
    id: "a2",
    professionalId: "bruno",
    start: at(9),
    end: at(10),
  },
];

describe("hasConflict", () => {
  it("recusa um horário que invade outro do mesmo profissional", () => {
    const conflict = hasConflict(agenda, {
      professionalId: "ana",
      start: at(9, 30),
      end: at(10, 30),
    });
    assert.equal(conflict, true);
  });

  it("permite o mesmo horário para outro profissional", () => {
    const conflict = hasConflict(agenda, {
      professionalId: "carla",
      start: at(9),
      end: at(10),
    });
    assert.equal(conflict, false);
  });

  it("permite um horário que começa quando o anterior termina", () => {
    const conflict = hasConflict(agenda, {
      professionalId: "ana",
      start: at(10),
      end: at(11),
    });
    assert.equal(conflict, false);
  });

  it("rejeita um intervalo invertido", () => {
    assert.throws(
      () =>
        hasConflict(agenda, {
          professionalId: "ana",
          start: at(11),
          end: at(10),
        }),
      InvalidRangeError,
    );
  });
});
