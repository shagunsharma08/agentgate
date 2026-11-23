import { describe, expect, it, vi } from 'vitest';

vi.mock('@tanstack/react-start', () => ({
  createStart: (configure: () => unknown) => configure(),
  createMiddleware: () => ({ server: (handler: unknown) => ({ serverHandler: handler }) }),
  createCsrfMiddleware: (config: unknown) => ({ csrf: config }),
}));
vi.mock('@/integrations/supabase/auth-attacher', () => {
  throw new Error('Public synthetic AI must not initialize database authentication');
});

describe('Public synthetic AI request configuration', () => {
  it('starts without a database auth dependency and retains request protection', async () => {
    const { startInstance } = await import('@/start');
    expect(startInstance).not.toHaveProperty('functionMiddleware');
    expect(startInstance).toHaveProperty('requestMiddleware', [
      { serverHandler: expect.any(Function) },
      { csrf: { filter: expect.any(Function) } },
    ]);
  });
});