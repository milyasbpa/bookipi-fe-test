import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AntiCheatSummaryPlayer } from './AntiCheatSummary.player';

// Mock dependencies
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('AntiCheatSummaryPlayer', () => {
  it('renders no suspicious activity message', () => {
    render(<AntiCheatSummaryPlayer />);
    expect(screen.getByText('no-suspicious-activity')).toBeInTheDocument();
  });

  it('renders activity log note', () => {
    render(<AntiCheatSummaryPlayer />);
    expect(screen.getByText('activity-log-note')).toBeInTheDocument();
  });

  it('displays ShieldCheck icon', () => {
    const { container } = render(<AntiCheatSummaryPlayer />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('uses green border styling for success', () => {
    const { container } = render(<AntiCheatSummaryPlayer />);
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv.className).toContain('border-green-500');
  });
});
