import { supabase } from '../supabase';
import { PostgrestError } from '@supabase/supabase-js';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class ApiError extends Error {
  code: string;
  statusCode?: number;

  constructor(message: string, code: string = 'API_ERROR', statusCode?: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function handleSupabaseError(error: PostgrestError | null): ApiError {
  if (!error) {
    return new ApiError('Unknown error occurred', 'UNKNOWN_ERROR');
  }

  const errorMap: Record<string, string> = {
    '23505': 'This record already exists.',
    '23503': 'Cannot delete: record is referenced by other data.',
    '42501': 'You do not have permission to perform this action.',
    'PGRST116': 'No data found.',
  };

  const message = errorMap[error.code] || error.message || 'An error occurred';
  return new ApiError(message, error.code, 400);
}

export async function wrapApiCall<T>(
  apiCall: Promise<{ data: T | null; error: PostgrestError | null }>
): Promise<ApiResponse<T>> {
  try {
    const { data, error } = await apiCall;

    if (error) {
      const apiError = handleSupabaseError(error);
      return {
        success: false,
        error: apiError.message,
        code: apiError.code,
      };
    }

    return {
      success: true,
      data: data as T,
    };
  } catch (error: any) {
    console.error('API call failed:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      code: 'NETWORK_ERROR',
    };
  }
}

export async function withPagination<T>(
  query: any,
  params: PaginationParams = {}
): Promise<ApiResponse<PaginatedResponse<T>>> {
  const { page = 1, limit = 10, sortBy, sortOrder = 'desc' } = params;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // Get total count
    const { count } = await query.select('*', { count: 'exact', head: true });

    // Get paginated data
    let dataQuery = query.range(from, to);

    if (sortBy) {
      dataQuery = dataQuery.order(sortBy, { ascending: sortOrder === 'asc' });
    }

    const { data, error } = await dataQuery;

    if (error) {
      const apiError = handleSupabaseError(error);
      return {
        success: false,
        error: apiError.message,
        code: apiError.code,
      };
    }

    return {
      success: true,
      data: {
        data: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error: any) {
    console.error('Pagination failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch paginated data',
      code: 'PAGINATION_ERROR',
    };
  }
}

export function getCurrentUserId(): string | null {
  return supabase.auth.getUser().then(({ data }) => data.user?.id || null);
}

export async function checkPermission(
  resource: string,
  action: 'create' | 'read' | 'update' | 'delete'
): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  // Get user role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single();

  if (!profile) return false;

  // Permission matrix
  const permissions: Record<string, Record<string, string[]>> = {
    projects: {
      create: ['admin', 'corporate'],
      read: ['admin', 'corporate', 'ngo', 'volunteer'],
      update: ['admin', 'corporate'],
      delete: ['admin'],
    },
    ngos: {
      create: ['admin', 'ngo'],
      read: ['admin', 'corporate', 'ngo', 'volunteer'],
      update: ['admin', 'ngo'],
      delete: ['admin'],
    },
    volunteers: {
      create: ['admin', 'volunteer'],
      read: ['admin', 'corporate', 'ngo'],
      update: ['admin', 'volunteer'],
      delete: ['admin', 'volunteer'],
    },
  };

  const allowedRoles = permissions[resource]?.[action] || [];
  return allowedRoles.includes(profile.role);
}
