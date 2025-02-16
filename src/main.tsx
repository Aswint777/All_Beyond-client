import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import Store from "./redux/store.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";  // ✅ Import GoogleOAuthProvider

// const GOOGLE_CLIENT_ID =import.meta.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID ='956821900591-i31njk0p3huehn01pcl8a7mqcl1n94h2.apps.googleusercontent.com'


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>  {/* ✅ Wrap your app */}
      <Provider store={Store}>
        <App />
      </Provider>
    </GoogleOAuthProvider>
  </StrictMode>
);
