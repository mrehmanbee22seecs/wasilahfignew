import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalVolunteers: number;
  totalNGOs: number;
  totalBudget: number;
  [key: string]: number;
}

export function useRealtimeDashboard(userId: string | null, role: string | null) {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalVolunteers: 0,
    totalNGOs: 0,
    totalBudget: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !role) {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      setLoading(true);

      try {
        switch (role) {
          case 'corporate':
            await fetchCorporateStats(userId);
            break;
          case 'ngo':
            await fetchNGOStats(userId);
            break;
          case 'volunteer':
            await fetchVolunteerStats(userId);
            break;
          case 'admin':
            await fetchAdminStats();
            break;
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();

    // Subscribe to real-time updates
    const subscriptions: any[] = [];

    if (role === 'corporate' || role === 'admin') {
      const projectSub = supabase
        .channel('projects_stats')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
          fetchStats();
        })
        .subscribe();
      subscriptions.push(projectSub);
    }

    if (role === 'volunteer' || role === 'admin') {
      const appSub = supabase
        .channel('applications_stats')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'volunteer_applications' }, () => {
          fetchStats();
        })
        .subscribe();
      subscriptions.push(appSub);
    }

    return () => {
      subscriptions.forEach((sub) => supabase.removeChannel(sub));
    };
  }, [userId, role]);

  const fetchCorporateStats = async (corporateId: string) => {
    const { data: projects } = await supabase
      .from('projects')
      .select('id, status, budget')
      .eq('corporate_id', corporateId);

    if (projects) {
      setStats({
        totalProjects: projects.length,
        activeProjects: projects.filter((p) => p.status === 'active').length,
        totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
        totalVolunteers: 0,
        totalNGOs: 0,
      });
    }
  };

  const fetchNGOStats = async (ngoId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('organization_id')
      .eq('id', ngoId)
      .single();

    if (profile?.organization_id) {
      const { data: projects } = await supabase
        .from('projects')
        .select('id, status')
        .eq('ngo_id', profile.organization_id);

      if (projects) {
        setStats({
          totalProjects: projects.length,
          activeProjects: projects.filter((p) => p.status === 'active').length,
          totalBudget: 0,
          totalVolunteers: 0,
          totalNGOs: 0,
        });
      }
    }
  };

  const fetchVolunteerStats = async (volunteerId: string) => {
    const { data: applications } = await supabase
      .from('volunteer_applications')
      .select('id, status')
      .eq('volunteer_id', volunteerId);

    const { data: hours } = await supabase
      .from('volunteer_hours')
      .select('hours')
      .eq('volunteer_id', volunteerId)
      .eq('status', 'approved');

    const totalHours = hours?.reduce((sum, h) => sum + h.hours, 0) || 0;

    setStats({
      totalProjects: applications?.filter((a) => a.status === 'approved').length || 0,
      activeProjects: applications?.filter((a) => a.status === 'pending').length || 0,
      totalBudget: 0,
      totalVolunteers: 0,
      totalNGOs: 0,
      totalHours,
    });
  };

  const fetchAdminStats = async () => {
    const [projectsRes, ngosRes, volunteersRes] = await Promise.all([
      supabase.from('projects').select('id, status, budget'),
      supabase.from('organizations').select('id').eq('type', 'ngo'),
      supabase.from('profiles').select('id').eq('role', 'volunteer'),
    ]);

    const projects = projectsRes.data || [];
    const ngos = ngosRes.data || [];
    const volunteers = volunteersRes.data || [];

    setStats({
      totalProjects: projects.length,
      activeProjects: projects.filter((p) => p.status === 'active').length,
      totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
      totalNGOs: ngos.length,
      totalVolunteers: volunteers.length,
    });
  };

  return { stats, loading };
}
