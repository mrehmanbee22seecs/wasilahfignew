import { useState, useEffect } from 'react';
import { useRealtimeSubscription } from './useRealtimeSubscription';
import { Project } from '../lib/api/projects';

export function useRealtimeProjects(initialProjects: Project[] = [], filter?: string) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  const { isConnected } = useRealtimeSubscription<Project>(
    {
      table: 'projects',
      filter: filter,
    },
    {
      onInsert: (newProject) => {
        setProjects((prev) => [newProject, ...prev]);
      },
      onUpdate: (updatedProject) => {
        setProjects((prev) =>
          prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
        );
      },
      onDelete: (deletedProject) => {
        setProjects((prev) => prev.filter((p) => p.id !== deletedProject.id));
      },
    },
    true
  );

  return { projects, isConnected };
}

export function useRealtimeProject(projectId: string | null, initialProject?: Project) {
  const [project, setProject] = useState<Project | null>(initialProject || null);

  useEffect(() => {
    if (initialProject) {
      setProject(initialProject);
    }
  }, [initialProject]);

  const { isConnected } = useRealtimeSubscription<Project>(
    {
      table: 'projects',
      filter: projectId ? `id=eq.${projectId}` : undefined,
    },
    {
      onUpdate: (updatedProject) => {
        setProject(updatedProject);
      },
      onDelete: () => {
        setProject(null);
      },
    },
    !!projectId
  );

  return { project, isConnected };
}
