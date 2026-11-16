import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, MessageSquare, RotateCcw } from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import { ExpertAgentKey, ScenarioData, ScenarioOption } from '../types/agent';

interface MissionSummaryProps {
  scenario: ScenarioData;
  finalOption: ScenarioOption | null;
  triggeredAgents: ExpertAgentKey[];
  onReplay: () => void;
  onBackToChat: () => void;
  onSelectScenario: (scenarioId: ScenarioData['id']) => void;
}

export const MissionSummary: React.FC<MissionSummaryProps> = ({
  scenario,
  finalOption,
  triggeredAgents,
  onReplay,
  onBackToChat,
  onSelectScenario,
}) => {
  const targetProbability =
    finalOption?.missionOutcomeOverride?.probability ??
    scenario.missionSummary.defaultProbability;

  const outcomeText =
    finalOption?.missionOutcomeOverride?.summary ?? scenario.missionSummary.defaultOutcome;

  const nextStepText =
    finalOption?.missionOutcomeOverride?.nextStep ?? scenario.missionSummary.defaultNextStep;

  const statusLabel =
    finalOption?.missionOutcomeOverride?.statusLabel ?? 'Миссия выполнена';

  const visibleTakeaways = scenario.missionSummary.agentTakeaways.filter(
    (item) => !item.conditional || (item.agentKey && triggeredAgents.includes(item.agentKey))
  );

  const [animatedPct, setAnimatedPct] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);

  // Animate probability counter from 0 to targetProbability
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setAnimatedPct(targetProbability);
      setRevealedCount(visibleTakeaways.length);
      return;
    }

    setAnimatedPct(0);
    const duration = 1100;
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPct(Math.round(eased * targetProbability));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [targetProbability, visibleTakeaways.length]);

  // Staggered reveal of participating agent conclusions one by one
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setRevealedCount(visibleTakeaways.length);
      return;
    }

    setRevealedCount(0);
    const interval = setInterval(() => {
      setRevealedCount((prev) => {
        if (prev >= visibleTakeaways.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [visibleTakeaways.length]);

  const otherScenarios = SCENARIOS.filter((s) => s.id !== scenario.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Top Outcome Banner */}
      <div
        className="rounded-2xl text-white p-6 sm:p-8 shadow-lg"
        style={{
          background: 'linear-gradient(150deg, #1B3A6B 0%, #102548 100%)',
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="text-xs font-medium text-blue-200">
              Итог миссии · {scenario.title} · {statusLabel}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold leading-tight [text-wrap:balance]">
              {outcomeText}
            </h2>
            <p className="text-sm sm:text-base text-blue-100/90 pt-1">
              <span className="font-semibold text-white">Следующий шаг:</span> {nextStepText}
            </p>
          </div>

          <div className="bg-white/10 border border-white/20 rounded-2xl px-6 py-5 text-center shrink-0 min-w-[180px]">
            <div className="text-xs font-medium text-blue-100">Итоговая вероятность</div>
            <div className="mt-1 font-mono-data text-4xl sm:text-5xl font-bold text-white">
              {animatedPct}%
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-sky-300 transition-all duration-300"
                style={{ width: `${animatedPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 pt-5 border-t border-white/15 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBackToChat}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#1B3A6B] text-sm font-semibold hover:bg-blue-50 transition-colors cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Вернуться к переписке и JSON</span>
          </button>
          <button
            type="button"
            onClick={onReplay}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/25 text-white text-sm font-semibold hover:bg-white/20 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Пройти сценарий заново</span>
          </button>
        </div>
      </div>

      {/* Staggered Agent Takeaways */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
              Участвовавшие агенты и их вклад
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Выводы раскрываются по очереди ({revealedCount} из {visibleTakeaways.length})
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {visibleTakeaways.map((item, idx) => {
            const isVisible = idx < revealedCount;
            return (
              <div
                key={item.agentName}
                className={`rounded-xl border border-slate-200 p-4 transition-all duration-300 ${
                  isVisible ? 'opacity-100 translate-y-0 bg-white' : 'opacity-0 translate-y-2 bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-display font-bold text-sm text-[#1B3A6B]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>{item.agentName}</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500">{item.role}</span>
                </div>
                <p className="mt-2 text-sm text-slate-700 leading-relaxed">{item.takeaway}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Try Other Scenarios */}
      <section className="space-y-4">
        <h3 className="font-display text-lg sm:text-xl font-bold text-slate-900">
          Проверьте тот же движок на других темах
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {otherScenarios.map((other) => (
            <div
              key={other.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:border-[#1B3A6B]/40 transition-all flex flex-col justify-between gap-4"
            >
              <div>
                <div className="text-xs font-medium text-slate-500">
                  {other.category} · {other.clientRole}
                </div>
                <h4 className="mt-1.5 font-display text-lg font-bold text-slate-900">
                  {other.title}
                </h4>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{other.description}</p>
              </div>
              <button
                type="button"
                onClick={() => onSelectScenario(other.id)}
                className="self-start inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1B3A6B] text-white text-sm font-semibold hover:bg-[#142D54] transition-colors cursor-pointer"
              >
                <span>Запустить сценарий</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
