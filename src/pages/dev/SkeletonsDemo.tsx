/**
 * Skeletons Demo Page
 * 
 * A comprehensive demonstration and playground for all skeleton components.
 * Allows developers to preview and customize skeleton loaders.
 * 
 * Features:
 * - Live preview of all 12+ skeleton components
 * - Interactive controls to adjust props
 * - Code examples for each component
 * - Dark mode toggle
 * - Responsive preview
 * 
 * Usage:
 * Navigate to /dev/skeletons-demo to view this page
 * 
 * @module pages/dev/SkeletonsDemo
 */

import React, { useState } from 'react';
import {
  BaseSkeleton,
  TextSkeleton,
  ButtonSkeleton,
  HeaderSkeleton,
  CardSkeleton,
  ListSkeleton,
  ProfileSkeleton,
  FormSkeleton,
  TableRowSkeleton,
  ProjectCardSkeleton,
  SidebarSkeleton,
  ChartSkeleton,
  DashboardSkeleton,
} from '../../components/skeletons';

type ComponentName =
  | 'BaseSkeleton'
  | 'TextSkeleton'
  | 'ButtonSkeleton'
  | 'HeaderSkeleton'
  | 'CardSkeleton'
  | 'ListSkeleton'
  | 'ProfileSkeleton'
  | 'FormSkeleton'
  | 'TableRowSkeleton'
  | 'ProjectCardSkeleton'
  | 'SidebarSkeleton'
  | 'ChartSkeleton'
  | 'DashboardSkeleton';

interface ComponentConfig {
  name: ComponentName;
  description: string;
  codeExample: string;
}

const components: ComponentConfig[] = [
  {
    name: 'BaseSkeleton',
    description: 'Foundation skeleton with shimmer animation. Use for custom layouts.',
    codeExample: `<BaseSkeleton width="200px" height="20px" rounded="md" />`,
  },
  {
    name: 'TextSkeleton',
    description: 'Text lines with natural width variation. Perfect for paragraphs.',
    codeExample: `<TextSkeleton lines={3} />`,
  },
  {
    name: 'ButtonSkeleton',
    description: 'Button placeholder with size variants.',
    codeExample: `<ButtonSkeleton size="md" />`,
  },
  {
    name: 'HeaderSkeleton',
    description: 'Page header with title, subtitle, and optional actions.',
    codeExample: `<HeaderSkeleton showActions={true} />`,
  },
  {
    name: 'CardSkeleton',
    description: 'Generic card layout with image, content, and optional footer.',
    codeExample: `<CardSkeleton showImage={true} lines={3} />`,
  },
  {
    name: 'ListSkeleton',
    description: 'List items with simple, detailed, or avatar variants.',
    codeExample: `<ListSkeleton variant="avatar" items={5} />`,
  },
  {
    name: 'ProfileSkeleton',
    description: 'User or organization profile with avatar, info, and stats.',
    codeExample: `<ProfileSkeleton showStats={true} />`,
  },
  {
    name: 'FormSkeleton',
    description: 'Form layout with various field types.',
    codeExample: `<FormSkeleton fields={4} />`,
  },
  {
    name: 'TableRowSkeleton',
    description: 'Table rows with configurable columns.',
    codeExample: `<TableRowSkeleton columns={5} rows={3} />`,
  },
  {
    name: 'ProjectCardSkeleton',
    description: 'Specialized card for project listings with stats and tags.',
    codeExample: `<ProjectCardSkeleton showStats={true} />`,
  },
  {
    name: 'SidebarSkeleton',
    description: 'Navigation sidebar with menu items and profile.',
    codeExample: `<SidebarSkeleton sections={2} />`,
  },
  {
    name: 'ChartSkeleton',
    description: 'Chart placeholder for bar, line, pie, and area charts.',
    codeExample: `<ChartSkeleton type="bar" height={300} />`,
  },
  {
    name: 'DashboardSkeleton',
    description: 'Complete dashboard layout with stats, charts, and tables.',
    codeExample: `<DashboardSkeleton variant="ngo" />`,
  },
];

export const SkeletonsDemo: React.FC = () => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentName>('BaseSkeleton');
  const [animation, setAnimation] = useState<'shimmer' | 'pulse' | 'none'>('shimmer');

  const renderComponent = (name: ComponentName) => {
    switch (name) {
      case 'BaseSkeleton':
        return (
          <div className="space-y-4">
            <BaseSkeleton width="100%" height="40px" rounded="md" animation={animation} />
            <BaseSkeleton width="80%" height="40px" rounded="lg" animation={animation} />
            <BaseSkeleton width="60%" height="40px" rounded="full" animation={animation} />
          </div>
        );

      case 'TextSkeleton':
        return (
          <div className="space-y-6">
            <TextSkeleton lines={1} width="50%" />
            <TextSkeleton lines={3} />
            <TextSkeleton lines={5} />
          </div>
        );

      case 'ButtonSkeleton':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <ButtonSkeleton size="sm" />
              <ButtonSkeleton size="md" />
              <ButtonSkeleton size="lg" />
            </div>
            <ButtonSkeleton fullWidth />
          </div>
        );

      case 'HeaderSkeleton':
        return (
          <div className="space-y-6">
            <HeaderSkeleton />
            <HeaderSkeleton showActions={true} />
            <HeaderSkeleton showBreadcrumb={true} showActions={true} />
          </div>
        );

      case 'CardSkeleton':
        return (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <CardSkeleton showImage={true} lines={3} />
            <CardSkeleton showImage={true} lines={4} showFooter={true} />
          </div>
        );

      case 'ListSkeleton':
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">Simple</h3>
              <ListSkeleton variant="simple" items={3} />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">With Avatar</h3>
              <ListSkeleton variant="avatar" items={3} showDivider />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">Detailed</h3>
              <ListSkeleton variant="detailed" items={3} showDivider />
            </div>
          </div>
        );

      case 'ProfileSkeleton':
        return <ProfileSkeleton showStats={true} />;

      case 'FormSkeleton':
        return (
          <div className="max-w-2xl">
            <FormSkeleton fields={5} columns={2} />
          </div>
        );

      case 'TableRowSkeleton':
        return (
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <TableRowSkeleton columns={5} rows={8} showCheckbox showActions />
          </div>
        );

      case 'ProjectCardSkeleton':
        return (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <ProjectCardSkeleton showStats={true} />
            <ProjectCardSkeleton variant="compact" />
            <ProjectCardSkeleton showStats={true} />
          </div>
        );

      case 'SidebarSkeleton':
        return (
          <div className="flex gap-4 h-[600px]">
            <SidebarSkeleton sections={2} itemsPerSection={6} />
            <div className="flex-1 border border-border rounded-lg p-4 bg-card">
              <p className="text-muted-foreground text-center">
                Sidebar shown on the left
              </p>
            </div>
          </div>
        );

      case 'ChartSkeleton':
        return (
          <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
            <ChartSkeleton type="bar" height={280} />
            <ChartSkeleton type="line" height={280} />
            <ChartSkeleton type="pie" height={280} />
            <ChartSkeleton type="area" height={280} />
          </div>
        );

      case 'DashboardSkeleton':
        return (
          <div className="h-[800px] -m-6 overflow-hidden">
            <DashboardSkeleton variant="ngo" showSidebar={false} />
          </div>
        );

      default:
        return null;
    }
  };

  const selectedConfig = components.find((c) => c.name === selectedComponent);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Skeleton Components Demo</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Interactive showcase of all loading skeleton components
              </p>
            </div>
            
            {/* Animation control */}
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground">Animation:</label>
              <select
                value={animation}
                onChange={(e) => setAnimation(e.target.value as any)}
                className="px-3 py-1 border border-border rounded-md bg-background text-sm"
              >
                <option value="shimmer">Shimmer</option>
                <option value="pulse">Pulse</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Component list sidebar */}
          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-24 space-y-2">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-3 mb-3">
                Components ({components.length})
              </h2>
              <nav className="space-y-1">
                {components.map((component) => (
                  <button
                    key={component.name}
                    onClick={() => setSelectedComponent(component.name)}
                    className={`
                      w-full text-left px-3 py-2 rounded-md text-sm transition-colors
                      ${
                        selectedComponent === component.name
                          ? 'bg-primary text-primary-foreground font-medium'
                          : 'text-foreground hover:bg-muted'
                      }
                    `}
                  >
                    {component.name}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Component preview */}
          <main className="col-span-12 lg:col-span-9 space-y-6">
            {/* Component info */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold text-foreground mb-2">
                {selectedConfig?.name}
              </h2>
              <p className="text-muted-foreground mb-4">{selectedConfig?.description}</p>
              
              {/* Code example */}
              <div className="bg-muted/50 rounded-md p-4 font-mono text-sm overflow-x-auto">
                <pre className="text-foreground">{selectedConfig?.codeExample}</pre>
              </div>
            </div>

            {/* Live preview */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Live Preview</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                  {animation === 'none' ? 'Static' : `${animation} animation`}
                </span>
              </div>
              <div className="min-h-[200px]">{renderComponent(selectedComponent)}</div>
            </div>

            {/* Usage tips */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                💡 Usage Tips
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                <li>All skeletons support dark mode automatically</li>
                <li>Components are fully responsive and adapt to container size</li>
                <li>Use composition to build complex loading states</li>
                <li>Respect user's reduced motion preferences (built-in)</li>
                <li>Add aria-labels for better accessibility</li>
              </ul>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SkeletonsDemo;
