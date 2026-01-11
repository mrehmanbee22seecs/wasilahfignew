import { useState, useEffect } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { VolunteerApplication } from '../lib/api/volunteers';

export function useRealtimeApplications(
  volunteerId: string | null,
  initialApplications: VolunteerApplication[] = []
) {
  const [applications, setApplications] = useState<VolunteerApplication[]>(initialApplications);

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);

  const { isConnected } = useRealtimeSubscription<VolunteerApplication>(
    {
      table: 'volunteer_applications',
      filter: volunteerId ? `volunteer_id=eq.${volunteerId}` : undefined,
    },
    {
      onInsert: (newApplication) => {
        setApplications((prev) => [newApplication, ...prev]);
      },
      onUpdate: (updatedApplication) => {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === updatedApplication.id ? updatedApplication : app
          )
        );
      },
      onDelete: (deletedApplication) => {
        setApplications((prev) =>
          prev.filter((app) => app.id !== deletedApplication.id)
        );
      },
    },
    !!volunteerId
  );

  return { applications, isConnected };
}

export function useRealtimeProjectApplications(
  projectId: string | null,
  initialApplications: VolunteerApplication[] = []
) {
  const [applications, setApplications] = useState<VolunteerApplication[]>(initialApplications);

  useEffect(() => {
    setApplications(initialApplications);
  }, [initialApplications]);

  const { isConnected } = useRealtimeSubscription<VolunteerApplication>(
    {
      table: 'volunteer_applications',
      filter: projectId ? `project_id=eq.${projectId}` : undefined,
    },
    {
      onInsert: (newApplication) => {
        setApplications((prev) => [newApplication, ...prev]);
      },
      onUpdate: (updatedApplication) => {
        setApplications((prev) =>
          prev.map((app) =>
            app.id === updatedApplication.id ? updatedApplication : app
          )
        );
      },
      onDelete: (deletedApplication) => {
        setApplications((prev) =>
          prev.filter((app) => app.id !== deletedApplication.id)
        );
      },
    },
    !!projectId
  );

  return { applications, isConnected };
}
