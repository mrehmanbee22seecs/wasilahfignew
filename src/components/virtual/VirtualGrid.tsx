import React, { useState, useEffect, useRef } from 'react';
import { Grid, CellComponentProps } from 'react-window';

interface VirtualGridProps<T> {
  items: T[];
  height: number;
  width: number | string;
  columnCount: number;
  rowHeight: number;
  columnWidth: number;
  renderItem: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  className?: string;
  overscanRowCount?: number;
  overscanColumnCount?: number;
  onScroll?: (scrollTop: number) => void;
}

/**
 * VirtualGrid component for efficiently rendering large grids
 * Uses react-window for virtual scrolling to handle 10,000+ items in grid layout
 * 
 * @example
 * ```tsx
 * <VirtualGrid
 *   items={volunteers}
 *   height={600}
 *   width="100%"
 *   columnCount={3}
 *   rowHeight={350}
 *   columnWidth={400}
 *   renderItem={(volunteer, index, style) => (
 *     <div style={style}>
 *       <VolunteerCard volunteer={volunteer} />
 *     </div>
 *   )}
 * />
 * ```
 */
export function VirtualGrid<T>({
  items,
  height,
  width,
  columnCount,
  rowHeight,
  columnWidth,
  renderItem,
  className,
  overscanRowCount = 2,
  overscanColumnCount = 1,
  onScroll
}: VirtualGridProps<T>) {
  const rowCount = Math.ceil(items.length / columnCount);

  // Cell component that receives columnIndex and rowIndex
  const Cell = ({ columnIndex, rowIndex, style }: CellComponentProps<{ items: T[], columnCount: number }>) => {
    const index = rowIndex * columnCount + columnIndex;
    const item = items[index];
    
    if (!item) {
      return null;
    }

    return <>{renderItem(item, index, style)}</>;
  };

  return (
    <div style={{ width, height }} className={className}>
      <Grid
        cellComponent={Cell}
        cellProps={{ items, columnCount }}
        columnCount={columnCount}
        columnWidth={columnWidth}
        rowCount={rowCount}
        rowHeight={rowHeight}
        overscanCount={overscanRowCount}
      />
    </div>
  );
}

export type VirtualGridRef = any;

