import { renderHook, act } from '@testing-library/react';
import { useRoutines } from './useRoutines';
import { defaultRoutines } from '../data/mockRoutines';

const STORAGE_KEY = 'leg-routine-timer-data';

describe('useRoutines hook', () => {
  beforeEach(() => {
    localStorage.clear();
    // Clear all mocks and reset localStorage spy if used
    vi.clearAllMocks();
  });

  it('initializes with defaultRoutines when localStorage is empty', () => {
    const { result } = renderHook(() => useRoutines());
    expect(result.current.routines).toEqual(defaultRoutines);
  });

  it('initializes with saved routines from localStorage if valid JSON is found', () => {
    const customRoutines = [
      { id: 'test-1', title: 'Test Routine 1', workTime: 30, restTime: 10, sets: 3 }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customRoutines));

    const { result } = renderHook(() => useRoutines());
    expect(result.current.routines).toEqual(customRoutines);
  });

  it('falls back to defaultRoutines if invalid JSON is in localStorage', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    localStorage.setItem(STORAGE_KEY, 'invalid-json');

    const { result } = renderHook(() => useRoutines());
    expect(result.current.routines).toEqual(defaultRoutines);
    expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to parse saved routines", expect.any(Error));

    consoleErrorSpy.mockRestore();
  });

  it('addRoutine adds a new routine and updates state', () => {
    const { result } = renderHook(() => useRoutines());
    const newRoutine = { title: 'New Custom Routine', workTime: 20, restTime: 5, sets: 5 };

    act(() => {
      result.current.addRoutine(newRoutine);
    });

    expect(result.current.routines).toHaveLength(defaultRoutines.length + 1);
    expect(result.current.routines[result.current.routines.length - 1]).toMatchObject(newRoutine);
    expect(result.current.routines[result.current.routines.length - 1].id).toMatch(/^custom-\d+$/);
  });

  it('updateRoutine updates an existing routine', () => {
    const { result } = renderHook(() => useRoutines());
    const targetId = defaultRoutines[0].id;
    const updatedProps = { title: 'Updated Title', workTime: 60 };

    act(() => {
      result.current.updateRoutine(targetId, updatedProps);
    });

    const updatedRoutine = result.current.routines.find(r => r.id === targetId);
    expect(updatedRoutine.title).toBe('Updated Title');
    expect(updatedRoutine.workTime).toBe(60);
    // Other properties should remain unchanged
    expect(updatedRoutine.restTime).toBe(defaultRoutines[0].restTime);
  });

  it('deleteRoutine removes a routine by ID', () => {
    const { result } = renderHook(() => useRoutines());
    const targetId = defaultRoutines[0].id;

    act(() => {
      result.current.deleteRoutine(targetId);
    });

    expect(result.current.routines).toHaveLength(defaultRoutines.length - 1);
    expect(result.current.routines.find(r => r.id === targetId)).toBeUndefined();
  });

  it('resetToDefault restores the default routines', () => {
    // First, modify the routines
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    const { result } = renderHook(() => useRoutines());

    // Ensure we start with empty routines for this test
    expect(result.current.routines).toEqual([]);

    act(() => {
      result.current.resetToDefault();
    });

    expect(result.current.routines).toEqual(defaultRoutines);
  });

  it('verifies that any change syncs back to localStorage', () => {
    const { result } = renderHook(() => useRoutines());

    // Initial sync
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(defaultRoutines);

    // Add sync
    act(() => {
      result.current.addRoutine({ title: 'Sync Test' });
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(result.current.routines);
    const addedRoutines = result.current.routines;

    // Update sync
    const targetId = addedRoutines[0].id;
    act(() => {
      result.current.updateRoutine(targetId, { title: 'Sync Test Updated' });
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(result.current.routines);

    // Delete sync
    act(() => {
      result.current.deleteRoutine(targetId);
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(result.current.routines);

    // Reset sync
    act(() => {
      result.current.resetToDefault();
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toEqual(defaultRoutines);
  });
});
