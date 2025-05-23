import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import Store from "./redux/store.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";  
import { CourseFormProvider } from "./components/context/CourseFormContext.tsx";

const GOOGLE_CLIENT_ID =import.meta.env.VITE_GOOGLE_CLIENT_ID


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CourseFormProvider>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>  
      <Provider store={Store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
    </CourseFormProvider>
  </StrictMode>
);
