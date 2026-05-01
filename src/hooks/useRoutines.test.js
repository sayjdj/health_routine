import { renderHook, act } from '@testing-library/react';
import { useRoutines } from './useRoutines';
import { defaultRoutines } from '../data/mockRoutines';

const STORAGE_KEY = 'leg-routine-timer-data';

describe('useRoutines', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return defaultRoutines when localStorage is empty', () => {
    const { result } = renderHook(() => useRoutines());
    expect(result.current.routines).toEqual(defaultRoutines);
  });

  it('should return parsed routines from localStorage if valid', () => {
    const customRoutines = [{ id: '1', name: 'Test Routine' }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customRoutines));

    const { result } = renderHook(() => useRoutines());
    expect(result.current.routines).toEqual(customRoutines);
  });

  it('should fallback to defaultRoutines when localStorage has invalid JSON', () => {
    // Spy on console.error to avoid test output noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Set invalid JSON in localStorage
    localStorage.setItem(STORAGE_KEY, '{invalid_json:');

    const { result } = renderHook(() => useRoutines());

    // Check if routines fall back to default
    expect(result.current.routines).toEqual(defaultRoutines);

    // Check if console.error was called
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
