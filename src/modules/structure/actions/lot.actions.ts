"use server";

import type { ActionResult } from "@/core/types";
import {
  createLotSchema,
  updateLotSchema,
  setNodeActiveSchema,
} from "../schemas";
import { createLot, updateLot, setLotActive } from "../services";
import { runStructureAction } from "./run-structure-action";

export async function createLotAction(input: unknown): Promise<ActionResult> {
  return runStructureAction(
    input,
    createLotSchema,
    createLot,
    "createLotAction",
  );
}

export async function updateLotAction(input: unknown): Promise<ActionResult> {
  return runStructureAction(
    input,
    updateLotSchema,
    updateLot,
    "updateLotAction",
  );
}

export async function setLotActiveAction(
  input: unknown,
): Promise<ActionResult> {
  return runStructureAction(
    input,
    setNodeActiveSchema,
    setLotActive,
    "setLotActiveAction",
  );
}
