import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { RealtimeProvider } from "./contexts/RealtimeContext";
import { QueryProvider } from "./contexts/QueryProvider";
import { ErrorBoundary } from "./components/errors/ErrorBoundary";
import { AppContent } from "./AppContent";

export default function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AuthProvider>
          <RealtimeProvider>
            <AppContent />
          </RealtimeProvider>
        </AuthProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}