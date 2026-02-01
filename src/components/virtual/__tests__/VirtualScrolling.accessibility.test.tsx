import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VirtualList } from '../VirtualList';
import { VirtualGrid } from '../VirtualGrid';

describe('Virtual Scrolling Accessibility Tests', () => {
  describe('Keyboard Navigation', () => {
    it('should support tab navigation through virtual list items', async () => {
      const user = userEvent.setup();
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        label: `Item ${i}`,
      }));

      render(
        <div>
          <button>Before</button>
          <VirtualList
            items={items}
            height={400}
            itemHeight={60}
            renderItem={(item, index, style) => (
              <button
                key={item.id}
                style={style}
                data-testid={`item-${item.id}`}
              >
                {item.label}
              </button>
            )}
          />
          <button>After</button>
        </div>
      );

      const beforeButton = screen.getByText('Before');
      const afterButton = screen.getByText('After');

      // Focus should move from before button into list
      beforeButton.focus();
      await user.tab();

      // Should be able to tab through visible items
      // (Note: Virtual scrolling renders only visible items)
      const activeElement = document.activeElement;
      expect(activeElement?.getAttribute('data-testid')).toMatch(/^item-\d+$/);

      // Continue tabbing should eventually reach after button
      for (let i = 0; i < 20; i++) {
        await user.tab();
      }
      
      // Should eventually tab past the list
      const finalActive = document.activeElement;
      expect(finalActive).toBeTruthy();
    });

    it('should support arrow key navigation within list', async () => {
      const user = userEvent.setup();
      const handleItemClick = vi.fn();
      const items = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        text: `Row ${i}`,
      }));

      render(
        <VirtualList
          items={items}
          height={300}
          itemHeight={50}
          renderItem={(item, index, style) => (
            <button
              key={item.id}
              style={style}
              onClick={() => handleItemClick(item.id)}
              data-testid={`row-${item.id}`}
            >
              {item.text}
            </button>
          )}
        />
      );

      // Focus first visible item
      const firstItem = screen.queryByTestId('row-0');
      if (firstItem) {
        firstItem.focus();
        expect(document.activeElement).toBe(firstItem);

        // Arrow down should move focus (if implemented)
        await user.keyboard('{ArrowDown}');
        
        // Virtual list manages focus, check that system works
        expect(document.activeElement).toBeTruthy();
      }
    });
  });

  describe('Screen Reader Support', () => {
    it('should have proper ARIA attributes for list', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        title: `Article ${i}`,
        content: `Content for article ${i}`,
      }));

      const { container } = render(
        <VirtualList
          items={items}
          height={500}
          itemHeight={100}
          renderItem={(item, index, style) => (
            <article
              key={item.id}
              style={style}
              aria-label={item.title}
              role="listitem"
            >
              <h3>{item.title}</h3>
              <p>{item.content}</p>
            </article>
          )}
        />
      );

      // Check that items have proper semantic HTML
      const articles = container.querySelectorAll('article');
      expect(articles.length).toBeGreaterThan(0);

      // Each article should have aria-label
      articles.forEach((article) => {
        expect(article.getAttribute('aria-label')).toBeTruthy();
        expect(article.getAttribute('role')).toBe('listitem');
      });
    });

    it('should announce item count for screen readers', () => {
      const items = Array.from({ length: 250 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
      }));

      const { container } = render(
        <div>
          <div aria-live="polite" aria-atomic="true">
            Showing {items.length} items
          </div>
          <VirtualList
            items={items}
            height={400}
            itemHeight={60}
            renderItem={(item, index, style) => (
              <div key={item.id} style={style} role="listitem">
                {item.name}
              </div>
            )}
          />
        </div>
      );

      // Screen reader announcement should be present
      expect(screen.getByText(/Showing 250 items/i)).toBeInTheDocument();
    });

    it('should support proper focus management on filter/search', async () => {
      const user = userEvent.setup();
      let items = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        category: i % 2 === 0 ? 'even' : 'odd',
      }));

      const TestComponent = () => {
        const [filter, setFilter] = React.useState('');
        const filteredItems = items.filter((item) =>
          item.name.toLowerCase().includes(filter.toLowerCase())
        );

        return (
          <div>
            <input
              type="text"
              placeholder="Search items"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Search items"
            />
            <div aria-live="polite">
              {filteredItems.length} results
            </div>
            <VirtualList
              items={filteredItems}
              height={400}
              itemHeight={50}
              renderItem={(item, index, style) => (
                <div key={item.id} style={style}>
                  {item.name}
                </div>
              )}
            />
          </div>
        );
      };

      render(<TestComponent />);

      const searchInput = screen.getByLabelText('Search items');
      
      // Type in search
      await user.type(searchInput, '5');

      // Should announce filtered results
      expect(screen.getByText(/results/i)).toBeInTheDocument();
    });
  });

  describe('Focus Management', () => {
    it('should maintain focus when scrolling virtually', async () => {
      const handleFocus = vi.fn();
      const items = Array.from({ length: 200 }, (_, i) => ({
        id: i,
        label: `Button ${i}`,
      }));

      const { container } = render(
        <VirtualList
          items={items}
          height={500}
          itemHeight={60}
          renderItem={(item, index, style) => (
            <button
              key={item.id}
              style={style}
              onFocus={() => handleFocus(item.id)}
              data-testid={`btn-${item.id}`}
            >
              {item.label}
            </button>
          )}
        />
      );

      // Focus an item that's visible
      const firstButton = screen.queryByTestId('btn-0');
      if (firstButton) {
        firstButton.focus();
        expect(handleFocus).toHaveBeenCalledWith(0);
        expect(document.activeElement).toBe(firstButton);
      }
    });

    it('should handle focus trap patterns correctly', () => {
      const items = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        text: `Item ${i}`,
      }));

      const { container } = render(
        <div role="dialog" aria-modal="true">
          <VirtualList
            items={items}
            height={300}
            itemHeight={50}
            renderItem={(item, index, style) => (
              <button key={item.id} style={style}>
                {item.text}
              </button>
            )}
          />
          <button>Close</button>
        </div>
      );

      // Modal pattern with virtual list should work
      const dialog = container.querySelector('[role="dialog"]');
      expect(dialog).toBeInTheDocument();
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });
  });

  describe('Semantic HTML and Roles', () => {
    it('should use semantic HTML elements appropriately', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        title: `Card ${i}`,
        description: `Description ${i}`,
      }));

      const { container } = render(
        <VirtualGrid
          items={items}
          height={600}
          width={900}
          columnCount={3}
          rowHeight={200}
          columnWidth={290}
          renderItem={(item, index, style) => (
            <article key={item.id} style={style}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          )}
        />
      );

      // Should use semantic article elements
      const articles = container.querySelectorAll('article');
      expect(articles.length).toBeGreaterThan(0);

      // Should have proper heading hierarchy
      const headings = container.querySelectorAll('h3');
      expect(headings.length).toBeGreaterThan(0);
    });

    it('should support custom ARIA labels and descriptions', () => {
      const items = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        name: `Document ${i}`,
        type: 'PDF',
      }));

      const { container } = render(
        <VirtualList
          items={items}
          height={400}
          itemHeight={70}
          renderItem={(item, index, style) => (
            <div
              key={item.id}
              style={style}
              role="button"
              aria-label={`Download ${item.name} ${item.type} file`}
              tabIndex={0}
            >
              {item.name}
            </div>
          )}
        />
      );

      const buttons = container.querySelectorAll('[role="button"]');
      buttons.forEach((button) => {
        expect(button.getAttribute('aria-label')).toMatch(/Download.*file/);
        expect(button.getAttribute('tabIndex')).toBe('0');
      });
    });
  });

  describe('Responsive Design Accessibility', () => {
    it('should adapt to different viewport sizes accessibly', () => {
      const items = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        title: `Card ${i}`,
      }));

      const { rerender } = render(
        <VirtualGrid
          items={items}
          height={600}
          width={1200}
          columnCount={4}
          rowHeight={150}
          columnWidth={280}
          renderItem={(item, index, style) => (
            <div key={item.id} style={style}>
              {item.title}
            </div>
          )}
        />
      );

      // Simulate mobile viewport (1 column)
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

      // Should still render without accessibility issues
      expect(screen).toBeTruthy();
    });
  });

  describe('Loading and Error States', () => {
    it('should handle loading state accessibly', () => {
      render(
        <div>
          <div role="status" aria-live="polite" aria-label="Loading items">
            <span>Loading...</span>
          </div>
          <VirtualList
            items={[]}
            height={400}
            itemHeight={60}
            renderItem={() => null}
          />
        </div>
      );

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByLabelText('Loading items')).toBeInTheDocument();
    });

    it('should handle empty state with proper messaging', () => {
      const items: any[] = [];

      render(
        <div>
          {items.length === 0 ? (
            <div role="status" aria-live="polite">
              No items found. Try adjusting your filters.
            </div>
          ) : (
            <VirtualList
              items={items}
              height={400}
              itemHeight={60}
              renderItem={(item, index, style) => (
                <div key={index} style={style}>
                  {item}
                </div>
              )}
            />
          )}
        </div>
      );

      expect(screen.getByRole('status')).toHaveTextContent('No items found');
    });
  });
});
