import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { RealtimeProvider } from "./contexts/RealtimeContext";
import { QueryProvider } from "./contexts/QueryProvider";
import { CSRFProvider } from "./contexts/CSRFContext";
import { SessionTimeoutProvider } from "./contexts/SessionTimeoutContext";
import { ErrorBoundary } from "./components/errors/ErrorBoundary";
import { AppContent } from "./AppContent";
import { SessionTimeoutWarningModal } from "./components/security/SessionTimeoutWarningModal";

export default function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <CSRFProvider>
          <AuthProvider>
            <SessionTimeoutProvider>
              <RealtimeProvider>
                <AppContent />
                <SessionTimeoutWarningModal />
              </RealtimeProvider>
            </SessionTimeoutProvider>
          </AuthProvider>
        </CSRFProvider>
      </QueryProvider>
    </ErrorBoundary>
  );
}