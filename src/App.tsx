import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { RealtimeProvider } from "./contexts/RealtimeContext";
import { QueryProvider } from "./contexts/QueryProvider";
import { CSRFProvider } from "./contexts/CSRFContext";
import { ErrorBoundary } from "./components/errors/ErrorBoundary";
import { AppContent } from "./AppContent";

export default function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <CSRFProvider>
          <AuthProvider>
            <RealtimeProvider>
              <AppContent />
            </RealtimeProvider>
          </AuthProvider>
        </CSRFProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}