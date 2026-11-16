export type ExpertAgentKey =
  | 'diagnost'
  | 'presenter'
  | 'sales'
  | 'objections'
  | 'closing'
  | 'developer'
  | 'lawyer'
  | 'marketing'
  | 'motivator'
  | 'protection';

export type GoalKey =
  | 'diagnose_situation'
  | 'expert_consultation'
  | 'help_sell'
  | 'trust_and_contact'
  | 'motivate'
  | 'protect_system';

export interface GoalScore {
  score: number;
  reason: string;
}

export interface AgentGoals {
  diagnose_situation: GoalScore;
  expert_consultation: GoalScore;
  help_sell: GoalScore;
  trust_and_contact: GoalScore;
  motivate: GoalScore;
  protect_system: GoalScore;
  main_goal: string;
  secondary_goal: string;
}

export interface ClientProfile {
  current_request: string;
  situation_type: string;
  main_problem: string;
  interest_level: string;
  trust_level: string;
  main_objection: string;
  emotion: string;
  purchase_probability: string;
  next_best_step: string;
}

export interface AgentRouter {
  selected_agents: string[];
  order: string[];
  reason: string;
}

export interface ExpertAgentOutput {
  used: boolean;
  response: string;
}

export type ExpertAgentsPool = Record<ExpertAgentKey, ExpertAgentOutput>;

export interface StepReasoning {
  goals: AgentGoals;
  profile: ClientProfile;
  router: AgentRouter;
  expert_agents: ExpertAgentsPool;
}

export interface TurnOutput {
  reasoning: StepReasoning;
  answer: string;
}

export interface ScenarioOption {
  id: 'A' | 'B' | 'C';
  text: string;
  isPrimary: boolean;
  advancesStep: boolean;
  isFinalChoice?: boolean;
  isProfileReset?: boolean;
  preservesProfile?: boolean;
  turn: TurnOutput;
  missionOutcomeOverride?: {
    probability: number;
    summary: string;
    nextStep: string;
    statusLabel: string;
  };
}

export interface ScenarioStep {
  stepNumber: number;
  options: ScenarioOption[];
}

export interface MissionAgentTakeaway {
  agentName: string;
  agentKey?: ExpertAgentKey;
  role: string;
  takeaway: string;
  conditional?: boolean;
}

export interface ScenarioData {
  id: 'ai-project' | 'english-courses' | 'crm-auto';
  title: string;
  shortTitle: string;
  category: string;
  clientRole: string;
  sellerRole: string;
  goal: string;
  description: string;
  featuredAgentsLabel: string;
  openingMessage: string;
  initialProfile: ClientProfile;
  totalSteps: number;
  steps: ScenarioStep[];
  missionSummary: {
    defaultProbability: number;
    defaultOutcome: string;
    defaultNextStep: string;
    agentTakeaways: MissionAgentTakeaway[];
  };
}

export interface ChatMessage {
  id: string;
  sender: 'system' | 'client';
  text: string;
  timestamp: string;
  turnOutput?: TurnOutput;
  isDemoGuard?: boolean;
  isProfileReset?: boolean;
  stepNumber?: number;
}
