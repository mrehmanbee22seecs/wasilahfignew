/**
 * Cursor-based Pagination Utility
 * Implements cursor pagination for opportunities list
 */

import type { PaginatedResponse, PaginationCursor } from '../types/volunteer';

export const PAGE_SIZE = 20;

/**
 * Encode cursor from last item ID
 */
export function encodeCursor(lastItemId: string): string {
  return btoa(JSON.stringify({ id: lastItemId, timestamp: Date.now() }));
}

/**
 * Decode cursor to get last item ID
 */
export function decodeCursor(cursor: string): { id: string; timestamp: number } | null {
  try {
    return JSON.parse(atob(cursor));
  } catch (error) {
    console.error('Invalid cursor:', error);
    return null;
  }
}

/**
 * Paginate an array using cursor
 */
export function paginateArray<T extends { id: string }>(
  items: T[],
  cursor?: string,
  limit: number = PAGE_SIZE
): PaginatedResponse<T> {
  let startIndex = 0;

  // If cursor provided, find the starting point
  if (cursor) {
    const decoded = decodeCursor(cursor);
    if (decoded) {
      const cursorIndex = items.findIndex((item) => item.id === decoded.id);
      if (cursorIndex !== -1) {
        startIndex = cursorIndex + 1; // Start after the cursor item
      }
    }
  }

  // Get page of items
  const page = items.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < items.length;

  // Generate next cursor if there are more items
  const nextCursor = hasMore && page.length > 0 ? encodeCursor(page[page.length - 1].id) : undefined;

  return {
    data: page,
    pagination: {
      cursor: nextCursor,
      hasMore,
      total: items.length,
    },
  };
}

/**
 * Mock API call for opportunities with cursor pagination
 * In production, replace with actual Supabase query
 */
export async function fetchOpportunitiesPage<T extends { id: string }>(
  allItems: T[],
  cursor?: string,
  limit: number = PAGE_SIZE
): Promise<PaginatedResponse<T>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  return paginateArray(allItems, cursor, limit);
}

/**
 * Example Supabase query with cursor pagination
 * 
 * ```typescript
 * export async function fetchOpportunitiesFromSupabase(
 *   cursor?: string,
 *   limit: number = 20,
 *   filters?: ActiveFilters
 * ): Promise<PaginatedResponse<Opportunity>> {
 *   let query = supabase
 *     .from('opportunities')
 *     .select('*')
 *     .eq('status', 'open')
 *     .order('created_at', { ascending: false });
 * 
 *   // Apply filters
 *   if (filters?.category) {
 *     query = query.eq('category', filters.category);
 *   }
 *   if (filters?.location) {
 *     query = query.ilike('location', `%${filters.location}%`);
 *   }
 *   if (filters?.sdgs && filters.sdgs.length > 0) {
 *     query = query.overlaps('sdg_ids', filters.sdgs);
 *   }
 * 
 *   // Apply cursor
 *   if (cursor) {
 *     const decoded = decodeCursor(cursor);
 *     if (decoded) {
 *       query = query.lt('created_at', decoded.timestamp);
 *     }
 *   }
 * 
 *   // Fetch one extra to check if there are more
 *   query = query.limit(limit + 1);
 * 
 *   const { data, error } = await query;
 * 
 *   if (error) throw error;
 * 
 *   const hasMore = data.length > limit;
 *   const items = hasMore ? data.slice(0, limit) : data;
 *   const nextCursor = hasMore && items.length > 0 
 *     ? encodeCursor(items[items.length - 1].id) 
 *     : undefined;
 * 
 *   return {
 *     data: items,
 *     pagination: {
 *       cursor: nextCursor,
 *       hasMore,
 *     },
 *   };
 * }
 * ```
 */
