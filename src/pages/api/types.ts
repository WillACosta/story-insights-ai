export interface ExecutionStatusResponse {
  execution_id: string;
  quick_command_slug: string;
  conversation_id: string;
  progress: Progress;
  steps: Step[] | null;
  result: any | null;
}

export interface Progress {
  start: string;
  end: string | null;
  duration: string | null;
  execution_percentage: number;
  status: string;
}

export interface Step {
  step_name: string;
  execution_order: number;
  type: string;
  step_result: StepResult;
}

export interface StepResult {
  answer: string;
  sources: any[];
}
