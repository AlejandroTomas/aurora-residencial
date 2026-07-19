export const scrollbarColors = {
  sx: {
    "&::-webkit-scrollbar": {
      width: "10px",
      height: "12px",
      bg: "magenta.50", // Fondo más claro para la barra
    },
    "&::-webkit-scrollbar-thumb": {
      borderRadius: "full",
      bg: "magenta.500", // Color magenta principal
      _hover: {
        bg: "magenta.600", // Efecto hover
      },
    },
    "&::-webkit-scrollbar-track": {
      bg: "magenta.100", // Fondo más claro para el track
      borderRadius: "full",
    },
  },
};

export const URL_API_DEV =
  process.env.ENV_NODE === "development"
    ? "http://localhost:3000"
    : "https://aurora-timer-sage.vercel.app";
