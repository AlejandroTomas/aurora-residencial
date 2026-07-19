"use client";

import { useCallback, useState } from "react";

export interface UseDisclosureProps {
  defaultIsOpen?: boolean;
}

export interface UseDisclosureReturn {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  getButtonProps: (props?: any) => any;
  getDisclosureProps: (props?: any) => any;
}

export function useDisclosure(
  props: UseDisclosureProps = {}
): UseDisclosureReturn {
  const { defaultIsOpen = false } = props;
  const [isOpen, setIsOpen] = useState(defaultIsOpen);

  const onOpen = useCallback(() => setIsOpen(true), []);
  const onClose = useCallback(() => setIsOpen(false), []);
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const getButtonProps = useCallback(
    (props: any = {}) => ({
      ...props,
      "aria-expanded": isOpen,
      "aria-controls": "disclosure-content",
      onClick: (event: any) => {
        props?.onClick?.(event);
        onToggle();
      },
    }),
    [isOpen, onToggle]
  );

  const getDisclosureProps = useCallback(
    (props: any = {}) => ({
      ...props,
      hidden: !isOpen,
      id: "disclosure-content",
    }),
    [isOpen]
  );

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle,
    getButtonProps,
    getDisclosureProps,
  };
}
