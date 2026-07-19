import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import { reducers } from "./reducers";

const logger = createLogger({
  collapsed: true,
});

export default configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: false,
    });

    if (process.env.ENV_NODE === "development") {
      middlewares.push(logger); // Solo agregar el logger en desarrollo
    }

    return middlewares;
  },
});
