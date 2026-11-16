import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Bot, MessageSquare, RotateCcw } from 'lucide-react';
import { AgentPanel } from './components/AgentPanel';
import { AgentReasoningModal } from './components/AgentReasoningModal';
import { DialoguePanel } from './components/DialoguePanel';
import { HeroSection } from './components/HeroSection';
import { LivePipelineBar } from './components/LivePipelineBar';
import { MissionSummary } from './components/MissionSummary';
import { EXPERT_AGENT_META, SCENARIOS } from './data/scenarios';
import {
  ChatMessage,
  ClientProfile,
  ExpertAgentKey,
  ScenarioData,
  ScenarioOption,
  TurnOutput,
} from './types/agent';

type ViewMode = 'landing' | 'workspace' | 'summary';
type MobileTab = 'dialogue' | 'agents';

const formatTime = () => {
  const now = new Date();
  return now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
};

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('landing');
  const [activeScenarioId, setActiveScenarioId] = useState<ScenarioData['id']>('ai-project');
  const [currentStepNumber, setCurrentStepNumber] = useState<number>(1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentTurn, setCurrentTurn] = useState<TurnOutput | null>(null);
  const [lastTurnStep, setLastTurnStep] = useState<number>(1);
  const [exploredOptionKeys, setExploredOptionKeys] = useState<string[]>([]);
  const [triggeredAgents, setTriggeredAgents] = useState<ExpertAgentKey[]>([]);
  const [changedFields, setChangedFields] = useState<string[]>([]);
  const [isProfileReset, setIsProfileReset] = useState<boolean>(false);
  const [updateTick, setUpdateTick] = useState<number>(0);

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [pipelineStage, setPipelineStage] = useState<number>(-1);
  const [isMissionComplete, setIsMissionComplete] = useState<boolean>(false);
  const [finalOption, setFinalOption] = useState<ScenarioOption | null>(null);

  const [showOnboardingHint, setShowOnboardingHint] = useState<boolean>(true);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>('dialogue');
  const [agentUpdatedBadge, setAgentUpdatedBadge] = useState<boolean>(false);

  const timersRef = useRef<number[]>([]);

  const clearPendingTimers = () => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  };

  useEffect(() => {
    return () => clearPendingTimers();
  }, []);

  const activeScenario = useMemo(
    () => SCENARIOS.find((s) => s.id === activeScenarioId) ?? SCENARIOS[0],
    [activeScenarioId]
  );

  const startScenario = (scenarioId: ScenarioData['id']) => {
    clearPendingTimers();
    const target = SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0];

    setActiveScenarioId(target.id);
    setCurrentStepNumber(1);
    setMessages([
      {
        id: `opening-${target.id}-${Date.now()}`,
        sender: 'system',
        text: target.openingMessage,
        timestamp: formatTime(),
      },
    ]);
    setCurrentTurn(null);
    setLastTurnStep(1);
    setExploredOptionKeys([]);
    setTriggeredAgents([]);
    setChangedFields([]);
    setIsProfileReset(false);
    setUpdateTick(0);
    setIsTyping(false);
    setPipelineStage(-1);
    setIsMissionComplete(false);
    setFinalOption(null);
    setIsDetailsModalOpen(false);
    setMobileTab('dialogue');
    setAgentUpdatedBadge(false);
    setViewMode('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const computeChangedFields = (
    prevTurn: TurnOutput | null,
    nextTurn: TurnOutput,
    initialProfile: ClientProfile
  ): string[] => {
    const prevProfile = prevTurn ? prevTurn.reasoning.profile : initialProfile;
    const nextProfile = nextTurn.reasoning.profile;
    const changed: string[] = [];

    if (!prevTurn || prevTurn.reasoning.goals.main_goal !== nextTurn.reasoning.goals.main_goal) {
      changed.push('main_goal');
    }

    (Object.keys(nextProfile) as (keyof ClientProfile)[]).forEach((key) => {
      if (prevProfile[key] !== nextProfile[key]) {
        changed.push(key);
      }
    });

    return changed;
  };

  const handleChooseOption = (option: ScenarioOption) => {
    if (isTyping || isMissionComplete) return;

    clearPendingTimers();
    setShowOnboardingHint(false);

    const clientMsg: ChatMessage = {
      id: `client-${Date.now()}`,
      sender: 'client',
      text: option.text,
      timestamp: formatTime(),
      stepNumber: currentStepNumber,
    };

    setMessages((prev) => [...prev, clientMsg]);
    setIsTyping(true);
    setPipelineStage(0);

    const stageDelays = [160, 320, 480, 640, 820];
    stageDelays.forEach((delay, idx) => {
      const t = window.setTimeout(() => {
        if (idx < 4) {
          setPipelineStage(idx + 1);
        } else {
          // Finalize turn
          const prevTurn = currentTurn;
          const nextTurn = option.turn;
          const diff = computeChangedFields(prevTurn, nextTurn, activeScenario.initialProfile);

          // Track triggered expert agents for mission summary
          const usedKeys = (Object.keys(nextTurn.reasoning.expert_agents) as ExpertAgentKey[]).filter(
            (key) => nextTurn.reasoning.expert_agents[key].used
          );
          setTriggeredAgents((prev) => Array.from(new Set([...prev, ...usedKeys])));

          setCurrentTurn(nextTurn);
          setLastTurnStep(currentStepNumber);
          setChangedFields(diff);
          setIsProfileReset(Boolean(option.isProfileReset));
          setUpdateTick((tick) => tick + 1);
          setPipelineStage(5);
          setIsTyping(false);
          setAgentUpdatedBadge(true);

          const systemMsg: ChatMessage = {
            id: `sys-${Date.now()}`,
            sender: 'system',
            text: nextTurn.answer,
            timestamp: formatTime(),
            turnOutput: nextTurn,
            isProfileReset: option.isProfileReset,
            stepNumber: currentStepNumber,
          };
          setMessages((prev) => [...prev, systemMsg]);

          if (option.isFinalChoice) {
            setIsMissionComplete(true);
            setFinalOption(option);
            const summaryTimer = window.setTimeout(() => {
              setViewMode('summary');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1150);
            timersRef.current.push(summaryTimer);
          } else if (option.advancesStep) {
            setCurrentStepNumber((step) => Math.min(activeScenario.totalSteps, step + 1));
          } else {
            const optionKey = `${currentStepNumber}-${option.id}`;
            setExploredOptionKeys((prev) =>
              prev.includes(optionKey) ? prev : [...prev, optionKey]
            );
          }
        }
      }, delay);
      timersRef.current.push(t);
    });
  };

  const handleSendFreeText = (text: string) => {
    if (isTyping) return;
    clearPendingTimers();
    setShowOnboardingHint(false);

    const clientMsg: ChatMessage = {
      id: `client-free-${Date.now()}`,
      sender: 'client',
      text,
      timestamp: formatTime(),
    };
    setMessages((prev) => [...prev, clientMsg]);
    setIsTyping(true);

    const t = window.setTimeout(() => {
      setIsTyping(false);
      const guardMsg: ChatMessage = {
        id: `guard-${Date.now()}`,
        sender: 'system',
        text: 'Это демо-стенд: здесь показан заранее записанный сценарий работы системы. Вы можете продолжить текущий диалог кнопками ниже или переключиться на любой из трёх примеров:',
        timestamp: formatTime(),
        isDemoGuard: true,
      };
      setMessages((prev) => [...prev, guardMsg]);
    }, 450);

    timersRef.current.push(t);
  };

  const currentStepData =
    activeScenario.steps.find((s) => s.stepNumber === currentStepNumber) ??
    activeScenario.steps[0];

  const selectedAgentLabel = useMemo(() => {
    if (!currentTurn) return '';
    const keys = currentTurn.reasoning.router.order as ExpertAgentKey[];
    const names = keys
      .filter((k) => currentTurn.reasoning.expert_agents[k]?.used)
      .map((k) => EXPERT_AGENT_META[k]?.shortName ?? k);
    return names.join(' + ');
  }, [currentTurn]);

  if (viewMode === 'landing') {
    return <HeroSection onSelectScenario={startScenario} />;
  }

  const progressPct = isMissionComplete
    ? 100
    : Math.round(((currentStepNumber - 1) / activeScenario.totalSteps) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Workspace Header */}
      <header className="bg-[#162F58] text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                clearPendingTimers();
                setViewMode('landing');
              }}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-blue-100 hover:text-white transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">На главную</span>
            </button>

            <span aria-hidden="true" className="text-white/25 hidden sm:inline">
              |
            </span>

            <span className="font-display font-bold text-sm sm:text-base text-white truncate">
              {activeScenario.title}
            </span>
          </div>

          {/* Scenario Quick Switcher on Desktop */}
          <div className="hidden lg:flex items-center gap-1 bg-white/10 p-1 rounded-lg">
            {SCENARIOS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => startScenario(sc.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  sc.id === activeScenario.id
                    ? 'bg-white text-[#1B3A6B] font-semibold'
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                {sc.shortTitle}
              </button>
            ))}
          </div>

          {/* Step Progress & Reset */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <span className="font-mono-data text-xs sm:text-sm font-semibold text-white whitespace-nowrap">
                Шаг {currentStepNumber} из {activeScenario.totalSteps}
              </span>
              <div className="hidden sm:block w-20 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-sky-300 transition-all duration-300"
                  style={{ width: `${Math.max(15, progressPct)}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => startScenario(activeScenario.id)}
              title="Начать сценарий заново"
              aria-label="Начать сценарий заново"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Live Pipeline Bar */}
      {viewMode === 'workspace' && (
        <LivePipelineBar
          activeStage={pipelineStage}
          selectedAgentLabel={selectedAgentLabel}
        />
      )}

      {/* Main Body */}
      {viewMode === 'summary' ? (
        <main className="flex-1">
          <MissionSummary
            scenario={activeScenario}
            finalOption={finalOption}
            triggeredAgents={triggeredAgents}
            onReplay={() => startScenario(activeScenario.id)}
            onBackToChat={() => setViewMode('workspace')}
            onSelectScenario={startScenario}
          />
        </main>
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-4">
          {/* Mobile Scenario Selector + Dialogue/Agents Tabs */}
          <div className="lg:hidden space-y-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => startScenario(sc.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border whitespace-nowrap shrink-0 cursor-pointer ${
                    sc.id === activeScenario.id
                      ? 'bg-[#1B3A6B] text-white border-[#1B3A6B]'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {sc.shortTitle}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-slate-200/80">
              <button
                type="button"
                onClick={() => setMobileTab('dialogue')}
                className={`py-2.5 px-3 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  mobileTab === 'dialogue'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Диалог</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileTab('agents');
                  setAgentUpdatedBadge(false);
                }}
                className={`py-2.5 px-3 rounded-lg text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  mobileTab === 'agents'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600'
                }`}
              >
                <Bot className="w-4 h-4" />
                <span>Агенты</span>
                {agentUpdatedBadge && mobileTab !== 'agents' && (
                  <span className="text-[11px] font-bold text-[#1B3A6B]">· обн.</span>
                )}
              </button>
            </div>
          </div>

          {/* 2-Column Workspace on Desktop, Tab-switched on Mobile */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            <div
              className={`lg:col-span-7 flex flex-col ${
                mobileTab === 'dialogue' ? 'block' : 'hidden lg:flex'
              }`}
            >
              <DialoguePanel
                scenario={activeScenario}
                messages={messages}
                currentOptions={currentStepData.options}
                exploredOptionKeys={exploredOptionKeys}
                currentStepNumber={currentStepNumber}
                isTyping={isTyping}
                isMissionComplete={isMissionComplete}
                showOnboardingHint={showOnboardingHint}
                onDismissHint={() => setShowOnboardingHint(false)}
                onChooseOption={handleChooseOption}
                onSendFreeText={handleSendFreeText}
                onSelectScenario={startScenario}
                onOpenSummary={() => setViewMode('summary')}
              />
            </div>

            <div
              className={`lg:col-span-5 flex flex-col ${
                mobileTab === 'agents' ? 'block' : 'hidden lg:flex'
              }`}
            >
              <AgentPanel
                currentTurn={currentTurn}
                initialProfile={activeScenario.initialProfile}
                changedFields={changedFields}
                isProfileReset={isProfileReset}
                updateTick={updateTick}
                onOpenDetails={() => setIsDetailsModalOpen(true)}
              />
            </div>
          </div>
        </main>
      )}

      {/* Full Agent Reasoning Inspection Modal */}
      {isDetailsModalOpen && currentTurn && (
        <AgentReasoningModal
          turn={currentTurn}
          stepNumber={lastTurnStep}
          changedFields={changedFields}
          isProfileReset={isProfileReset}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
}
