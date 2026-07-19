import { DialogOptions } from "@/types";

let showDialogFn: ((options: DialogOptions) => void) | null = null;
let closeDialogFn: (() => void) | null = null;

export const initializeDialog = (
  showFn: (options: DialogOptions) => void,
  closeFn: () => void
) => {
  showDialogFn = showFn;
  closeDialogFn = closeFn;
};

export const showDialog = (options: DialogOptions) => {
  if (!showDialogFn) {
    alert("Dialog service not initialized.");
    console.error("Dialog service not initialized.");
    return;
  }
  showDialogFn(options);
};

export const closeDialog = () => {
  if (!closeDialogFn) {
    console.error("Dialog service not initialized.");
    return;
  }
  closeDialogFn();
};