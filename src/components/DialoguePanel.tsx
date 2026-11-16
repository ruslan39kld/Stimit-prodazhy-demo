import React, { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, X, Check, Award } from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';
import { ChatMessage, ScenarioData, ScenarioOption } from '../types/agent';

interface DialoguePanelProps {
  scenario: ScenarioData;
  messages: ChatMessage[];
  currentOptions: ScenarioOption[];
  exploredOptionKeys: string[];
  currentStepNumber: number;
  isTyping: boolean;
  isMissionComplete: boolean;
  showOnboardingHint: boolean;
  onDismissHint: () => void;
  onChooseOption: (option: ScenarioOption) => void;
  onSendFreeText: (text: string) => void;
  onSelectScenario: (scenarioId: ScenarioData['id']) => void;
  onOpenSummary: () => void;
}

export const DialoguePanel: React.FC<DialoguePanelProps> = ({
  scenario,
  messages,
  currentOptions,
  exploredOptionKeys,
  currentStepNumber,
  isTyping,
  isMissionComplete,
  showOnboardingHint,
  onDismissHint,
  onChooseOption,
  onSendFreeText,
  onSelectScenario,
  onOpenSummary,
}) => {
  const [inputText, setInputText] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isTyping, isMissionComplete]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || isTyping) return;
    setInputText('');
    onSendFreeText(trimmed);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full min-h-[540px] lg:min-h-[640px] overflow-hidden">
      {/* Chat Header */}
      <div className="px-4 sm:px-5 py-3.5 border-b border-slate-200 flex items-center justify-between gap-3 bg-slate-50/70">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-900 truncate">
            {scenario.sellerRole}
          </div>
          <div className="text-xs text-slate-500 truncate">
            Вы играете за клиента: {scenario.clientRole}
          </div>
        </div>
        <div className="text-xs font-medium text-slate-500 whitespace-nowrap shrink-0">
          {isMissionComplete ? 'Сценарий завершён' : `Цель: ${scenario.goal}`}
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-5 space-y-4">
        {messages.map((msg) => {
          const isClient = msg.sender === 'client';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
            >
              <div className="text-[11px] font-medium text-slate-400 mb-1 px-1">
                {isClient ? 'Вы (клиент)' : 'AI-система'}
                <span className="mx-1.5">·</span>
                <span className="font-mono-data">{msg.timestamp}</span>
              </div>

              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl px-4 py-3 text-sm sm:text-[15px] leading-relaxed transition-opacity ${
                  isClient
                    ? 'bg-[#1B3A6B] text-white rounded-tr-sm'
                    : msg.isDemoGuard
                    ? 'bg-amber-50 text-slate-800 border border-amber-200 rounded-tl-sm'
                    : 'bg-slate-100 text-slate-900 border border-slate-200/80 rounded-tl-sm'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>

                {msg.isDemoGuard && (
                  <div className="mt-3 pt-3 border-t border-amber-200/80 flex flex-wrap gap-2">
                    {SCENARIOS.map((sc) => (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => onSelectScenario(sc.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          sc.id === scenario.id
                            ? 'bg-[#1B3A6B] text-white'
                            : 'bg-white text-slate-700 border border-slate-300 hover:border-[#1B3A6B]'
                        }`}
                      >
                        {sc.id === scenario.id ? `Продолжить: ${sc.shortTitle}` : sc.shortTitle}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex flex-col items-start">
            <div className="text-[11px] font-medium text-slate-400 mb-1 px-1">
              AI-система анализирует и печатает…
            </div>
            <div className="bg-slate-100 border border-slate-200/80 rounded-2xl rounded-tl-sm px-4 py-3 inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1B3A6B]/60 animate-bounce [animation-delay:-0.2s]" />
              <span className="w-2 h-2 rounded-full bg-[#1B3A6B]/60 animate-bounce [animation-delay:-0.1s]" />
              <span className="w-2 h-2 rounded-full bg-[#1B3A6B]/60 animate-bounce" />
              <span className="ml-2 text-xs font-medium text-slate-500">печатает…</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Onboarding Hint Bubble */}
      {showOnboardingHint && !isMissionComplete && (
        <div className="mx-4 sm:mx-5 mb-3 rounded-xl bg-blue-50 border border-blue-200 px-4 py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm text-[#1B3A6B]">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 shrink-0 text-blue-600" />
            <span>
              Вы отвечаете за клиента — выбирайте реплики и смотрите, как думают агенты
            </span>
          </div>
          <button
            type="button"
            onClick={onDismissHint}
            aria-label="Скрыть подсказку"
            className="p-1 rounded-md hover:bg-blue-100 text-blue-700 cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Client Reply Buttons OR Mission Complete Banner */}
      <div className="border-t border-slate-200 bg-slate-50/90 p-4 sm:p-5 space-y-3">
        {isMissionComplete ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Award className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-emerald-950">
                  Диалог завершён — итог миссии готов
                </div>
                <div className="text-xs text-emerald-800 mt-0.5">
                  Вы можете изучить переписку и разбор агентов или перейти к экрану итогов.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={onOpenSummary}
              className="px-5 py-2.5 rounded-xl bg-[#1B3A6B] text-white text-sm font-semibold hover:bg-[#142D54] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Открыть итог миссии
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                Выберите реплику клиента (Шаг {currentStepNumber} из {scenario.totalSteps})
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {currentOptions.map((option) => {
                const optionKey = `${currentStepNumber}-${option.id}`;
                const wasExplored = exploredOptionKeys.includes(optionKey);

                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={isTyping}
                    onClick={() => onChooseOption(option)}
                    className={`w-full text-left px-4 py-3.5 min-h-[48px] rounded-xl border text-sm font-medium transition-all flex items-center justify-between gap-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      wasExplored
                        ? 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-white hover:border-slate-300'
                        : 'bg-white border-slate-200 text-slate-900 shadow-xs hover:border-[#1B3A6B] hover:bg-blue-50/40 active:scale-[0.995]'
                    }`}
                  >
                    <span className="leading-snug">{option.text}</span>
                    {wasExplored && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 whitespace-nowrap shrink-0">
                        <Check className="w-3.5 h-3.5" />
                        проверено
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Free-text Demo Guard Input */}
        <form onSubmit={handleSubmit} className="pt-1 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isTyping}
            placeholder="Или напишите свой вопрос (проверка режима демо-стенда)…"
            className="flex-1 min-w-0 h-11 px-3.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#1B3A6B] disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={isTyping || !inputText.trim()}
            aria-label="Отправить сообщение"
            className="h-11 px-4 rounded-xl bg-slate-200 text-slate-700 hover:bg-[#1B3A6B] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer inline-flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
