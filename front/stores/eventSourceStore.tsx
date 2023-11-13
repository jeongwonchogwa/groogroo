import { create } from 'zustand';

interface EventSourceStore {
  eventSource?: EventSource;
  setEventSource: (eventSource: EventSource) => void;
}

export const useEventSourceStore = create<EventSourceStore>((set) => ({
  eventSource: undefined,
  setEventSource: (eventSource) => set({ eventSource }),
  
}));