import React, { useState } from 'react';
import { Check, Copy, X } from 'lucide-react';
import {
  EXPERT_AGENT_META,
  GOAL_LABELS,
  PROFILE_FIELD_LABELS,
} from '../data/scenarios';
import { ClientProfile, ExpertAgentKey, GoalKey, TurnOutput } from '../types/agent';

interface AgentReasoningModalProps {
  turn: TurnOutput;
  stepNumber: number;
  changedFields: string[];
  isProfileReset: boolean;
  onClose: () => void;
}

export const AgentReasoningModal: React.FC<AgentReasoningModalProps> = ({
  turn,
  stepNumber,
  changedFields,
  isProfileReset,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState<'structured' | 'json'>('structured');
  const [copied, setCopied] = useState(false);

  const { goals, profile, router, expert_agents } = turn.reasoning;

  const goalKeys = Object.keys(GOAL_LABELS) as GoalKey[];
  const profileKeys = Object.keys(PROFILE_FIELD_LABELS) as (keyof ClientProfile)[];
  const allExpertKeys = Object.keys(EXPERT_AGENT_META) as ExpertAgentKey[];

  const usedExperts = allExpertKeys.filter((k) => expert_agents[k].used);
  const unusedExperts = allExpertKeys.filter((k) => !expert_agents[k].used);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(turn, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard fallback ignored silently
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reasoning-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          <div>
            <div className="text-xs font-medium text-slate-500 font-mono-data">
              Шаг {stepNumber} · Полный разбор работы системы
            </div>
            <h3
              id="reasoning-modal-title"
              className="font-display text-lg sm:text-xl font-bold text-slate-900"
            >
              Как думали агенты на этом ходе
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center p-1 rounded-lg bg-slate-200/70">
              <button
                type="button"
                onClick={() => setViewMode('structured')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'structured'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Структурный разбор
              </button>
              <button
                type="button"
                onClick={() => setViewMode('json')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  viewMode === 'json'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                JSON хода
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Закрыть подробный разбор"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-8">
          {viewMode === 'json' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-slate-500">
                  Строгое разделение внутренней логики (<code className="font-mono-data">reasoning</code>) и ответа клиенту (<code className="font-mono-data">answer</code>)
                </p>
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Скопировано</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Копировать JSON</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="rounded-xl bg-slate-950 text-slate-100 p-4 sm:p-5 text-xs font-mono-data overflow-x-auto leading-relaxed">
                {JSON.stringify(turn, null, 2)}
              </pre>
            </div>
          ) : (
            <>
              {/* 1. Агент-Целей */}
              <section className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <h4 className="font-display text-base font-bold text-slate-900">
                    1. Агент-Целей (оценка по 6 целям)
                  </h4>
                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-[#1B3A6B]">Главная:</span> {goals.main_goal}
                    <span className="mx-1.5 text-slate-300">·</span>
                    <span className="font-semibold text-slate-700">Второстепенная:</span>{' '}
                    {goals.secondary_goal}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {goalKeys.map((gKey) => {
                    const g = goals[gKey];
                    const pct = Math.min(100, Math.max(0, g.score * 10));
                    const isTop = g.score >= 7;

                    return (
                      <div
                        key={gKey}
                        className={`rounded-xl border p-3.5 ${
                          isTop
                            ? 'border-[#1B3A6B]/30 bg-blue-50/35'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-semibold text-slate-900">
                            {GOAL_LABELS[gKey]}
                          </span>
                          <span
                            className={`font-mono-data text-xs font-bold ${
                              isTop ? 'text-[#1B3A6B]' : 'text-slate-600'
                            }`}
                          >
                            {g.score} / 10
                          </span>
                        </div>
                        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isTop ? 'bg-[#1B3A6B]' : 'bg-slate-400'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">{g.reason}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 2. Агент-Профайлер */}
              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                  <h4 className="font-display text-base font-bold text-slate-900">
                    2. Агент-Профайлер (полный профиль клиента)
                  </h4>
                  {isProfileReset && (
                    <span className="text-xs font-semibold text-amber-800">
                      Профиль сброшен и пересобран под новую тему
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {profileKeys.map((pKey) => {
                    const changed = changedFields.includes(pKey);
                    return (
                      <div
                        key={pKey}
                        className={`rounded-xl border p-3.5 ${
                          changed
                            ? 'border-blue-300 bg-blue-50/45'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <div className="text-[11px] font-medium text-slate-500">
                          {PROFILE_FIELD_LABELS[pKey]}
                        </div>
                        <div className="mt-1 text-sm font-semibold text-slate-900 leading-snug">
                          {profile[pKey]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 3. Агент-Маршрутизатор */}
              <section className="space-y-3">
                <h4 className="font-display text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                  3. Агент-Маршрутизатор
                </h4>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
                  <div>
                    <span className="text-slate-500">Выбраны агенты: </span>
                    <span className="font-semibold text-[#1B3A6B]">
                      {router.selected_agents.join(' → ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Причина маршрутизации: </span>
                    <span className="text-slate-800">{router.reason}</span>
                  </div>
                </div>
              </section>

              {/* 4. Экспертные агенты (обязательный отдельный блок для каждого выбранного) */}
              <section className="space-y-4">
                <h4 className="font-display text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                  4. Экспертные агенты (активные: {usedExperts.length} из 10)
                </h4>

                <div className="space-y-3">
                  {usedExperts.map((key) => (
                    <div
                      key={key}
                      className="rounded-xl border border-[#1B3A6B]/30 bg-blue-50/35 p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-sm font-bold text-[#1B3A6B]">
                          {EXPERT_AGENT_META[key].name}
                        </span>
                        <span className="font-mono-data text-xs font-semibold text-emerald-700">
                          used: true
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-800 leading-relaxed">
                        {expert_agents[key].response}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Неиспользованные агенты в этом ходе */}
                <div className="pt-2">
                  <div className="text-xs font-medium text-slate-500 mb-2">
                    Не вызывались на этом ходе (used: false):
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {unusedExperts.map((key) => (
                      <div
                        key={key}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500"
                      >
                        {EXPERT_AGENT_META[key].shortName}
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 5. Агент-Ответа */}
              <section className="space-y-3">
                <h4 className="font-display text-base font-bold text-slate-900 pb-2 border-b border-slate-200">
                  5. Агент-Ответа (итоговая реплика клиенту)
                </h4>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-900 leading-relaxed">
                  {turn.answer}
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
