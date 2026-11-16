import React from 'react';
import { Check } from 'lucide-react';

export type PipelineStageIndex = 0 | 1 | 2 | 3 | 4 | 5; // 0 = idle, 1..5 active stage, 5 done

interface LivePipelineBarProps {
  activeStage: number; // -1 = idle/initial, 0..4 = currently pulsing, 5 = all completed
  selectedAgentLabel: string;
}

const STAGES = [
  { id: 'goals', label: 'Цели' },
  { id: 'profiler', label: 'Профайлер' },
  { id: 'router', label: 'Маршрутизатор' },
  { id: 'experts', label: 'Эксперты' },
  { id: 'answer', label: 'Ответ' },
];

export const LivePipelineBar: React.FC<LivePipelineBarProps> = ({
  activeStage,
  selectedAgentLabel,
}) => {
  return (
    <div className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {STAGES.map((stage, idx) => {
            const isCompleted = activeStage > idx;
            const isActive = activeStage === idx;
            const displayLabel =
              stage.id === 'experts' && selectedAgentLabel && (isActive || isCompleted)
                ? selectedAgentLabel
                : stage.label;

            return (
              <React.Fragment key={stage.id}>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#1B3A6B] text-white border-[#1B3A6B] animate-node-pulse'
                      : isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  ) : (
                    <span
                      className={`font-mono-data text-[11px] ${
                        isActive ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {idx + 1}
                    </span>
                  )}
                  <span className="truncate max-w-[180px] sm:max-w-[240px]">{displayLabel}</span>
                </div>
                {idx < STAGES.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={`text-xs shrink-0 ${
                      isCompleted ? 'text-emerald-500' : 'text-slate-300'
                    }`}
                  >
                    →
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
