"use server";

import type { ActionResult } from "@/core/types";
import {
  createNamedNodeSchema,
  renameNodeSchema,
  setNodeActiveSchema,
} from "../schemas";
import { createBlock, renameBlock, setBlockActive } from "../services";
import { runStructureAction } from "./run-structure-action";

export async function createBlockAction(
  input: unknown,
): Promise<ActionResult> {
  return runStructureAction(
    input,
    createNamedNodeSchema,
    createBlock,
    "createBlockAction",
  );
}

export async function renameBlockAction(
  input: unknown,
): Promise<ActionResult> {
  return runStructureAction(
    input,
    renameNodeSchema,
    renameBlock,
    "renameBlockAction",
  );
}

export async function setBlockActiveAction(
  input: unknown,
): Promise<ActionResult> {
  return runStructureAction(
    input,
    setNodeActiveSchema,
    setBlockActive,
    "setBlockActiveAction",
  );
}
