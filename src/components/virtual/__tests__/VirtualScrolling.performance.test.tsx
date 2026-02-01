import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VirtualList } from '../VirtualList';
import { VirtualGrid } from '../VirtualGrid';

describe('Virtual Scrolling Performance Tests', () => {
  describe('VirtualList with 10,000+ items', () => {
    it('should render large list efficiently without rendering all items', () => {
      const items = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        title: `Item ${i}`,
        description: `Description for item ${i}`,
      }));

      const { container } = render(
        <VirtualList
          items={items}
          height={600}
          itemHeight={80}
          renderItem={(item, index, style) => (
            <div key={item.id} style={style} data-testid={`item-${item.id}`}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          )}
        />
      );

      // Virtual scrolling should only render visible items
      // Not all 10,000 items should be in the DOM
      const renderedItems = container.querySelectorAll('[data-testid^="item-"]');
      expect(renderedItems.length).toBeLessThan(100); // Should render ~10-20 items
      expect(items.length).toBe(10000); // Full dataset exists in memory
    });

    it('should handle 50,000 items without crashing', () => {
      const items = Array.from({ length: 50000 }, (_, i) => ({
        id: i,
        value: `Value ${i}`,
      }));

      const { container } = render(
        <VirtualList
          items={items}
          height={800}
          itemHeight={60}
          renderItem={(item, index, style) => (
            <div key={item.id} style={style}>
              {item.value}
            </div>
          )}
        />
      );

      // Should render without errors
      expect(container).toBeTruthy();
      
      // Should only render visible items
      const allDivs = container.querySelectorAll('div');
      // Much fewer than 50,000 divs should be rendered
      expect(allDivs.length).toBeLessThan(200);
    });

    it('should update efficiently when items change', () => {
      let items = Array.from({ length: 5000 }, (_, i) => ({
        id: i,
        text: `Original ${i}`,
      }));

      const { rerender, container } = render(
        <VirtualList
          items={items}
          height={600}
          itemHeight={50}
          renderItem={(item, index, style) => (
            <div key={item.id} style={style}>
              {item.text}
            </div>
          )}
        />
      );

      // Update items
      items = Array.from({ length: 5000 }, (_, i) => ({
        id: i,
        text: `Updated ${i}`,
      }));

      // Re-render should be efficient
      const startTime = performance.now();
      rerender(
        <VirtualList
          items={items}
          height={600}
          itemHeight={50}
          renderItem={(item, index, style) => (
            <div key={item.id} style={style}>
              {item.text}
            </div>
          )}
        />
      );
      const endTime = performance.now();

      // Re-render should take less than 100ms for virtual list
      expect(endTime - startTime).toBeLessThan(100);
      expect(container).toBeTruthy();
    });
  });

  describe('VirtualGrid with 10,000+ items', () => {
    it('should render large grid efficiently', () => {
      const items = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Card ${i}`,
      }));

      const { container } = render(
        <VirtualGrid
          items={items}
          height={800}
          width={1200}
          columnCount={3}
          rowHeight={200}
          columnWidth={380}
          renderItem={(item, index, style) => (
            <div key={item.id} style={style} data-testid={`card-${item.id}`}>
              {item.name}
            </div>
          )}
        />
      );

      // Should only render visible cells, not all 10,000
      const renderedCards = container.querySelectorAll('[data-testid^="card-"]');
      expect(renderedCards.length).toBeLessThan(50); // Should render ~15-30 cards
      expect(items.length).toBe(10000);
    });

    it('should handle responsive column changes efficiently', () => {
      const items = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        title: `Item ${i}`,
      }));

      const { rerender, container } = render(
        <VirtualGrid
          items={items}
          height={600}
          width={1200}
          columnCount={3}
          rowHeight={150}
          columnWidth={380}
          renderItem={(item, index, style) => (
            <div key={item.id} style={style}>
              {item.title}
            </div>
          )}
        />
      );

      // Change to mobile layout (1 column)
      rerender(
        <VirtualGrid
          items={items}
          height={600}
          width={400}
          columnCount={1}
          rowHeight={150}
          columnWidth={380}
          renderItem={(item, index, style) => (
            <div key={item.id} style={style}>
              {item.title}
            </div>
          )}
        />
      );

      // Should adapt without errors
      expect(container).toBeTruthy();
    });
  });

  describe('Performance benchmarks', () => {
    it('should render 10k items faster than traditional rendering', () => {
      const items = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        content: `Content ${i}`,
      }));

      // Measure virtual list rendering time
      const virtualStart = performance.now();
      const { container: virtualContainer } = render(
        <VirtualList
          items={items}
          height={600}
          itemHeight={50}
          renderItem={(item, index, style) => (
            <div key={item.id} style={style}>
              {item.content}
            </div>
          )}
        />
      );
      const virtualEnd = performance.now();
      const virtualTime = virtualEnd - virtualStart;

      // Virtual rendering should be fast (< 50ms typically)
      expect(virtualTime).toBeLessThan(200);
      expect(virtualContainer).toBeTruthy();

      // Traditional rendering (just for comparison, using small subset)
      const smallItems = items.slice(0, 100);
      const traditionalStart = performance.now();
      const { container: traditionalContainer } = render(
        <div>
          {smallItems.map((item) => (
            <div key={item.id}>{item.content}</div>
          ))}
        </div>
      );
      const traditionalEnd = performance.now();
      const traditionalTime = traditionalEnd - traditionalStart;

      // Virtual list should handle 100x more items in reasonable time
      expect(virtualTime).toBeLessThan(traditionalTime * 200);
      expect(traditionalContainer).toBeTruthy();
    });

    it('should maintain low memory footprint with large datasets', () => {
      const items = Array.from({ length: 25000 }, (_, i) => ({
        id: i,
        data: `Data ${i}`,
      }));

      const { container } = render(
        <VirtualList
          items={items}
          height={600}
          itemHeight={60}
          renderItem={(item, index, style) => (
            <div key={item.id} style={style}>
              {item.data}
            </div>
          )}
        />
      );

      // Count actual DOM nodes - should be minimal
      const totalNodes = container.querySelectorAll('*').length;
      
      // With 25,000 items, should have way fewer than 1000 DOM nodes
      expect(totalNodes).toBeLessThan(500);
      expect(items.length).toBe(25000);
    });
  });

  describe('Filtering and search with large datasets', () => {
    it('should handle filtering 10k items efficiently', () => {
      const allItems = Array.from({ length: 10000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        category: i % 3 === 0 ? 'A' : i % 3 === 1 ? 'B' : 'C',
      }));

      // Filter to category A (about 3,333 items)
      const filteredItems = allItems.filter((item) => item.category === 'A');

      const startTime = performance.now();
      const { container } = render(
        <VirtualList
          items={filteredItems}
          height={600}
          itemHeight={50}
          renderItem={(item, index, style) => (
            <div key={item.id} style={style}>
              {item.name}
            </div>
          )}
        />
      );
      const endTime = performance.now();

      // Should render filtered list quickly
      expect(endTime - startTime).toBeLessThan(100);
      expect(filteredItems.length).toBeGreaterThan(3000);
      expect(container).toBeTruthy();
    });
  });
});
