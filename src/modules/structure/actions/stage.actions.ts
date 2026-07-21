"use server";

import type { ActionResult } from "@/core/types";
import {
  createNamedNodeSchema,
  renameNodeSchema,
  setNodeActiveSchema,
} from "../schemas";
import { createStage, renameStage, setStageActive } from "../services";
import { runStructureAction } from "./run-structure-action";

export async function createStageAction(
  input: unknown,
): Promise<ActionResult> {
  return runStructureAction(
    input,
    createNamedNodeSchema,
    createStage,
    "createStageAction",
  );
}

export async function renameStageAction(
  input: unknown,
): Promise<ActionResult> {
  return runStructureAction(
    input,
    renameNodeSchema,
    renameStage,
    "renameStageAction",
  );
}

export async function setStageActiveAction(
  input: unknown,
): Promise<ActionResult> {
  return runStructureAction(
    input,
    setNodeActiveSchema,
    setStageActive,
    "setStageActiveAction",
  );
}
