import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { RealtimeProvider } from "./contexts/RealtimeContext";
import { ErrorBoundary } from "./components/errors/ErrorBoundary";
import { AppContent } from "./AppContent";

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <RealtimeProvider>
          <AppContent />
        </RealtimeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}