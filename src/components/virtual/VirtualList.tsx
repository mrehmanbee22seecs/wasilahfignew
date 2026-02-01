import React, { useEffect, useRef } from 'react';
import { List, RowComponentProps } from 'react-window';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number | ((index: number) => number);
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  width?: string | number;
  className?: string;
  overscanCount?: number;
  onScroll?: (scrollOffset: number) => void;
}

/**
 * VirtualList component for efficiently rendering large lists
 * Uses react-window for virtual scrolling to handle 10,000+ items
 * 
 * @example
 * ```tsx
 * <VirtualList
 *   items={logs}
 *   height={600}
 *   itemHeight={120}
 *   renderItem={(log, index, style) => (
 *     <div style={style}>
 *       <LogEntry entry={log} />
 *     </div>
 *   )}
 * />
 * ```
 */
export function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  width = '100%',
  className,
  overscanCount = 5,
  onScroll
}: VirtualListProps<T>) {
  // Row component that receives index and style
  const Row = ({ index, style }: RowComponentProps<{ items: T[] }>) => {
    const item = items[index];
    if (!item) return null;
    return <>{renderItem(item, index, style)}</>;
  };

  return (
    <div style={{ width, height }} className={className}>
      <List
        rowComponent={Row}
        rowCount={items.length}
        rowHeight={itemHeight}
        rowProps={{ items }}
        defaultHeight={height}
        defaultWidth={width}
        overscanCount={overscanCount}
      />
    </div>
  );
}

export type VirtualListRef = any;

