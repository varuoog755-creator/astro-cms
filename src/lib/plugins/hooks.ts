type ActionCallback = (...args: any[]) => void | Promise<void>;
type FilterCallback = (value: any, ...args: any[]) => any | Promise<any>;

interface HookListener<T> {
  callback: T;
  priority: number;
}

class HookSystem {
  private actions: Map<string, HookListener<ActionCallback>[]> = new Map();
  private filters: Map<string, HookListener<FilterCallback>[]> = new Map();

  public addAction(hook: string, callback: ActionCallback, priority = 10): void {
    if (!this.actions.has(hook)) {
      this.actions.set(hook, []);
    }
    const list = this.actions.get(hook)!;
    list.push({ callback, priority });
    list.sort((a, b) => a.priority - b.priority);
  }

  public async doAction(hook: string, ...args: any[]): Promise<void> {
    const list = this.actions.get(hook);
    if (!list) return;
    for (const item of list) {
      await item.callback(...args);
    }
  }

  public addFilter(hook: string, callback: FilterCallback, priority = 10): void {
    if (!this.filters.has(hook)) {
      this.filters.set(hook, []);
    }
    const list = this.filters.get(hook)!;
    list.push({ callback, priority });
    list.sort((a, b) => a.priority - b.priority);
  }

  public async applyFilters(hook: string, value: any, ...args: any[]): Promise<any> {
    const list = this.filters.get(hook);
    if (!list) return value;
    let currentValue = value;
    for (const item of list) {
      currentValue = await item.callback(currentValue, ...args);
    }
    return currentValue;
  }
}

export const hooks = new HookSystem();
export default hooks;
