import React from 'react';
import { ChevronRight, RefreshCw, ShieldAlert, Cpu } from 'lucide-react';
import { EXPERT_AGENT_META } from '../data/scenarios';
import { ClientProfile, ExpertAgentKey, TurnOutput } from '../types/agent';

interface AgentPanelProps {
  currentTurn: TurnOutput | null;
  initialProfile: ClientProfile;
  changedFields: string[];
  isProfileReset: boolean;
  updateTick: number;
  onOpenDetails: () => void;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({
  currentTurn,
  initialProfile,
  changedFields,
  isProfileReset,
  updateTick,
  onOpenDetails,
}) => {
  const profile = currentTurn ? currentTurn.reasoning.profile : initialProfile;
  const goals = currentTurn?.reasoning.goals;
  const router = currentTurn?.reasoning.router;
  const expertAgents = currentTurn?.reasoning.expert_agents;

  const probNumeric = parseInt(profile.purchase_probability.replace(/\D/g, ''), 10) || 0;

  const activeExpertKeys: ExpertAgentKey[] = router
    ? (router.order as ExpertAgentKey[]).filter(
        (key) => expertAgents && expertAgents[key]?.used
      )
    : [];

  const isHighlighted = (field: string) => changedFields.includes(field);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between p-5 sm:p-6">
      <div className="space-y-5">
        {/* Panel Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-display text-base sm:text-lg font-bold text-slate-900">
              Панель работы агентов
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {currentTurn
                ? 'Ключевые выводы последнего хода системы'
                : 'Ожидание первой реплики клиента'}
            </p>
          </div>
          <Cpu className="w-5 h-5 text-[#1B3A6B] shrink-0 mt-0.5" />
        </div>

        {/* Profile Reset Alert (Scenario 1, Step 2, Option B) */}
        {isProfileReset && (
          <div
            key={`reset-${updateTick}`}
            className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs sm:text-sm text-amber-950 flex items-start gap-2.5 animate-profile-reset"
          >
            <RefreshCw className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Тема изменилась — профиль пересобран</div>
              <div className="text-amber-900/80 text-xs mt-0.5">
                Агент-Профайлер сбросил предыдущий контекст и начал оценку новой задачи с нуля.
              </div>
            </div>
          </div>
        )}

        {/* Selected Expert Agent(s) */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-500">
            Выбранный эксперт {activeExpertKeys.length > 1 ? `(цепочка: ${activeExpertKeys.length})` : ''}
          </div>

          {!currentTurn ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
              Выберите реплику слева — маршрутизатор подберёт нужного эксперта.
            </div>
          ) : (
            <div className="space-y-2">
              {activeExpertKeys.map((agentKey) => {
                const meta = EXPERT_AGENT_META[agentKey];
                const agentResponse = expertAgents?.[agentKey]?.response;
                const isProtection = agentKey === 'protection';

                return (
                  <div
                    key={`${agentKey}-${updateTick}`}
                    className={`rounded-xl border px-4 py-3 transition-colors ${
                      isProtection
                        ? 'border-amber-200 bg-amber-50/60'
                        : 'border-slate-200 bg-slate-50/80'
                    } ${updateTick > 0 ? 'animate-field-highlight' : ''}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#1B3A6B] flex items-center gap-1.5">
                        {isProtection && <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />}
                        {meta?.name ?? agentKey}
                      </span>
                      <span className="text-[11px] font-medium text-emerald-700">активен</span>
                    </div>
                    {agentResponse && (
                      <p className="mt-1.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                        {agentResponse}
                      </p>
                    )}
                  </div>
                );
              })}

              {router?.reason && (
                <p className="text-xs text-slate-500 px-1 leading-relaxed">
                  Логика маршрутизатора: {router.reason}
                </p>
              )}
            </div>
          )}
        </div>

        {/* 3 Key Compact Fields */}
        <div className="space-y-3 pt-1">
          <div className="text-xs font-semibold text-slate-500">
            Ключевые показатели хода
          </div>

          {/* 1. Главная цель */}
          <div
            key={`goal-${updateTick}-${goals?.main_goal ?? 'init'}`}
            className={`rounded-xl border border-slate-200 px-4 py-3 ${
              isHighlighted('main_goal') ? 'animate-field-highlight' : 'bg-white'
            }`}
          >
            <div className="text-xs text-slate-500">Главная цель</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {goals ? goals.main_goal : 'Определить запрос клиента'}
            </div>
          </div>

          {/* 2. Главное возражение */}
          <div
            key={`obj-${updateTick}-${profile.main_objection}`}
            className={`rounded-xl border border-slate-200 px-4 py-3 ${
              isHighlighted('main_objection') || isProfileReset
                ? isProfileReset
                  ? 'animate-profile-reset'
                  : 'animate-field-highlight'
                : 'bg-white'
            }`}
          >
            <div className="text-xs text-slate-500">Главное возражение</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">
              {profile.main_objection}
            </div>
          </div>

          {/* 3. Вероятность сделки */}
          <div
            key={`prob-${updateTick}-${profile.purchase_probability}`}
            className={`rounded-xl border border-slate-200 px-4 py-3.5 ${
              isHighlighted('purchase_probability') || isProfileReset
                ? isProfileReset
                  ? 'animate-profile-reset'
                  : 'animate-field-highlight'
                : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">Вероятность сделки</span>
              <span className="font-mono-data text-lg font-bold text-[#1B3A6B]">
                {profile.purchase_probability}
              </span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#1B3A6B] transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, probNumeric))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Expand Full Details Button */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onOpenDetails}
          disabled={!currentTurn}
          className="w-full px-4 py-3 rounded-xl border border-[#1B3A6B]/25 bg-blue-50/50 text-[#1B3A6B] text-sm font-semibold hover:bg-[#1B3A6B] hover:text-white transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed"
        >
          <span>Подробнее: как думали агенты</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
