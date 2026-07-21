"use server";

import type { ActionResult } from "@/core/types";
import {
  createNamedNodeSchema,
  renameNodeSchema,
  setNodeActiveSchema,
} from "../schemas";
import { createStreet, renameStreet, setStreetActive } from "../services";
import { runStructureAction } from "./run-structure-action";

export async function createStreetAction(
  input: unknown,
): Promise<ActionResult> {
  return runStructureAction(
    input,
    createNamedNodeSchema,
    createStreet,
    "createStreetAction",
  );
}

export async function renameStreetAction(
  input: unknown,
): Promise<ActionResult> {
  return runStructureAction(
    input,
    renameNodeSchema,
    renameStreet,
    "renameStreetAction",
  );
}

export async function setStreetActiveAction(
  input: unknown,
): Promise<ActionResult> {
  return runStructureAction(
    input,
    setNodeActiveSchema,
    setStreetActive,
    "setStreetActiveAction",
  );
}
