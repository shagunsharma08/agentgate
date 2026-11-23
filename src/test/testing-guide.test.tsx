import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TestingGuide } from '@/components/testing-guide';

describe('How to test this box', () => {
  it('states that the demo tests governance logic, not live AI performance', () => {
    render(<TestingGuide />);

    expect(screen.getByText('This scripted demo tests governance logic, not live AI performance.')).toBeInTheDocument();
  });

  it('gives three numbered checks with the expected governance results', () => {
    render(<TestingGuide />);

    const checks = screen.getByRole('list');
    expect(within(checks).getAllByRole('listitem')).toHaveLength(3);
    expect(checks).toHaveTextContent('8,000 shares settle, 2,000 remain open, and the case must not close.');
    expect(checks).toHaveTextContent('Settlement confirmed before Case closed and documented');
    expect(checks).toHaveTextContent('no red-level execution occurs until a human chooses an action');
  });

  it('clarifies that the initial red entry is a blocked action, not one the agent performed', () => {
    render(<TestingGuide />);

    expect(screen.getByText('The initial red entry describes a blocked action, not an action the agent performed.')).toBeInTheDocument();
  });

  it('links to the automated governance tests and names the command that runs them', () => {
    render(<TestingGuide />);

    expect(screen.getByRole('link', { name: 'View automated governance tests' })).toHaveAttribute(
      'href',
      'https://github.com/shagunsharma08/agentgate/blob/main/src/test/settlement.test.ts',
    );
    expect(screen.getByText('npm test')).toBeInTheDocument();
  });
});
