export const ICON_NAMES = ['TASK', 'COMMUNICATION', 'DECISION', 'APPROVAL', 'DATA'] as const;

export type IconName = typeof ICON_NAMES[number];

export interface Task {
  description: string;
  icon: IconName | string; // Can be a predefined name or a data URL for custom icons
}

export interface Role {
  title: string;
  description: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface ChartData {
  title: string;
  roles: Role[];
  steps: Step[];
  tasks: (Task | null)[][];
}

export type EditingItem =
  | { type: 'task'; data: Task | null; rowIndex: number; colIndex: number }
  | { type: 'role'; data: Role; index: number }
  | { type: 'step'; data: Step; index: number };
