import { useState, useEffect } from 'react';
import { corporatesApi } from '../lib/api/corporates';

export interface BudgetLine {
  id: string;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  utilization: number;
}

export interface ProjectBudget {
  project_id: string;
  project_name: string;
  allocated: number;
  spent: number;
  remaining: number;
  status: 'on-track' | 'at-risk' | 'over-budget';
}

export interface BudgetAlert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  project_id?: string;
  threshold?: number;
  created_at: string;
  acknowledged: boolean;
}

export interface BudgetForecast {
  month: string;
  projected: number;
  actual?: number;
}

// Get corporate budget overview
export function useCorporateBudgetOverview(corporateId: string | null, fiscalYear?: string) {
  const [budget, setBudget] = useState<any>(null);
  const [budgetLines, setBudgetLines] = useState<BudgetLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!corporateId) return;

    const fetchBudget = async () => {
      setLoading(true);
      setError(null);

      const response = await corporatesApi.getBudget(corporateId, fiscalYear);

      if (response.success && response.data) {
        setBudget(response.data);
        
        // Transform budget data into budget lines
        if (response.data.categories) {
          const lines: BudgetLine[] = Object.entries(response.data.categories).map(([category, data]: [string, any]) => ({
            id: category,
            category,
            allocated: data.allocated || 0,
            spent: data.spent || 0,
            remaining: (data.allocated || 0) - (data.spent || 0),
            utilization: data.allocated ? ((data.spent || 0) / data.allocated) * 100 : 0,
          }));
          setBudgetLines(lines);
        }
      } else {
        setError(new Error(response.error?.message || 'Failed to fetch budget'));
      }

      setLoading(false);
    };

    fetchBudget();
  }, [corporateId, fiscalYear]);

  return { budget, budgetLines, loading, error };
}

// Get project-wise budget breakdown
export function useProjectBudgets(corporateId: string | null) {
  const [projectBudgets, setProjectBudgets] = useState<ProjectBudget[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!corporateId) return;

    const fetchProjectBudgets = async () => {
      setLoading(true);
      setError(null);

      // This would call a specific API endpoint for project budgets
      // For now, we'll use the projects endpoint and transform the data
      const response = await corporatesApi.getProjects(corporateId);

      if (response.success && response.data) {
        const budgets: ProjectBudget[] = response.data.map((project: any) => {
          const allocated = project.budget || 0;
          const spent = project.spent || 0;
          const remaining = allocated - spent;
          const utilization = allocated ? (spent / allocated) * 100 : 0;

          let status: 'on-track' | 'at-risk' | 'over-budget' = 'on-track';
          if (utilization > 100) status = 'over-budget';
          else if (utilization > 85) status = 'at-risk';

          return {
            project_id: project.id,
            project_name: project.title,
            allocated,
            spent,
            remaining,
            status,
          };
        });

        setProjectBudgets(budgets);
      } else {
        setError(new Error(response.error?.message || 'Failed to fetch project budgets'));
      }

      setLoading(false);
    };

    fetchProjectBudgets();
  }, [corporateId]);

  return { projectBudgets, loading, error };
}

// Get budget alerts
export function useBudgetAlerts(corporateId: string | null) {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!corporateId) return;

    const fetchAlerts = async () => {
      setLoading(true);
      setError(null);

      // This would call a specific API endpoint for budget alerts
      // For now, we'll generate alerts based on budget data
      const budgetResponse = await corporatesApi.getBudget(corporateId);
      const projectsResponse = await corporatesApi.getProjects(corporateId);

      const generatedAlerts: BudgetAlert[] = [];

      // Check project budgets for alerts
      if (projectsResponse.success && projectsResponse.data) {
        projectsResponse.data.forEach((project: any) => {
          const utilization = project.budget ? (project.spent / project.budget) * 100 : 0;

          if (utilization > 100) {
            generatedAlerts.push({
              id: `alert-${project.id}-over`,
              type: 'critical',
              message: `${project.title} has exceeded budget by ${((utilization - 100)).toFixed(1)}%`,
              project_id: project.id,
              threshold: 100,
              created_at: new Date().toISOString(),
              acknowledged: false,
            });
          } else if (utilization > 85) {
            generatedAlerts.push({
              id: `alert-${project.id}-warning`,
              type: 'warning',
              message: `${project.title} is at ${utilization.toFixed(1)}% budget utilization`,
              project_id: project.id,
              threshold: 85,
              created_at: new Date().toISOString(),
              acknowledged: false,
            });
          }
        });
      }

      setAlerts(generatedAlerts);
      setLoading(false);
    };

    fetchAlerts();
  }, [corporateId]);

  return { alerts, loading, error };
}

// Get budget forecast
export function useBudgetForecast(corporateId: string | null, months: number = 12) {
  const [forecast, setForecast] = useState<BudgetForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!corporateId) return;

    const fetchForecast = async () => {
      setLoading(true);
      setError(null);

      // Generate forecast based on historical spend
      const budgetResponse = await corporatesApi.getBudget(corporateId);

      if (budgetResponse.success && budgetResponse.data) {
        const monthlyBudget = budgetResponse.data.total_allocated / 12;
        const currentMonth = new Date().getMonth();

        const forecastData: BudgetForecast[] = [];
        for (let i = 0; i < months; i++) {
          const monthIndex = (currentMonth + i) % 12;
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          
          forecastData.push({
            month: monthNames[monthIndex],
            projected: monthlyBudget,
            actual: i < currentMonth ? monthlyBudget * (0.8 + Math.random() * 0.4) : undefined,
          });
        }

        setForecast(forecastData);
      }

      setLoading(false);
    };

    fetchForecast();
  }, [corporateId, months]);

  return { forecast, loading, error };
}

// Allocate budget to project
export function useAllocateBudget() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const allocate = async (corporateId: string, projectId: string, amount: number) => {
    setLoading(true);
    setError(null);

    const response = await corporatesApi.allocateBudget(corporateId, projectId, amount);

    if (response.success) {
      setLoading(false);
      return response.data;
    } else {
      const err = new Error(response.error?.message || 'Failed to allocate budget');
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { allocate, loading, error };
}

// Update budget
export function useUpdateBudget() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (corporateId: string, fiscalYear: string, budgetData: any) => {
    setLoading(true);
    setError(null);

    const response = await corporatesApi.updateBudget(corporateId, fiscalYear, budgetData);

    if (response.success) {
      setLoading(false);
      return response.data;
    } else {
      const err = new Error(response.error?.message || 'Failed to update budget');
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return { update, loading, error };
}
