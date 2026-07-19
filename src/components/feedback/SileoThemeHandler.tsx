"use client";
import { useTheme } from "next-themes";
import React from "react";
import { sileo, Toaster as ToasterSileo } from "sileo";

const SileoThemeHandler = () => {
  const { theme = "system" } = useTheme();
  return (
    <ToasterSileo
      position="top-right"
      theme={theme as "light" | "dark" | "system"}
      //   options={{
      //     fill: "#171717",
      //     roundness: 16,
      //     styles: {
      //       title: "text-white!",
      //       description: "text-white/75!",
      //       badge: "bg-white/10!",
      //       button: "bg-white/10! hover:bg-white/15!",
      //     },
      //   }}
    />
  );
};

export default SileoThemeHandler;
