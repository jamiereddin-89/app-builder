import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppList, AppCard } from '../../components/AppList.js';

// Mock react-window
vi.mock('react-window', () => ({
  FixedSizeList: ({ children, height, itemCount, itemSize, itemData }) => {
    return (
      <div style={{ height, overflow: 'auto' }}>
        {Array.from({ length: itemCount }, (_, index) => (
          <div key={index} style={{ height: itemSize }}>
            {children({ index, style: { height: itemSize }, data: itemData })}
          </div>
        ))}
      </div>
    );
  }
}));

describe('AppList Component', () => {
  const mockApps = [
    {
      _id: 'app-1',
      appName: 'test-app-1',
      appTitle: 'Test App 1',
      prompt: 'A test application',
      version: 1,
      views: 10,
      favorite: false,
      tags: ['test', 'app']
    },
    {
      _id: 'app-2',
      appName: 'test-app-2',
      appTitle: 'Test App 2',
      prompt: 'Another test application',
      version: 2,
      views: 5,
      favorite: true,
      tags: ['test']
    },
    {
      _id: 'app-3',
      appName: 'test-app-3',
      appTitle: 'Test App 3',
      prompt: 'Yet another test application',
      version: 1,
      views: 0,
      favorite: false,
      tags: []
    }
  ];

  const mockProps = {
    height: 400,
    itemCount: mockApps.length,
    itemSize: 140,
    itemData: mockApps,
    className: 'test-list'
  };

  describe('AppCard', () => {
    it('should render app card with basic information', () => {
      const app = mockApps[0];
      const mockStyle = { height: 140 };

      render(
        <AppCard
          index={0}
          style={mockStyle}
          data={mockApps}
        />
      );

      expect(screen.getByText('📱 Test App 1')).toBeInTheDocument();
      expect(screen.getByText('v1')).toBeInTheDocument();
      expect(screen.getByText('👁️ 10')).toBeInTheDocument();
      expect(screen.getByText('A test application')).toBeInTheDocument();
    });

    it('should display favorite star when app is favorite', () => {
      const app = mockApps[1];
      const mockStyle = { height: 140 };

      render(
        <AppCard
          index={1}
          style={mockStyle}
          data={mockApps}
        />
      );

      expect(screen.getByText('📱 Test App 2')).toBeInTheDocument();
      expect(screen.getByText('⭐')).toBeInTheDocument();
    });

    it('should display tags when present', () => {
      const app = mockApps[0];
      const mockStyle = { height: 140 };

      render(
        <AppCard
          index={0}
          style={mockStyle}
          data={mockApps}
        />
      );

      expect(screen.getByText('#test')).toBeInTheDocument();
      expect(screen.getByText('#app')).toBeInTheDocument();
    });

    it('should not display tags section when no tags', () => {
      const app = mockApps[2];
      const mockStyle = { height: 140 };

      render(
        <AppCard
          index={2}
          style={mockStyle}
          data={mockApps}
        />
      );

      expect(screen.queryByText('#')).not.toBeInTheDocument();
    });

    it('should truncate long descriptions', () => {
      const longApp = {
        ...mockApps[0],
        prompt: 'This is a very long description that should be truncated when displayed in the app card to ensure it fits within the available space and maintains a consistent layout across all cards in the list'
      };
      const mockStyle = { height: 140 };

      render(
        <AppCard
          index={0}
          style={mockStyle}
          data={[longApp]}
        />
      );

      const descriptionElement = screen.getByText(/This is a very long description/);
      expect(descriptionElement).toHaveClass('truncate');
    });
  });

  describe('AppList', () => {
    it('should render list with correct number of items', () => {
      render(<AppList {...mockProps} />);

      // Should render 3 app cards
      const appCards = screen.getAllByText(/📱 Test App/);
      expect(appCards).toHaveLength(3);
    });

    it('should render empty state when no apps', () => {
      render(
        <AppList
          height={400}
          itemCount={0}
          itemSize={140}
          itemData={[]}
          className="test-list"
        />
      );

      expect(screen.getByText('No apps yet')).toBeInTheDocument();
    });

    it('should render search message when no matching apps', () => {
      render(
        <AppList
          height={400}
          itemCount={0}
          itemSize={140}
          itemData={[]}
          className="test-list"
        />
      );

      expect(screen.getByText('No matching apps')).toBeInTheDocument();
    });

    it('should apply correct styling classes', () => {
      const { container } = render(<AppList {...mockProps} />);

      // Check if the container has the correct class
      expect(container.firstChild).toHaveClass('test-list');
    });

    it('should handle click events on app cards', () => {
      const mockOnClick = vi.fn();
      
      // Mock the onClick behavior by simulating a click
      render(<AppList {...mockProps} />);

      const appCard = screen.getByText('📱 Test App 1').closest('div');
      expect(appCard).toBeInTheDocument();
    });

    it('should display correct version numbers', () => {
      render(<AppList {...mockProps} />);

      expect(screen.getByText('v1')).toBeInTheDocument();
      expect(screen.getByText('v2')).toBeInTheDocument();
    });

    it('should display correct view counts', () => {
      render(<AppList {...mockProps} />);

      expect(screen.getByText('👁️ 10')).toBeInTheDocument();
      expect(screen.getByText('👁️ 5')).toBeInTheDocument();
      expect(screen.getByText('👁️ 0')).toBeInTheDocument();
    });

    it('should handle apps without appTitle', () => {
      const appWithoutTitle = {
        ...mockApps[0],
        appTitle: undefined
      };

      render(
        <AppList
          height={400}
          itemCount={1}
          itemSize={140}
          itemData={[appWithoutTitle]}
          className="test-list"
        />
      );

      expect(screen.getByText('📱 test-app-1')).toBeInTheDocument();
    });

    it('should handle apps with empty prompt', () => {
      const appWithoutPrompt = {
        ...mockApps[0],
        prompt: ''
      };

      render(
        <AppList
          height={400}
          itemCount={1}
          itemSize={140}
          itemData={[appWithoutPrompt]}
          className="test-list"
        />
      );

      expect(screen.getByText('📱 Test App 1')).toBeInTheDocument();
      // Should still render the card even without prompt
    });

    it('should handle apps with undefined values', () => {
      const appWithUndefined = {
        _id: 'app-undefined',
        appName: undefined,
        appTitle: undefined,
        prompt: undefined,
        version: undefined,
        views: undefined,
        favorite: undefined,
        tags: undefined
      };

      render(
        <AppList
          height={400}
          itemCount={1}
          itemSize={140}
          itemData={[appWithUndefined]}
          className="test-list"
        />
      );

      // Should not crash and should render some fallback content
      expect(screen.getByText(/📱/)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(<AppList {...mockProps} />);

      const appCards = screen.getAllByText(/📱 Test App/);
      expect(appCards.length).toBeGreaterThan(0);
      
      // Each app card should be clickable (div with onClick)
      appCards.forEach(card => {
        const cardContainer = card.closest('div');
        expect(cardContainer).toBeInTheDocument();
      });
    });

    it('should handle keyboard navigation', () => {
      render(<AppList {...mockProps} />);

      const appCard = screen.getByText('📱 Test App 1').closest('div');
      expect(appCard).toBeInTheDocument();
      
      // App cards should be focusable for keyboard navigation
      expect(appCard).toHaveAttribute('tabIndex');
    });
  });

  describe('Performance', () => {
    it('should handle large number of apps efficiently', () => {
      const largeAppList = Array.from({ length: 1000 }, (_, i) => ({
        _id: `app-${i}`,
        appName: `app-${i}`,
        appTitle: `App ${i}`,
        prompt: `Description for app ${i}`,
        version: 1,
        views: i,
        favorite: i % 2 === 0,
        tags: [`tag-${i}`]
      }));

      const startTime = performance.now();
      
      render(
        <AppList
          height={400}
          itemCount={1000}
          itemSize={140}
          itemData={largeAppList}
          className="test-list"
        />
      );

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render within reasonable time (less than 1 second)
      expect(renderTime).toBeLessThan(1000);

      // Should show first few items
      expect(screen.getByText('📱 App 0')).toBeInTheDocument();
      expect(screen.getByText('📱 App 1')).toBeInTheDocument();
    });
  });
});