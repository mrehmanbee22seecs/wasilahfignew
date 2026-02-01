/**
 * Rate Limited Mutation Hook
 * 
 * Higher-order hook that wraps React Query mutations with rate limiting
 * Integrates rate limiting checks before mutation execution
 * Provides user-friendly error messages when rate limits are exceeded
 */

import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { useAuth } from '../../contexts/AuthContext';
import { 
  checkRateLimit, 
  recordAttempt, 
  getIdentifier,
  RateLimitResult 
} from '../rateLimit/rateLimiter';
import { RateLimitError } from '../errors/types';

// =====================================================
// TYPES
// =====================================================

interface RateLimitedMutationOptions<TData, TError, TVariables, TContext>
  extends UseMutationOptions<TData, TError, TVariables, TContext> {
  /**
   * Rate limit endpoint key (e.g., 'login', 'createProject')
   */
  rateLimitKey: string;
  
  /**
   * Whether to use user-specific rate limiting
   * If true, uses authenticated user's ID
   * If false, uses IP-based (anonymous) rate limiting
   */
  useUserRateLimit?: boolean;
  
  /**
   * Custom identifier for rate limiting (overrides email/userId)
   */
  customIdentifier?: string;
}

// =====================================================
// HOOK
// =====================================================

/**
 * Creates a rate-limited mutation hook
 * 
 * @param mutationFn - The mutation function to execute
 * @param options - Mutation options including rate limit configuration
 * @returns Mutation result with rate limiting applied
 * 
 * @example
 * ```tsx
 * const login = useRateLimitedMutation(
 *   (data: LoginData) => authApi.login(data),
 *   {
 *     rateLimitKey: 'login',
 *     useUserRateLimit: false,
 *     onSuccess: (data) => {
 *       console.log('Login successful');
 *     },
 *     onError: (error) => {
 *       if (error instanceof RateLimitError) {
 *         toast.error(error.userMessage);
 *       }
 *     }
 *   }
 * );
 * 
 * // Use it
 * login.mutate({ email, password });
 * ```
 */
export function useRateLimitedMutation<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown
>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: RateLimitedMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError | RateLimitError, TVariables, TContext> {
  const { user } = useAuth();
  const {
    rateLimitKey,
    useUserRateLimit = false,
    customIdentifier,
    onMutate,
    onSuccess,
    onError,
    ...mutationOptions
  } = options;

  return useMutation<TData, TError | RateLimitError, TVariables, TContext>({
    mutationFn: async (variables: TVariables) => {
      // Determine identifier for rate limiting
      let identifier = 'anonymous';
      if (customIdentifier) {
        identifier = customIdentifier;
      } else if (useUserRateLimit && user) {
        identifier = getIdentifier(user.email, user.id);
      } else if (useUserRateLimit && (variables as any)?.email) {
        // For login/signup, use email from variables
        identifier = getIdentifier((variables as any).email);
      }

      // Check rate limit before executing mutation
      const rateLimitCheck = checkRateLimit(rateLimitKey, identifier);
      
      if (!rateLimitCheck.allowed) {
        // Rate limit exceeded - throw error
        const error = new RateLimitError(
          rateLimitCheck.message || 'Too many attempts. Please try again later.',
          rateLimitCheck.retryAfter,
          {
            userMessage: rateLimitCheck.message,
            endpoint: rateLimitKey,
            context: {
              userId: user?.id,
              action: rateLimitKey,
              timestamp: new Date().toISOString(),
              metadata: {
                remainingAttempts: rateLimitCheck.remainingAttempts,
                resetTime: rateLimitCheck.resetTime,
              },
            },
          }
        );
        
        // Record the failed attempt (blocked)
        recordAttempt(rateLimitKey, identifier, false);
        
        throw error;
      }

      // Execute the mutation
      try {
        const result = await mutationFn(variables);
        
        // Record successful attempt
        recordAttempt(rateLimitKey, identifier, true);
        
        return result;
      } catch (error) {
        // Record failed attempt
        recordAttempt(rateLimitKey, identifier, false);
        
        throw error;
      }
    },
    onMutate: async (variables: TVariables) => {
      // Call original onMutate if provided
      if (onMutate) {
        return await onMutate(variables);
      }
      return undefined as TContext;
    },
    onSuccess: (data, variables, context) => {
      // Call original onSuccess if provided
      if (onSuccess) {
        onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      // Handle rate limit errors specially
      if (error instanceof RateLimitError) {
        console.warn('Rate limit exceeded:', {
          endpoint: rateLimitKey,
          retryAfter: error.retryAfter,
          message: error.userMessage,
        });
      }
      
      // Call original onError if provided
      if (onError) {
        onError(error, variables, context);
      }
    },
    ...mutationOptions,
  });
}

// =====================================================
// UTILITY HOOKS
// =====================================================

/**
 * Get current rate limit status for an endpoint
 * 
 * @param endpoint - Rate limit endpoint key
 * @param customIdentifier - Optional custom identifier
 * @returns Current rate limit status
 * 
 * @example
 * ```tsx
 * const loginStatus = useRateLimitStatus('login');
 * 
 * {loginStatus.allowed ? (
 *   <LoginForm />
 * ) : (
 *   <div>Too many attempts. Try again in {loginStatus.retryAfter} seconds.</div>
 * )}
 * ```
 */
export function useRateLimitStatus(
  endpoint: string,
  customIdentifier?: string
): RateLimitResult {
  const { user } = useAuth();
  
  const identifier = customIdentifier || (user ? getIdentifier(user.email, user.id) : 'anonymous');
  
  return checkRateLimit(endpoint, identifier);
}

/**
 * Hook to check if user is currently rate limited for an endpoint
 * 
 * @param endpoint - Rate limit endpoint key
 * @returns true if rate limited, false otherwise
 */
export function useIsRateLimited(endpoint: string): boolean {
  const status = useRateLimitStatus(endpoint);
  return !status.allowed;
}
