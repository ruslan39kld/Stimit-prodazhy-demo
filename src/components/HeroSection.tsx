import React from 'react';
import { ArrowRight, CheckCircle2, Layers, ShieldCheck, Users } from 'lucide-react';
import { EXPERT_AGENT_META, SCENARIOS } from '../data/scenarios';
import { ExpertAgentKey, ScenarioData } from '../types/agent';

interface HeroSectionProps {
  onSelectScenario: (scenarioId: ScenarioData['id']) => void;
}

const PIPELINE_NODES = [
  { id: 'goals', label: 'Цели', sub: '6 критериев' },
  { id: 'profiler', label: 'Профайлер', sub: '9 полей' },
  { id: 'router', label: 'Маршрутизатор', sub: 'Выбор тактики' },
  { id: 'experts', label: 'Эксперты', sub: 'Пул из 10' },
  { id: 'answer', label: 'Ответ', sub: 'Единая реплика' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectScenario }) => {
  const mainScenario = SCENARIOS[0];
  const expertKeys = Object.keys(EXPERT_AGENT_META) as ExpertAgentKey[];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Top Bar — 3-zone contract */}
      <header className="bg-[#162F58] border-b border-white/10 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="font-display text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0"
          >
            Универсальный AI-продажник
          </a>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-blue-100/80">
            <a
              href="#pipeline"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Как работает
            </a>
            <a
              href="#scenarios"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Сценарии
            </a>
            <a
              href="#agents"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              10 агентов
            </a>
          </nav>

          <button
            type="button"
            onClick={() => onSelectScenario(mainScenario.id)}
            className="px-4 py-2 rounded-lg bg-white text-[#1B3A6B] text-xs sm:text-sm font-semibold hover:bg-blue-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Смотреть пример
          </button>
        </div>
      </header>

      {/* Dark-Blue STIMIT Hero Block */}
      <section
        id="top"
        className="relative overflow-hidden text-white"
        style={{
          background: 'linear-gradient(155deg, #1B3A6B 0%, #12294F 58%, #0B1B36 100%)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-medium text-blue-200/90 mb-4 tracking-wide">
              Интерактивный демо-стенд · Автономная симуляция без API
            </p>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.12] text-white [text-wrap:balance]">
              Как AI ведёт продажу от первого вопроса до сделки?
            </h1>
            <p className="mt-5 text-base sm:text-lg text-blue-100/90 leading-relaxed max-w-2xl">
              Вы — клиент. Выбирайте реплики и смотрите, как команда из 10 агентов анализирует вас,
              выбирает тактику и закрывает сделку — в трёх разных темах на одном движке.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-4">
              <button
                type="button"
                onClick={() => onSelectScenario(mainScenario.id)}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-white text-[#1B3A6B] font-display font-bold text-base shadow-lg shadow-black/20 hover:bg-blue-50 active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
              >
                <span>Смотреть пример</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <div className="text-sm text-blue-100/80 leading-snug">
                <span className="font-semibold text-white">Сценарий 1:</span> «AI-проект на заказ»
                <span className="mx-1.5 text-blue-300/50">·</span>
                5 шагов · Запись на аудит
              </div>
            </div>
          </div>

          {/* Animated Agent Pipeline Diagram */}
          <div
            id="pipeline"
            className="mt-12 sm:mt-14 pt-8 border-t border-white/15"
            aria-label="Схема конвейера агентов"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs sm:text-sm font-medium text-blue-200">
                Обязательная цепочка на каждый ход диалога
              </span>
              <span className="hidden sm:inline text-xs text-blue-200/70">
                Живой разбор каждого шага в панели агентов
              </span>
            </div>

            <div className="relative">
              {/* Travelling signal bar on desktop */}
              <div
                aria-hidden="true"
                className="hidden lg:block absolute top-1/2 left-6 right-6 -translate-y-1/2 h-0.5 bg-white/15 overflow-hidden rounded-full pointer-events-none"
              >
                <div className="w-full h-full animate-signal-travel">
                  <div className="w-24 h-full bg-gradient-to-r from-transparent via-sky-300 to-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 relative z-10">
                {PIPELINE_NODES.map((node, index) => (
                  <div
                    key={node.id}
                    className={`rounded-xl bg-[#16315D]/90 border border-white/20 px-4 py-3.5 backdrop-blur-sm ${
                      index === 4 ? 'col-span-2 sm:col-span-1' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-mono-data text-[11px] font-semibold text-blue-200/80">
                        0{index + 1}
                      </span>
                      <span
                        aria-hidden="true"
                        className="w-2 h-2 rounded-full bg-sky-300 animate-node-pulse"
                        style={{ animationDelay: `${index * 0.28}s` }}
                      />
                    </div>
                    <div className="font-display font-semibold text-sm text-white">
                      {node.label}
                    </div>
                    <div className="text-xs text-blue-200/80 mt-0.5">{node.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1">
        {/* Second Row: All 3 Scenarios as Cards */}
        <section id="scenarios" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Три разных темы на одном движке
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl">
              Логика агентов не меняется — меняются продукт, профиль клиента и набор подключаемых
              экспертов. Выберите любой сценарий для прохождения.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SCENARIOS.map((scenario, idx) => {
              const isFirst = idx === 0;
              const categoryLabel = isFirst ? 'B2B' : scenario.category;
              const descriptionText = isFirst
                ? 'Владелец сети кофеен спрашивает цену AI-бота и торгуется. Система уточняет задачу, считает окупаемость, отрабатывает возражение "дорого" и закрывает на бесплатный аудит.'
                : scenario.description;
              const expertsLabel = isFirst
                ? 'Диагност · Разработчик · Продажник · Возражения · Закрытие'
                : scenario.featuredAgentsLabel;

              return (
                <article
                  key={scenario.id}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-[#1B3A6B]/35 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-medium text-slate-500 flex flex-wrap items-center gap-1.5">
                      <span>Сценарий {idx + 1}</span>
                      <span aria-hidden="true">·</span>
                      <span>{categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-data">{scenario.totalSteps} шагов</span>
                    </div>

                    <h3 className="mt-2.5 font-display text-xl font-bold text-slate-900 group-hover:text-[#1B3A6B] transition-colors">
                      {scenario.title}
                    </h3>

                    <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                      {descriptionText}
                    </p>

                    <dl className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-sm">
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-slate-500 shrink-0">Ваша роль</dt>
                        <dd className="text-slate-900 font-medium text-right">
                          {scenario.clientRole}
                        </dd>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-slate-500 shrink-0">Цель диалога</dt>
                        <dd className="text-slate-900 font-medium text-right">{scenario.goal}</dd>
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <dt className="text-slate-500 shrink-0">Эксперты</dt>
                        <dd className="text-slate-700 text-right text-xs leading-relaxed">
                          {expertsLabel}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onSelectScenario(scenario.id)}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1B3A6B] text-white text-sm font-semibold hover:bg-[#142D54] transition-colors cursor-pointer"
                    >
                      <span>Пройти сценарий</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* System Overview & 10-Agent Pool */}
        <section id="agents" className="border-t border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="max-w-2xl mb-8">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Пул из 10 экспертных агентов
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600">
                Агент-Маршрутизатор выбирает на каждый ход только тех экспертов, которые нужны
                именно сейчас — одного, нескольких или цепочку.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="flex items-center gap-2.5 text-[#1B3A6B] font-display font-bold text-sm">
                  <Layers className="w-4 h-4 shrink-0" />
                  <span>Прозрачная логика JSON</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Внутренний разбор (`reasoning`) и текст клиенту (`answer`) строго разделены. Вы
                  можете раскрыть JSON любого хода.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5">
                <div className="flex items-center gap-2.5 text-[#1B3A6B] font-display font-bold text-sm">
                  <Users className="w-4 h-4 shrink-0" />
                  <span>Живой профиль клиента</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Профайлер обновляет 9 полей после вашей реплики. При резкой смене темы старый
                  профиль сбрасывается и строится заново.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-5 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2.5 text-[#1B3A6B] font-display font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Проверка на провокациях</span>
                </div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  Попробуйте попросить скидку 50%, задать вопрос про 152-ФЗ или попросить стих —
                  сработают Юрист и Защита.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {expertKeys.map((key) => {
                const agent = EXPERT_AGENT_META[key];
                return (
                  <div
                    key={key}
                    className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1B3A6B] shrink-0" />
                        <span>{agent.shortName}</span>
                      </div>
                      <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                        {agent.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>Универсальный AI-продажник · Интерактивный демо-стенд</span>
          <span>Автономная работа на встроенных сценариях</span>
        </div>
      </footer>
    </div>
  );
};
