import React from 'react';
import { VirtualList } from './VirtualList';

interface VirtualTableProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderRow: (item: T, index: number, style: React.CSSProperties) => React.ReactNode;
  renderHeader: () => React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}

/**
 * VirtualTable component for efficiently rendering large tables
 * Uses react-window for virtual scrolling to handle 10,000+ rows
 * 
 * @example
 * ```tsx
 * <VirtualTable
 *   items={users}
 *   height={600}
 *   itemHeight={72}
 *   renderHeader={() => (
 *     <thead>
 *       <tr>
 *         <th>Name</th>
 *         <th>Email</th>
 *       </tr>
 *     </thead>
 *   )}
 *   renderRow={(user, index, style) => (
 *     <tr style={style}>
 *       <td>{user.name}</td>
 *       <td>{user.email}</td>
 *     </tr>
 *   )}
 * />
 * ```
 */
export function VirtualTable<T>({
  items,
  height,
  itemHeight,
  renderRow,
  renderHeader,
  emptyState,
  className = ''
}: VirtualTableProps<T>) {
  if (items.length === 0 && emptyState) {
    return (
      <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
        <table className="w-full">
          {renderHeader()}
          <tbody>
            <tr>
              <td colSpan={100}>{emptyState}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      <table className="w-full">
        {renderHeader()}
      </table>
      <div style={{ height, overflow: 'auto' }}>
        <table className="w-full">
          <tbody>
            <VirtualList
              items={items}
              height={height}
              itemHeight={itemHeight}
              renderItem={(item, index, style) => renderRow(item, index, style)}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
}
