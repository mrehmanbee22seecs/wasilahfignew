/**
 * Quick Start Guide - Skeleton Components
 * 
 * This file provides quick copy-paste examples for common use cases.
 * For complete documentation, see SKELETON_COMPONENTS_README.md
 */

// ============================================================================
// BASIC IMPORTS
// ============================================================================

// Import specific components
import { BaseSkeleton, CardSkeleton, TextSkeleton } from '@/components/skeletons';

// Import all components at once
import * as Skeletons from '@/components/skeletons';

// Import with types
import { CardSkeleton, type CardSkeletonProps } from '@/components/skeletons';


// ============================================================================
// EXAMPLE 1: Loading a List of Project Cards
// ============================================================================

import { ProjectCardSkeleton } from '@/components/skeletons';

function ProjectsList() {
  const { data, isLoading } = useProjects();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <ProjectCardSkeleton key={index} showStats={true} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data?.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}


// ============================================================================
// EXAMPLE 2: Loading a Profile Page
// ============================================================================

import { ProfileSkeleton } from '@/components/skeletons';

function UserProfilePage({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId);

  if (isLoading) {
    return <ProfileSkeleton showStats={true} variant="user" />;
  }

  return <UserProfile user={user} />;
}


// ============================================================================
// EXAMPLE 3: Loading a Data Table
// ============================================================================

import { TableRowSkeleton } from '@/components/skeletons';

function DataTable() {
  const { data, isLoading } = useTableData();

  if (isLoading) {
    return (
      <div className="border border-border rounded-lg overflow-hidden">
        {/* Table header */}
        <div className="bg-muted px-4 py-3 border-b">
          <div className="flex items-center gap-4">
            <div className="w-8">Select</div>
            <div className="flex-1">Name</div>
            <div className="w-32">Status</div>
            <div className="w-32">Date</div>
            <div className="w-20">Actions</div>
          </div>
        </div>
        
        {/* Table body with skeletons */}
        <TableRowSkeleton 
          columns={3} 
          rows={10} 
          showCheckbox={true}
          showActions={true}
        />
      </div>
    );
  }

  return <Table data={data} />;
}


// ============================================================================
// EXAMPLE 4: Loading a Dashboard
// ============================================================================

import { DashboardSkeleton } from '@/components/skeletons';

function NGODashboard() {
  const { data, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <DashboardSkeleton 
        variant="ngo"
        showSidebar={false}
        statCards={4}
      />
    );
  }

  return <Dashboard data={data} />;
}


// ============================================================================
// EXAMPLE 5: Loading a Form
// ============================================================================

import { FormSkeleton } from '@/components/skeletons';

function EditProfileForm() {
  const { data, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <FormSkeleton 
          fields={8} 
          columns={2}
          showSubmit={true}
        />
      </div>
    );
  }

  return <ProfileForm initialData={data} />;
}


// ============================================================================
// EXAMPLE 6: Loading a List with Avatars
// ============================================================================

import { ListSkeleton } from '@/components/skeletons';

function TeamMembersList() {
  const { data, isLoading } = useTeamMembers();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <ListSkeleton 
          variant="avatar" 
          items={5}
          showDivider={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {data?.map(member => (
        <TeamMemberCard key={member.id} member={member} />
      ))}
    </div>
  );
}


// ============================================================================
// EXAMPLE 7: Loading Charts
// ============================================================================

import { ChartSkeleton } from '@/components/skeletons';

function DashboardCharts() {
  const { data, isLoading } = useChartData();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSkeleton type="bar" height={300} showTitle={true} />
        <ChartSkeleton type="line" height={300} showTitle={true} />
        <ChartSkeleton type="pie" height={300} showLegend={true} />
        <ChartSkeleton type="area" height={300} showTitle={true} />
      </div>
    );
  }

  return <Charts data={data} />;
}


// ============================================================================
// EXAMPLE 8: Custom Composite Skeleton
// ============================================================================

import { BaseSkeleton, TextSkeleton, ButtonSkeleton } from '@/components/skeletons';

function CustomLoadingState() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <BaseSkeleton width="200px" height="32px" rounded="md" />
          <BaseSkeleton width="150px" height="16px" rounded="sm" />
        </div>
        <ButtonSkeleton size="lg" width="120px" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 border border-border rounded-lg">
            <BaseSkeleton width="80px" height="14px" rounded="sm" className="mb-2" />
            <BaseSkeleton width="100px" height="28px" rounded="md" className="mb-1" />
            <BaseSkeleton width="60px" height="12px" rounded="sm" />
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="border border-border rounded-lg p-6">
        <BaseSkeleton width="150px" height="20px" rounded="md" className="mb-4" />
        <TextSkeleton lines={5} />
      </div>
    </div>
  );
}


// ============================================================================
// EXAMPLE 9: Conditional Loading with Different States
// ============================================================================

import { CardSkeleton, TextSkeleton } from '@/components/skeletons';

function ContentWithMultipleStates() {
  const { data, isLoading, isError, error } = useContent();

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <CardSkeleton showImage={true} lines={4} />
        <CardSkeleton showImage={true} lines={3} />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="text-center p-8 text-red-600">
        Error: {error?.message}
      </div>
    );
  }

  // Empty state
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No content available
      </div>
    );
  }

  // Success state
  return (
    <div className="space-y-4">
      {data.map(item => (
        <ContentCard key={item.id} item={item} />
      ))}
    </div>
  );
}


// ============================================================================
// EXAMPLE 10: Skeleton with Animation Control
// ============================================================================

import { BaseSkeleton } from '@/components/skeletons';
import { useState } from 'react';

function SkeletonWithControls() {
  const [animation, setAnimation] = useState<'shimmer' | 'pulse' | 'none'>('shimmer');

  return (
    <div className="space-y-4">
      {/* Animation selector */}
      <div className="flex gap-2">
        <button onClick={() => setAnimation('shimmer')}>Shimmer</button>
        <button onClick={() => setAnimation('pulse')}>Pulse</button>
        <button onClick={() => setAnimation('none')}>Static</button>
      </div>

      {/* Skeleton with selected animation */}
      <BaseSkeleton 
        width="100%" 
        height="200px" 
        animation={animation}
        rounded="lg"
      />
    </div>
  );
}


// ============================================================================
// BEST PRACTICES
// ============================================================================

/**
 * 1. Match the skeleton layout to your actual content
 * 2. Use similar grid/flex layouts
 * 3. Keep animation consistent across the app
 * 4. Don't show skeletons for very fast loads (<200ms)
 * 5. Always provide accessible labels
 * 6. Test with network throttling
 * 7. Consider using React Suspense boundaries
 */


// ============================================================================
// TIPS
// ============================================================================

/**
 * - Use Array.from({ length: n }) for repeating skeletons
 * - Wrap skeletons in the same container as real content
 * - Match skeleton count to expected data count when known
 * - Use fragment keys (index) since skeletons are temporary
 * - Combine skeletons for complex layouts
 * - Test in both light and dark modes
 * - Verify reduced motion preferences work
 */


// ============================================================================
// COMMON PATTERNS
// ============================================================================

// Pattern 1: List with variable length
const skeletonCount = expectedCount || 5;
<div>
  {Array.from({ length: skeletonCount }).map((_, i) => (
    <CardSkeleton key={i} />
  ))}
</div>

// Pattern 2: Conditional skeleton
{isLoading ? <TextSkeleton lines={3} /> : <p>{content}</p>}

// Pattern 3: Inline skeleton for partial loading
<div>
  {title || <BaseSkeleton width="200px" height="24px" />}
  {description || <TextSkeleton lines={2} />}
</div>

// Pattern 4: Skeleton with actual layout
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  {isLoading 
    ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
    : data.map(item => <Card key={item.id} {...item} />)
  }
</div>


// ============================================================================
// TYPESCRIPT USAGE
// ============================================================================

import type { BaseSkeletonProps } from '@/components/skeletons';

// Define custom props with skeleton props
interface MyComponentProps {
  isLoading?: boolean;
  skeletonProps?: BaseSkeletonProps;
}

function MyComponent({ isLoading, skeletonProps }: MyComponentProps) {
  if (isLoading) {
    return <BaseSkeleton {...skeletonProps} />;
  }
  return <div>Content</div>;
}


// ============================================================================
// ACCESSIBILITY
// ============================================================================

/**
 * All skeleton components include:
 * - role="status" for loading indication
 * - aria-label for screen readers
 * - aria-hidden on decorative elements
 * - Reduced motion support via CSS
 * 
 * No additional accessibility work needed!
 */


// ============================================================================
// FOR MORE INFORMATION
// ============================================================================

/**
 * See complete documentation:
 * - SKELETON_COMPONENTS_README.md - Full API reference
 * - TASK_B2_VERIFICATION.md - Verification details
 * - src/pages/dev/SkeletonsDemo.tsx - Interactive demo
 * 
 * Access demo page:
 * - Click PageSwitcher (bottom-right floating button)
 * - Select "Skeletons Demo"
 * - View all 13 components with live preview
 */

export {};
