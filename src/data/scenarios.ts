import { ExpertAgentKey, GoalKey, ScenarioData } from '../types/agent';

export const EXPERT_AGENT_META: Record<
  ExpertAgentKey,
  {
    name: string;
    shortName: string;
    description: string;
  }
> = {
  diagnost: {
    name: 'Агент-Диагност',
    shortName: 'Диагност',
    description: 'Проясняет ситуацию клиента: задаёт 1–2 точных вопроса без анкеты.',
  },
  presenter: {
    name: 'Агент-Презентатор',
    shortName: 'Презентатор',
    description: 'Показывает решение под конкретную боль клиента простым языком.',
  },
  sales: {
    name: 'Агент-Продажник',
    shortName: 'Продажник',
    description: 'Формулирует оффер, называет цену в рублях и привязывает её к окупаемости.',
  },
  objections: {
    name: 'Агент-Работы-с-Возражениями',
    shortName: 'Работа-с-Возражениями',
    description: 'Снимает возражения («дорого», «нет времени», «не разберусь») без давления.',
  },
  closing: {
    name: 'Агент-Закрытия',
    shortName: 'Закрытие',
    description: 'Фиксирует конкретный следующий шаг: аудит, пробный урок или демо-доступ.',
  },
  developer: {
    name: 'Агент-Разработчик',
    shortName: 'Разработчик',
    description: 'Даёт техническую оценку: архитектура MVP, сроки и риски внедрения.',
  },
  lawyer: {
    name: 'Агент-Юрист',
    shortName: 'Юрист',
    description: 'Отвечает за договоры, 152-ФЗ, персональные данные и распределение рисков.',
  },
  marketing: {
    name: 'Агент-Маркетолог',
    shortName: 'Маркетолог',
    description: 'Оценивает лиды, упаковку, каналы привлечения и влияние на конверсию.',
  },
  motivator: {
    name: 'Агент-Мотиватор',
    shortName: 'Мотиватор',
    description: 'Возвращает уверенность и снимает внутренние страхи клиента.',
  },
  protection: {
    name: 'Агент-Защиты',
    shortName: 'Защита',
    description: 'Удерживает рамки диалога, не раскрывает систему и пресекает нереальные условия.',
  },
};

export const GOAL_LABELS: Record<GoalKey, string> = {
  diagnose_situation: 'Диагностировать ситуацию',
  expert_consultation: 'Дать экспертную консультацию',
  help_sell: 'Помочь продать',
  trust_and_contact: 'Поддержать контакт и доверие',
  motivate: 'Мотивировать',
  protect_system: 'Защитить систему',
};

export const PROFILE_FIELD_LABELS: Record<keyof import('../types/agent').ClientProfile, string> = {
  current_request: 'Текущий запрос клиента',
  situation_type: 'Тип ситуации',
  main_problem: 'Главная потребность / проблема',
  interest_level: 'Уровень интереса',
  trust_level: 'Уровень доверия',
  main_objection: 'Главное возражение',
  emotion: 'Эмоция клиента',
  purchase_probability: 'Вероятность сделки',
  next_best_step: 'Следующий лучший шаг',
};

const emptyPool = (
  overrides: Partial<Record<ExpertAgentKey, string>>
): import('../types/agent').ExpertAgentsPool => ({
  diagnost: { used: Boolean(overrides.diagnost), response: overrides.diagnost ?? '' },
  presenter: { used: Boolean(overrides.presenter), response: overrides.presenter ?? '' },
  sales: { used: Boolean(overrides.sales), response: overrides.sales ?? '' },
  objections: { used: Boolean(overrides.objections), response: overrides.objections ?? '' },
  closing: { used: Boolean(overrides.closing), response: overrides.closing ?? '' },
  developer: { used: Boolean(overrides.developer), response: overrides.developer ?? '' },
  lawyer: { used: Boolean(overrides.lawyer), response: overrides.lawyer ?? '' },
  marketing: { used: Boolean(overrides.marketing), response: overrides.marketing ?? '' },
  motivator: { used: Boolean(overrides.motivator), response: overrides.motivator ?? '' },
  protection: { used: Boolean(overrides.protection), response: overrides.protection ?? '' },
});

export const SCENARIOS: ScenarioData[] = [
  // ============================================================================
  // СЦЕНАРИЙ 1 — «AI-проект на заказ»
  // ============================================================================
  {
    id: 'ai-project',
    title: 'AI-проект на заказ',
    shortTitle: 'AI-проект на заказ',
    category: 'B2B-разработка',
    clientRole: 'Владелец сети из трёх кофеен',
    sellerRole: 'AI-консультант студии разработки',
    goal: 'Довести до записи на бесплатный аудит',
    description:
      'Владелец сети кофеен просит сразу назвать цену бота. Система переводит разговор от абстрактной цены к расчёту экономии часов персонала и записи на 30-минутный аудит.',
    featuredAgentsLabel: 'Диагност · Разработчик · Продажник · Возражения · Юрист · Закрытие',
    openingMessage:
      'Здравствуйте! Помогаю бизнесу внедрять AI: оценю задачу, назову честные сроки и цену. Опишите, что хотите автоматизировать — или выберите готовый вариант ниже.',
    initialProfile: {
      current_request: 'не определён',
      situation_type: 'начало диалога',
      main_problem: 'ещё не выявлена',
      interest_level: 'низкий',
      trust_level: 'низкий',
      main_objection: 'не названо',
      emotion: 'нейтральный интерес',
      purchase_probability: '10%',
      next_best_step: 'выслушать первичный запрос клиента',
    },
    totalSteps: 5,
    steps: [
      // ШАГ 1
      {
        stepNumber: 1,
        options: [
          {
            id: 'A',
            text: 'Хочу AI-бота для ответов клиентам. Сколько это стоит?',
            isPrimary: true,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 9,
                    reason: 'Цена запрошена без понимания задачи — сначала нужна диагностика.',
                  },
                  expert_consultation: {
                    score: 2,
                    reason: 'Недостаточно вводных для технической оценки.',
                  },
                  help_sell: {
                    score: 6,
                    reason: 'Нужно удержать коммерческий фокус и показать быструю окупаемость.',
                  },
                  trust_and_contact: {
                    score: 5,
                    reason: 'Важно объяснить, почему цена зависит от параметров, без ухода от ответа.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Клиент сам проявил инициативу, мотивация не требуется.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Попыток сломать диалог или нарушить рамки нет.',
                  },
                  main_goal: 'Диагностировать ситуацию',
                  secondary_goal: 'Помочь продать',
                },
                profile: {
                  current_request: 'AI-бот для ответов клиентам, интересует цена',
                  situation_type: 'первичный запрос с вопросом цены',
                  main_problem: 'не сформулирована — неизвестен канал и объём обращений',
                  interest_level: 'средний',
                  trust_level: 'низкий',
                  main_objection: 'хочет цену сразу',
                  emotion: 'деловой интерес',
                  purchase_probability: '20%',
                  next_best_step: 'один уточняющий вопрос про канал и объём обращений',
                },
                router: {
                  selected_agents: ['Диагност'],
                  order: ['diagnost'],
                  reason: 'Нет данных для оценки — действует правило: один вопрос, без анкеты.',
                },
                expert_agents: emptyPool({
                  diagnost:
                    'Уточнить канал и объём обращений — это определит сложность и цену.',
                }),
              },
              answer:
                'Хорошая задача — такие боты окупаются быстрее всего. Цена зависит от двух вещей: где бот отвечает и сколько обращений в день. Подскажите: куда клиенты пишут чаще всего и примерно сколько обращений в день?',
            },
          },
          {
            id: 'B',
            text: 'Просто назовите цену, мне некогда',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 8,
                    reason: 'Нужно получить канал коммуникации даже в условиях дефицита времени.',
                  },
                  expert_consultation: {
                    score: 2,
                    reason: 'Без типа проекта назвать точную цифру невозможно.',
                  },
                  help_sell: {
                    score: 6,
                    reason: 'Обещать конкретную вилку за 30 секунд вместо абстрактного прайса.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Признать спешку клиента и уважать его время.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Дополнительная мотивация не требуется.',
                  },
                  protect_system: {
                    score: 3,
                    reason: 'Не называть случайную цену с потолка.',
                  },
                  main_goal: 'Диагностировать ситуацию',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'не определён',
                  situation_type: 'начало диалога',
                  main_problem: 'ещё не выявлена',
                  interest_level: 'низкий',
                  trust_level: 'низкий',
                  main_objection: 'не названо',
                  emotion: 'нейтральный интерес',
                  purchase_probability: '10%',
                  next_best_step: 'выслушать первичный запрос клиента',
                },
                router: {
                  selected_agents: ['Работа-с-Возражениями', 'Диагност'],
                  order: ['objections', 'diagnost'],
                  reason: 'Клиент торопится и требует цену сразу — снять сопротивление и задать 1 короткий вопрос.',
                },
                expert_agents: emptyPool({
                  objections:
                    'Признать дефицит времени клиента и объяснить разницу между чат-ботом и аналитикой за 1 фразу.',
                  diagnost:
                    'Сразу запросить главный параметр — канал, куда пишут клиенты.',
                }),
              },
              answer:
                'Понимаю спешку. Но чат-бот для ответов на вопросы и робот-аналитик продаж — разные проекты с разной ценой. Дайте 30 секунд — назову конкретную вилку, а не абстракцию. Куда клиенты пишут чаще всего?',
            },
          },
          {
            id: 'C',
            text: 'А вы вообще кто такие?',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 6,
                    reason: 'После короткого представления вернуть диалог к задаче клиента.',
                  },
                  expert_consultation: {
                    score: 2,
                    reason: 'Запрос касается формата работы компании.',
                  },
                  help_sell: {
                    score: 4,
                    reason: 'Показать безопасный формат старта через бесплатную оценку и пилот.',
                  },
                  trust_and_contact: {
                    score: 9,
                    reason: 'Нужно прямо и прозрачно представить команду и снять недоверие.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Мотивация не требуется.',
                  },
                  protect_system: {
                    score: 2,
                    reason: 'Не уходить в длинную самопрезентацию, оставаться в роли.',
                  },
                  main_goal: 'Поддержать контакт и доверие',
                  secondary_goal: 'Диагностировать ситуацию',
                },
                profile: {
                  current_request: 'не определён',
                  situation_type: 'начало диалога',
                  main_problem: 'ещё не выявлена',
                  interest_level: 'низкий',
                  trust_level: 'низкий',
                  main_objection: 'не названо',
                  emotion: 'нейтральный интерес',
                  purchase_probability: '10%',
                  next_best_step: 'выслушать первичный запрос клиента',
                },
                router: {
                  selected_agents: ['Презентатор', 'Диагност'],
                  order: ['presenter', 'diagnost'],
                  reason: 'Вопрос на доверие — коротко представить подход к работе и вернуть к задаче.',
                },
                expert_agents: emptyPool({
                  presenter:
                    'Команда разработки AI-проектов на заказ: бесплатная оценка задачи, затем пилот без лишних рисков.',
                  diagnost:
                    'Предложить проверить компетенцию на конкретной задаче клиента.',
                }),
              },
              answer:
                'Команда разработки AI-проектов на заказ: сначала бесплатно оцениваем задачу, потом подписываем пилот. Давайте я покажу на деле — расскажите, что хотите автоматизировать?',
            },
          },
        ],
      },
      // ШАГ 2
      {
        stepNumber: 2,
        options: [
          {
            id: 'A',
            text: 'Около 50 обращений в день в WhatsApp, отвечают бариста вручную',
            isPrimary: true,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 3,
                    reason: 'Канал и объём обращений уже получены.',
                  },
                  expert_consultation: {
                    score: 8,
                    reason: 'Есть данные для предварительной технической оценки MVP и сроков.',
                  },
                  help_sell: {
                    score: 6,
                    reason: 'Подвести к ценности — высвобождению рабочего времени бариста.',
                  },
                  trust_and_contact: {
                    score: 5,
                    reason: 'Честно обозначить технические риски заранее.',
                  },
                  motivate: {
                    score: 2,
                    reason: 'Клиент уже вовлечён в расчёт.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Угроз или нарушений нет.',
                  },
                  main_goal: 'Дать экспертную консультацию',
                  secondary_goal: 'Помочь продать',
                },
                profile: {
                  current_request: 'бот для WhatsApp, 50 обращений/день',
                  situation_type: 'запрос конкретизирован',
                  main_problem: 'бариста тратят время на однотипные ответы вместо гостей',
                  interest_level: 'средний',
                  trust_level: 'средний',
                  main_objection: 'не названо',
                  emotion: 'вовлечённость',
                  purchase_probability: '40%',
                  next_best_step: 'предварительная оценка MVP и сроков',
                },
                router: {
                  selected_agents: ['Разработчик'],
                  order: ['developer'],
                  reason: 'Достаточно данных для оценки технической сложности, архитектуры и рисков.',
                },
                expert_agents: emptyPool({
                  developer:
                    'MVP: бот на базе готовой LLM + база знаний из меню и типовых вопросов, интеграция WhatsApp Business API. Срок 2–3 недели. Риски: качество базы знаний, согласование доступа к WhatsApp API, эскалация на живого сотрудника.',
                }),
              },
              answer:
                'Картина ясная. Предварительная оценка: MVP-бот за 2–3 недели — отвечает на типовые вопросы (меню, часы, бронь), сложные случаи передаёт человеку. Главные риски — качество базы знаний и доступ к WhatsApp API, оба решаемые. Посчитать, сколько часов бариста это освободит?',
            },
          },
          {
            id: 'B',
            text: 'Вообще-то передумал — лучше прогноз продаж сделайте',
            isPrimary: false,
            advancesStep: false,
            isProfileReset: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 9,
                    reason: 'Тема резко изменилась — требуется диагностика данных под новую задачу.',
                  },
                  expert_consultation: {
                    score: 6,
                    reason: 'Сразу обозначить минимальное требование для прогноза продаж.',
                  },
                  help_sell: {
                    score: 4,
                    reason: 'Квалифицировать осуществимость нового проекта.',
                  },
                  trust_and_contact: {
                    score: 5,
                    reason: 'Гибко принять смену задачи без раздражения.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Мотивация не требуется.',
                  },
                  protect_system: {
                    score: 2,
                    reason: 'Не обещать точный прогноз без исторических данных.',
                  },
                  main_goal: 'Диагностировать ситуацию',
                  secondary_goal: 'Дать экспертную консультацию',
                },
                profile: {
                  current_request: 'прогноз продаж (тема изменилась — профиль пересобран)',
                  situation_type: 'смена темы диалога, профиль сброшен',
                  main_problem: 'требуется проверить наличие исторических данных по продажам',
                  interest_level: 'средний',
                  trust_level: 'средний',
                  main_objection: 'не названо',
                  emotion: 'поиск задачи',
                  purchase_probability: '15%',
                  next_best_step: 'уточнить наличие выгрузки продаж минимум за 12 месяцев',
                },
                router: {
                  selected_agents: ['Диагност'],
                  order: ['diagnost'],
                  reason: 'Смена темы требует сброса старого профиля и первичной проверки данных под новую задачу.',
                },
                expert_agents: emptyPool({
                  diagnost:
                    'Профиль пересобран под прогноз продаж: для ML-прогноза нужна история продаж хотя бы за год — задать прямой вопрос.',
                }),
              },
              answer:
                'Принято, переключаемся: прогноз продаж — другая задача. Для неё нужна история продаж хотя бы за год. Такая есть?',
            },
          },
          {
            id: 'C',
            text: 'Давайте сразу договор подпишем',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 7,
                    reason: 'Вернуться к сбору данных о канале обращений.',
                  },
                  expert_consultation: {
                    score: 3,
                    reason: 'Напомнить правильную последовательность внедрения.',
                  },
                  help_sell: {
                    score: 5,
                    reason: 'Защитить доверие к сделке через этап пилота.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Показать клиенту, что мы бережём его бюджет от работы вслепую.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Мотивация не требуется.',
                  },
                  protect_system: {
                    score: 8,
                    reason: 'Не заключать договор без оценки задачи и технического ТЗ.',
                  },
                  main_goal: 'Защитить систему',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'AI-бот для ответов клиентам, интересует цена',
                  situation_type: 'первичный запрос с вопросом цены',
                  main_problem: 'не сформулирована — неизвестен канал и объём обращений',
                  interest_level: 'средний',
                  trust_level: 'низкий',
                  main_objection: 'хочет цену сразу',
                  emotion: 'деловой интерес',
                  purchase_probability: '20%',
                  next_best_step: 'один уточняющий вопрос про канал и объём обращений',
                },
                router: {
                  selected_agents: ['Защита', 'Диагност'],
                  order: ['protection', 'diagnost'],
                  reason: 'Предотвратить подписание договора вслепую и вернуть к вопросу о канале обращений.',
                },
                expert_agents: emptyPool({
                  protection:
                    'Нельзя брать деньги и подписывать основной договор до бесплатной оценки и пилота — это защита обеих сторон.',
                  diagnost:
                    'Вернуть клиента к базовому вопросу: куда пишут гости.',
                }),
              },
              answer:
                'Отличный настрой! Но подписывать вслепую — плохая практика: сначала бесплатная оценка, потом пилот, и только потом договор на проект. Так вы ничем не рискуете. Итак, куда пишут клиенты?',
            },
          },
        ],
      },
      // ШАГ 3
      {
        stepNumber: 3,
        options: [
          {
            id: 'A',
            text: 'Да, посчитайте. И сколько стоит пилот?',
            isPrimary: true,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 2,
                    reason: 'Все базовые данные для расчёта уже собраны.',
                  },
                  expert_consultation: {
                    score: 6,
                    reason: 'Перевести 50 обращений в день в конкретные 90 часов персонала в месяц.',
                  },
                  help_sell: {
                    score: 9,
                    reason: 'Клиент запросил цену пилота — наступил момент конкретного оффера.',
                  },
                  trust_and_contact: {
                    score: 5,
                    reason: 'Снять страх большого контракта за счёт критерия окупаемости пилота.',
                  },
                  motivate: {
                    score: 2,
                    reason: 'Высокая вовлечённость клиента.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Помочь продать',
                  secondary_goal: 'Дать экспертную консультацию',
                },
                profile: {
                  current_request: 'бот для WhatsApp, 50 обращений/день, запрос цены пилота',
                  situation_type: 'готовность к офферу',
                  main_problem: 'до 3 часов в день у бариста уходит на переписку',
                  interest_level: 'высокий',
                  trust_level: 'средний',
                  main_objection: 'не названо',
                  emotion: 'азарт',
                  purchase_probability: '55%',
                  next_best_step: 'оффер пилота с ценой и окупаемостью',
                },
                router: {
                  selected_agents: ['Продажник'],
                  order: ['sales'],
                  reason: 'Запрошена цена — время конкретного оффера с привязкой к экономии.',
                },
                expert_agents: emptyPool({
                  sales:
                    'Оффер: пилот за фиксированную цену 150–300 тыс. ₽, 3 недели, окупаемость через освобождение ~90 часов персонала в месяц; дальше — масштабирование только если пилот окупился.',
                }),
              },
              answer:
                'Считаем: 50 обращений × 3–4 минуты — это до 3 часов бариста в день, ~90 часов в месяц на переписку вместо гостей. Пилот: бот закрывает типовые вопросы за 3 недели, фиксированная цена 150–300 тыс. ₽ в зависимости от интеграций. Если за месяц пилот не окупается — большой проект не начинаем. Что скажете?',
            },
          },
          {
            id: 'B',
            text: 'А данные клиентов куда пойдут? Это законно?',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 2,
                    reason: 'Контекст проекта уже понятен.',
                  },
                  expert_consultation: {
                    score: 8,
                    reason: 'Требуется точный юридический комментарий по 152-ФЗ и контуру данных.',
                  },
                  help_sell: {
                    score: 5,
                    reason: 'После снятия юридического риска вернуть к обсуждению пилота.',
                  },
                  trust_and_contact: {
                    score: 8,
                    reason: 'Показать юридическую зрелость и защиту данных заказчика.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Мотивация не требуется.',
                  },
                  protect_system: {
                    score: 4,
                    reason: 'Не давать общих обещаний без опоры на договор и 152-ФЗ.',
                  },
                  main_goal: 'Дать экспертную консультацию',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'бот для WhatsApp, 50 обращений/день',
                  situation_type: 'запрос конкретизирован',
                  main_problem: 'бариста тратят время на однотипные ответы вместо гостей',
                  interest_level: 'средний',
                  trust_level: 'средний',
                  main_objection: 'не названо',
                  emotion: 'вовлечённость',
                  purchase_probability: '40%',
                  next_best_step: 'предварительная оценка MVP и сроков',
                },
                router: {
                  selected_agents: ['Юрист'],
                  order: ['lawyer'],
                  reason: 'Прямой вопрос о персональных данных и законности — профиль задачи для Юриста.',
                },
                expert_agents: emptyPool({
                  lawyer:
                    'Подтвердить соответствие 152-ФЗ: обработка данных на инфраструктуре заказчика или российского оператора, фиксация ответственности в договоре.',
                }),
              },
              answer:
                'Вопрос правильный. Бот работает по 152-ФЗ: персональные данные обрабатываются на вашей инфраструктуре или у оператора с договором, в договоре прописываем ответственность. Подробности — на аудите. Вернёмся к пилоту?',
            },
          },
          {
            id: 'C',
            text: 'А можно без пилота сразу большой проект?',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 2,
                    reason: 'Задача понятна.',
                  },
                  expert_consultation: {
                    score: 6,
                    reason: 'Объяснить риск запуска крупного AI-внедрения без пилотной проверки.',
                  },
                  help_sell: {
                    score: 7,
                    reason: 'Удержать клиента на безопасном и реалистичном старте через пилот.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Честно отговорить от лишних трат — это усиливает доверие.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Клиент и так настроен активно.',
                  },
                  protect_system: {
                    score: 4,
                    reason: 'Защита от завышенных ожиданий при старте.',
                  },
                  main_goal: 'Помочь продать',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'бот для WhatsApp, 50 обращений/день',
                  situation_type: 'запрос конкретизирован',
                  main_problem: 'бариста тратят время на однотипные ответы вместо гостей',
                  interest_level: 'средний',
                  trust_level: 'средний',
                  main_objection: 'не названо',
                  emotion: 'вовлечённость',
                  purchase_probability: '40%',
                  next_best_step: 'предварительная оценка MVP и сроков',
                },
                router: {
                  selected_agents: ['Продажник'],
                  order: ['sales'],
                  reason: 'Объяснить выгоду пилотного этапа как защиты бюджета заказчика.',
                },
                expert_agents: emptyPool({
                  sales:
                    'Пилот — способ проверить команду и метрики за небольшой бюджет до крупного контракта.',
                }),
              },
              answer:
                'Можно, но не советую: пилот — это способ проверить нас за маленькие деньги до большого контракта. Это в ваших интересах. Смотрим пилот?',
            },
          },
        ],
      },
      // ШАГ 4
      {
        stepNumber: 4,
        options: [
          {
            id: 'A',
            text: 'Дорого. У конкурентов видел дешевле',
            isPrimary: true,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 2,
                    reason: 'Потребность и объём уже известны.',
                  },
                  expert_consultation: {
                    score: 5,
                    reason: 'Разъяснить разницу между шаблонным ботом и интеграцией с базой знаний.',
                  },
                  help_sell: {
                    score: 8,
                    reason: 'Ценовое возражение подтверждает интерес — важно перевести в сравнение полной стоимости.',
                  },
                  trust_and_contact: {
                    score: 6,
                    reason: 'Ответить честно и без агрессивного дожима.',
                  },
                  motivate: {
                    score: 2,
                    reason: 'Стимулировать проверку на цифрах без обязательств.',
                  },
                  protect_system: {
                    score: 2,
                    reason: 'Не прогибаться в демпинг, держаться ценности.',
                  },
                  main_goal: 'Помочь продать',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'бот для WhatsApp, 50 обращений/день, сравнение цены пилота',
                  situation_type: 'работа с ценовым возражением',
                  main_problem: 'до 3 часов в день у бариста на переписку',
                  interest_level: 'высокий',
                  trust_level: 'средний',
                  main_objection: 'дорого, сравнение с конкурентами',
                  emotion: 'торг',
                  purchase_probability: '65%',
                  next_best_step: 'отработать возражение через сравнение полной стоимости',
                },
                router: {
                  selected_agents: ['Работа-с-Возражениями'],
                  order: ['objections'],
                  reason: 'Ценовое возражение — типовая задача для Агента-Работы-с-Возражениями.',
                },
                expert_agents: emptyPool({
                  objections:
                    'Дешевле — это обычно шаблонный бот без интеграции с WhatsApp и без базы знаний клиента. Сравнивать надо полную стоимость: шаблон + доработки часто дороже пилота с гарантией окупаемости.',
                }),
              },
              answer:
                'Честно: дешевле — это обычно шаблонный бот «из коробки». Он не знает ваше меню, не подключён к вашему WhatsApp, и доработки встанут дороже пилота. Я предлагаю считать полную стоимость и окупаемость, а не ценник на витрине. Давайте проверим на ваших цифрах — бесплатный аудит 30 минут, ни к чему не обязывает. Записать на этой неделе?',
            },
          },
          {
            id: 'B',
            text: 'Мне надо подумать',
            isPrimary: false,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 2,
                    reason: 'Потребность зафиксирована.',
                  },
                  expert_consultation: {
                    score: 4,
                    reason: 'Дать материал для предметного обдумывания.',
                  },
                  help_sell: {
                    score: 8,
                    reason: 'Предложить бесплатный аудит как лёгкий следующий шаг.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Принять паузу без давления.',
                  },
                  motivate: {
                    score: 3,
                    reason: 'Помочь принять решение на фактах.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Помочь продать',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'бот для WhatsApp, 50 обращений/день',
                  situation_type: 'пауза перед решением',
                  main_problem: 'до 3 часов в день у бариста на переписку',
                  interest_level: 'высокий',
                  trust_level: 'средний',
                  main_objection: 'нужно время подумать без цифр аудита',
                  emotion: 'осторожность',
                  purchase_probability: '60%',
                  next_best_step: 'предложить 30-минутный бесплатный аудит с расчётом выгоды',
                },
                router: {
                  selected_agents: ['Работа-с-Возражениями', 'Закрытие'],
                  order: ['objections', 'closing'],
                  reason: 'Снять возражение «подумать» фактурой и сразу предложить аудит без обязательств.',
                },
                expert_agents: emptyPool({
                  objections:
                    'Не спорить с желанием подумать — дать конкретные цифры с аудита, чтобы было на чём принимать решение.',
                  closing:
                    'Пригласить на бесплатный 30-минутный разбор обращений.',
                }),
              },
              answer:
                'Конечно. Чтобы думать было о чём, предлагаю бесплатный аудит: за 30 минут разберём ваши обращения и посчитаем выгоду под ваши цифры. Записать?',
            },
          },
          {
            id: 'C',
            text: 'А скидку 50% сделаете?',
            isPrimary: false,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 1,
                    reason: 'Диагностика завершена.',
                  },
                  expert_consultation: {
                    score: 3,
                    reason: 'Объяснить, за счёт чего держится фиксированная цена.',
                  },
                  help_sell: {
                    score: 7,
                    reason: 'Перевести запрос скидки в бесплатный аудит до платежей.',
                  },
                  trust_and_contact: {
                    score: 6,
                    reason: 'Отказать вежливо и аргументированно.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Не требуется.',
                  },
                  protect_system: {
                    score: 9,
                    reason: 'Запрос нереальной скидки 50% — защита экономики и качества пилота.',
                  },
                  main_goal: 'Защитить систему',
                  secondary_goal: 'Помочь продать',
                },
                profile: {
                  current_request: 'бот для WhatsApp, торг по цене',
                  situation_type: 'проверка границ по скидке',
                  main_problem: 'до 3 часов в день у бариста на переписку',
                  interest_level: 'высокий',
                  trust_level: 'средний',
                  main_objection: 'просит скидку 50%',
                  emotion: 'жёсткий торг',
                  purchase_probability: '60%',
                  next_best_step: 'мягко отказать в демпинге и предложить бесплатный аудит',
                },
                router: {
                  selected_agents: ['Защита', 'Закрытие'],
                  order: ['protection', 'closing'],
                  reason: 'Зафиксирована попытка выбить нереальную скидку — срабатывает Агент-Защиты и перевод на аудит.',
                },
                expert_agents: emptyPool({
                  protection:
                    'Отказать в скидке 50% без грубости: фиксированная цена гарантирует качество и сроки.',
                  closing:
                    'Предложить бесплатный аудит до любых платежей как безопасный первый шаг.',
                }),
              },
              answer:
                'Такой скидки не будет — за фиксированную цену пилота я отвечаю качеством и сроками. Могу предложить лучше: бесплатный аудит до любых платежей.',
            },
          },
        ],
      },
      // ШАГ 5 (ФИНАЛ)
      {
        stepNumber: 5,
        options: [
          {
            id: 'A',
            text: 'Давайте, записывайте на аудит',
            isPrimary: true,
            advancesStep: true,
            isFinalChoice: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 1,
                    reason: 'Все данные собраны.',
                  },
                  expert_consultation: {
                    score: 4,
                    reason: 'Подсказать, что подготовить к встрече.',
                  },
                  help_sell: {
                    score: 10,
                    reason: 'Клиент согласен — нужно зафиксировать конкретные слоты и подготовку.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Подчеркнуть, что расчёт окупаемости останется у клиента в любом случае.',
                  },
                  motivate: {
                    score: 2,
                    reason: 'Подкрепить решение ощущением лёгкого результата.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Рисков нет.',
                  },
                  main_goal: 'Помочь продать (закрытие)',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'запись на бесплатный аудит по боту WhatsApp',
                  situation_type: 'фиксация сделки / следующего шага',
                  main_problem: 'до 3 часов в день у бариста на переписку',
                  interest_level: 'высокий',
                  trust_level: 'высокий',
                  main_objection: 'закрыто',
                  emotion: 'решительность',
                  purchase_probability: '85%',
                  next_best_step: 'аудит 30 минут — зафиксировать дату и контакт',
                },
                router: {
                  selected_agents: ['Закрытие'],
                  order: ['closing'],
                  reason: 'Согласие на следующий шаг — зафиксировать конкретику по времени и материалам.',
                },
                expert_agents: emptyPool({
                  closing:
                    'Фиксируем конкретный шаг: аудит, дата, контакт, что подготовить клиенту (выгрузка типовых вопросов).',
                }),
              },
              answer:
                'Отлично! Предлагаю четверг или пятницу, 30 минут в Zoom. От вас нужен только список 10–15 самых частых вопросов гостей. После аудита у вас будет точная цена пилота и расчёт окупаемости под ваши цифры — даже если мы не продолжим, расчёт останется вам. Какой день удобнее?',
            },
          },
          {
            id: 'B',
            text: 'Лучше пришлите коммерческое на почту',
            isPrimary: false,
            advancesStep: true,
            isFinalChoice: true,
            missionOutcomeOverride: {
              probability: 70,
              summary: 'Клиент запросил коммерческое предложение с расчётом под 50 обращений в день',
              nextStep: 'Отправить КП и приглашение на короткий аудит в письме',
              statusLabel: 'Тёплая передача в КП',
            },
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 1,
                    reason: 'Диагностика завершена.',
                  },
                  expert_consultation: {
                    score: 5,
                    reason: 'Подготовить персональное КП по цифрам клиента.',
                  },
                  help_sell: {
                    score: 9,
                    reason: 'Зафиксировать отправку КП сегодня и мягко сохранить приглашение на аудит.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Уважить удобный клиенту формат коммуникации.',
                  },
                  motivate: {
                    score: 2,
                    reason: 'Показать ценность аудита для точности сметы.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Рисков нет.',
                  },
                  main_goal: 'Помочь продать (закрытие)',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'коммерческое предложение на почту',
                  situation_type: 'закрытие через КП',
                  main_problem: 'до 3 часов в день у бариста на переписку',
                  interest_level: 'высокий',
                  trust_level: 'высокий',
                  main_objection: 'предпочитает письменное КП',
                  emotion: 'деловой прагматизм',
                  purchase_probability: '70%',
                  next_best_step: 'отправить КП с расчётом и предложить слот на аудит',
                },
                router: {
                  selected_agents: ['Закрытие'],
                  order: ['closing'],
                  reason: 'Фиксация следующего шага через персонализированное КП сегодня.',
                },
                expert_agents: emptyPool({
                  closing:
                    'Подтвердить отправку КП сегодня под 50 обращений в день и оставить открытым приглашение на аудит.',
                }),
              },
              answer:
                'Пришлю сегодня: оценка пилота и расчёт под 50 обращений в день. А аудит всё равно предложу в письме — с ним КП будет точнее.',
            },
          },
          {
            id: 'C',
            text: 'Я ещё подумаю пару недель',
            isPrimary: false,
            advancesStep: true,
            isFinalChoice: true,
            missionOutcomeOverride: {
              probability: 55,
              summary: 'Мягкое закрытие: зафиксирован повторный созвон через 2 недели с готовым расчётом',
              nextStep: 'Отправить расчёт окупаемости и созвониться через 2 недели',
              statusLabel: 'Отложенное закрытие',
            },
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 1,
                    reason: 'Диагностика завершена.',
                  },
                  expert_consultation: {
                    score: 4,
                    reason: 'Подготовить короткий расчёт окупаемости к следующей точке контакта.',
                  },
                  help_sell: {
                    score: 8,
                    reason: 'Не потерять лида: зафиксировать дату следующего контакта.',
                  },
                  trust_and_contact: {
                    score: 9,
                    reason: 'Мягкое уважительное закрытие без навязывания.',
                  },
                  motivate: {
                    score: 2,
                    reason: 'Облегчить принятие решения готовыми цифрами.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Рисков нет.',
                  },
                  main_goal: 'Поддержать контакт и доверие',
                  secondary_goal: 'Помочь продать',
                },
                profile: {
                  current_request: 'отложенное решение на 2 недели',
                  situation_type: 'мягкое закрытие',
                  main_problem: 'до 3 часов в день у бариста на переписку',
                  interest_level: 'средний',
                  trust_level: 'высокий',
                  main_objection: 'откладывает решение на пару недель',
                  emotion: 'спокойное размышление',
                  purchase_probability: '55%',
                  next_best_step: 'созвон через 2 недели + отправка расчёта окупаемости',
                },
                router: {
                  selected_agents: ['Закрытие', 'Работа-с-Возражениями'],
                  order: ['objections', 'closing'],
                  reason: 'Мягко зафиксировать точку возврата через две недели с полезным артефактом.',
                },
                expert_agents: emptyPool({
                  objections:
                    'Принять паузу на 2 недели и дать клиенту конкретный расчёт окупаемости в помощь.',
                  closing:
                    'Зафиксировать повторный созвон через две недели.',
                }),
              },
              answer:
                'Договорились. Зафиксирую: созвон через две недели, к нему пришлю короткий расчёт окупаемости под ваши цифры — думать будет проще.',
            },
          },
        ],
      },
    ],
    missionSummary: {
      defaultProbability: 85,
      defaultOutcome: 'Из холодного вопроса «сколько стоит» — в запись на аудит с конкретной датой',
      defaultNextStep: 'Аудит 30 минут в Zoom + выгрузка 10–15 частых вопросов гостей',
      agentTakeaways: [
        {
          agentName: 'Агент-Целей',
          role: 'Стратегия на каждом шаге',
          takeaway: 'Переключил приоритет от диагностики в начале к закрытию в финале.',
        },
        {
          agentName: 'Агент-Профайлер',
          role: 'Динамический профиль',
          takeaway: 'Поднял вероятность сделки с 20% до 85% и отслеживал смену темы.',
        },
        {
          agentName: 'Агент-Маршрутизатор',
          role: 'Оркестрация экспертов',
          takeaway: 'Выбирал ровно нужных агентов без лишнего шума на каждом ходу.',
        },
        {
          agentName: 'Агент-Диагност',
          agentKey: 'diagnost',
          role: 'Первый шаг',
          takeaway: 'Задал один точный вопрос о канале и объёме обращений вместо длинной анкеты.',
        },
        {
          agentName: 'Агент-Разработчик',
          agentKey: 'developer',
          role: 'Техническая оценка',
          takeaway: 'Назвал реальные сроки MVP (2–3 недели) и честно предупредил о рисках WhatsApp API.',
        },
        {
          agentName: 'Агент-Продажник',
          agentKey: 'sales',
          role: 'Оффер и окупаемость',
          takeaway: 'Перевёл 50 сообщений/день в ~90 часов бариста в месяц и предложил пилот без риска.',
        },
        {
          agentName: 'Агент-Работы-с-Возражениями',
          agentKey: 'objections',
          role: 'Отработка цены',
          takeaway: 'Сравнил полную стоимость шаблонного бота и кастомного пилота на цифрах клиента.',
        },
        {
          agentName: 'Агент-Юрист',
          agentKey: 'lawyer',
          role: 'Безопасность данных',
          takeaway: 'Разъяснил соответствие 152-ФЗ и хранение данных в контуре клиента.',
          conditional: true,
        },
        {
          agentName: 'Агент-Защиты',
          agentKey: 'protection',
          role: 'Границы сделки',
          takeaway: 'Предотвратил демпинг и подписание договора вслепую до аудита.',
          conditional: true,
        },
        {
          agentName: 'Агент-Закрытия',
          agentKey: 'closing',
          role: 'Фиксация шага',
          takeaway: 'Закрепил конкретный формат, время аудита и список вопросов к встрече.',
        },
      ],
    },
  },

  // ============================================================================
  // СЦЕНАРИЙ 2 — «Онлайн-курсы английского»
  // ============================================================================
  {
    id: 'english-courses',
    title: 'Онлайн-курсы английского',
    shortTitle: 'Курсы английского',
    category: 'EdTech',
    clientRole: 'Менеджер, которому английский нужен для работы',
    sellerRole: 'AI-продажник онлайн-школы английского',
    goal: 'Довести до записи на бесплатный пробный урок',
    description:
      'Занятой менеджер хочет английский для работы, но сомневается из-за нехватки времени. Система выявляет барьер, подбирает мини-формат 3×30 минут и закрывает на пробный урок.',
    featuredAgentsLabel: 'Диагност · Презентатор · Мотиватор · Возражения · Закрытие',
    openingMessage:
      'Здравствуйте! Это онлайн-школа английского. Помогу понять, подойдёт ли вам наш формат, и запишу на бесплатный пробный урок. Что привело вас к английскому?',
    initialProfile: {
      current_request: 'не определён',
      situation_type: 'начало диалога',
      main_problem: 'ещё не выявлена',
      interest_level: 'низкий',
      trust_level: 'низкий',
      main_objection: 'не названо',
      emotion: 'нейтральный интерес',
      purchase_probability: '10%',
      next_best_step: 'узнать цель изучения английского',
    },
    totalSteps: 5,
    steps: [
      // ШАГ 1
      {
        stepNumber: 1,
        options: [
          {
            id: 'A',
            text: 'Хочу выучить английский для работы',
            isPrimary: true,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 9,
                    reason: 'Цель слишком широкая — нужно понять рабочий сценарий и уровень.',
                  },
                  expert_consultation: {
                    score: 2,
                    reason: 'Рано подбирать программу без рабочего контекста.',
                  },
                  help_sell: {
                    score: 6,
                    reason: 'Подкрепить мотивацию, что рабочий английский даёт быстрый прогресс.',
                  },
                  trust_and_contact: {
                    score: 5,
                    reason: 'Дружелюбный поддерживающий тон без допроса.',
                  },
                  motivate: {
                    score: 3,
                    reason: 'Позитивно оценить выбор цели.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Диагностировать ситуацию',
                  secondary_goal: 'Помочь продать',
                },
                profile: {
                  current_request: 'английский для работы',
                  situation_type: 'первичный запрос',
                  main_problem: 'цель широкая — нужен контекст работы',
                  interest_level: 'средний',
                  trust_level: 'низкий',
                  main_objection: 'не названо',
                  emotion: 'надежда',
                  purchase_probability: '25%',
                  next_best_step: 'уточнить рабочий контекст и уровень — один вопрос',
                },
                router: {
                  selected_agents: ['Диагност'],
                  order: ['diagnost'],
                  reason: 'Цель слишком широкая для точной презентации курса.',
                },
                expert_agents: emptyPool({
                  diagnost:
                    'Уточнить: что именно на работе — созвоны, переписка, переговоры; текущий уровень.',
                }),
              },
              answer:
                'Отличная цель — рабочий английский осваивается быстрее всего, потому что есть практика каждый день. Один вопрос: что важнее сейчас — говорить на созвонах, писать письма или переговоры? И какой у вас сейчас уровень, примерно?',
            },
          },
          {
            id: 'B',
            text: 'Сколько стоит обучение?',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 8,
                    reason: 'Сначала понять цель и уровень для точного подбора тарифа.',
                  },
                  expert_consultation: {
                    score: 3,
                    reason: 'Назвать доступные форматы (группа, мини-группа, индивидуально).',
                  },
                  help_sell: {
                    score: 6,
                    reason: 'Не называть цену до понимания формата, иначе она покажется оторванной от пользы.',
                  },
                  trust_and_contact: {
                    score: 6,
                    reason: 'Пообещать ответ за две минуты без анкетирования.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Не требуется.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Диагностировать ситуацию',
                  secondary_goal: 'Помочь продать',
                },
                profile: {
                  current_request: 'не определён',
                  situation_type: 'начало диалога',
                  main_problem: 'ещё не выявлена',
                  interest_level: 'низкий',
                  trust_level: 'низкий',
                  main_objection: 'не названо',
                  emotion: 'нейтральный интерес',
                  purchase_probability: '10%',
                  next_best_step: 'узнать цель изучения английского',
                },
                router: {
                  selected_agents: ['Диагност'],
                  order: ['diagnost'],
                  reason: 'Цена зависит от формата — перевести на короткую диагностику цели.',
                },
                expert_agents: emptyPool({
                  diagnost:
                    'Обозначить вилку форматов и спросить, для чего именно нужен английский.',
                }),
              },
              answer:
                'Цена зависит от формата: группа, мини-группа или индивидуально. Подскажу точно, как пойму вашу цель и уровень — это две минуты. Для чего вам английский?',
            },
          },
          {
            id: 'C',
            text: 'Мне уже за сорок, наверное поздно начинать',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 5,
                    reason: 'После поддержки вернуть разговор к цели обучения.',
                  },
                  expert_consultation: {
                    score: 3,
                    reason: 'Опираться на практику обучения взрослых студентов.',
                  },
                  help_sell: {
                    score: 4,
                    reason: 'Убрать стоп-фактор возраста на входе.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Проявить эмпатию к сомнению клиента.',
                  },
                  motivate: {
                    score: 9,
                    reason: 'Сильный ограничивающий страх («мне поздно») — ключевая задача Мотиватора.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Мотивировать',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'не определён',
                  situation_type: 'начало диалога',
                  main_problem: 'ещё не выявлена',
                  interest_level: 'низкий',
                  trust_level: 'низкий',
                  main_objection: 'не названо',
                  emotion: 'нейтральный интерес',
                  purchase_probability: '10%',
                  next_best_step: 'узнать цель изучения английского',
                },
                router: {
                  selected_agents: ['Мотиватор'],
                  order: ['motivator'],
                  reason: 'Страх возраста — прямое срабатывание Агента-Мотиватора.',
                },
                expert_agents: emptyPool({
                  motivator:
                    'Снять миф о возрасте: взрослые учат осознанно, привести пример ученика в 58 лет и спросить о цели.',
                }),
              },
              answer:
                'Знакомое опасение — и оно не подтверждается практикой: взрослые учат осознанно и часто прогрессируют быстрее подростков. Наш самый старший ученик начал в 58. Для чего вам английский — работа, путешествия?',
            },
          },
        ],
      },
      // ШАГ 2
      {
        stepNumber: 2,
        options: [
          {
            id: 'A',
            text: 'Созвоны с зарубежными коллегами. Уровень — читаю со словарём',
            isPrimary: true,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 3,
                    reason: 'Контекст и текущий уровень полностью понятны.',
                  },
                  expert_consultation: {
                    score: 8,
                    reason: 'Объяснить, что разговорный барьер лечится практикой речи, а не учебниками.',
                  },
                  help_sell: {
                    score: 6,
                    reason: 'Показать формат, созданный ровно под задачу созвонов.',
                  },
                  trust_and_contact: {
                    score: 6,
                    reason: 'Нормализовать ситуацию клиента («самый частый случай»).',
                  },
                  motivate: {
                    score: 4,
                    reason: 'Дать реалистичный горизонт первых результатов: 6–8 недель.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Обещания реалистичные.',
                  },
                  main_goal: 'Дать экспертную консультацию',
                  secondary_goal: 'Помочь продать',
                },
                profile: {
                  current_request: 'разговорный английский для созвонов, уровень pre-intermediate',
                  situation_type: 'запрос конкретизирован',
                  main_problem: 'понимает текст, но не говорит — разговорный барьер',
                  interest_level: 'средний',
                  trust_level: 'средний',
                  main_objection: 'не названо',
                  emotion: 'вовлечённость',
                  purchase_probability: '45%',
                  next_best_step: 'презентация формата под задачу «созвоны»',
                },
                router: {
                  selected_agents: ['Презентатор'],
                  order: ['presenter'],
                  reason: 'Потребность ясна — презентовать формат ровно под неё, а не весь каталог школы.',
                },
                expert_agents: emptyPool({
                  presenter:
                    'Презентовать под задачу: разговорные мини-группы, симуляция рабочих созвонов, персональный план по лексике отрасли клиента, 3 занятия в неделю по 30 минут.',
                }),
              },
              answer:
                'Понял: читаете нормально, а на созвонах теряетесь — это самый частый случай, и он лечится именно разговорной практикой, а не учебниками. Наш формат под вашу задачу: мини-группы до 4 человек, 3 раза в неделю по 30 минут, тренируем реальные рабочие ситуации — включая созвоны с «коллегами». Первые результаты обычно через 6–8 недель. Как вам такой формат?',
            },
          },
          {
            id: 'B',
            text: 'Всё и сразу: и говорить, и писать',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 8,
                    reason: 'Помочь выбрать главный приоритет, чтобы не распыляться.',
                  },
                  expert_consultation: {
                    score: 6,
                    reason: 'Объяснить принцип фокуса (в 2–3 раза быстрее).',
                  },
                  help_sell: {
                    score: 4,
                    reason: 'Подвести к узкой боли.',
                  },
                  trust_and_contact: {
                    score: 5,
                    reason: 'Поддержать амбицию и мягко сфокусировать.',
                  },
                  motivate: {
                    score: 2,
                    reason: 'Не требуется.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Диагностировать ситуацию',
                  secondary_goal: 'Дать экспертную консультацию',
                },
                profile: {
                  current_request: 'английский для работы',
                  situation_type: 'первичный запрос',
                  main_problem: 'цель широкая — нужен контекст работы',
                  interest_level: 'средний',
                  trust_level: 'низкий',
                  main_objection: 'не названо',
                  emotion: 'надежда',
                  purchase_probability: '25%',
                  next_best_step: 'уточнить рабочий контекст и уровень — один вопрос',
                },
                router: {
                  selected_agents: ['Диагност'],
                  order: ['diagnost'],
                  reason: 'Сузить запрос с «всё и сразу» до одного главного сценария.',
                },
                expert_agents: emptyPool({
                  diagnost:
                    'Один фокус даёт результат в 2–3 раза быстрее — уточнить, что болит сильнее: созвоны или письма.',
                }),
              },
              answer:
                'Так тоже бывает! Но опыт показывает: один фокус даёт результат в 2–3 раза быстрее, остальное подтягивается следом. Что болит сильнее — созвоны или письма?',
            },
          },
          {
            id: 'C',
            text: 'У меня вообще нулевой уровень',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 7,
                    reason: 'После снятия стеснения узнать рабочий сценарий.',
                  },
                  expert_consultation: {
                    score: 5,
                    reason: 'Пояснить старт с нуля до рабочих диалогов.',
                  },
                  help_sell: {
                    score: 4,
                    reason: 'Удержать интерес.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Превратить нулевой уровень в плюс («не придётся переучиваться»).',
                  },
                  motivate: {
                    score: 6,
                    reason: 'Снять неловкость из-за начального уровня.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Диагностировать ситуацию',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'английский для работы',
                  situation_type: 'первичный запрос',
                  main_problem: 'цель широкая — нужен контекст работы',
                  interest_level: 'средний',
                  trust_level: 'низкий',
                  main_objection: 'не названо',
                  emotion: 'надежда',
                  purchase_probability: '25%',
                  next_best_step: 'уточнить рабочий контекст и уровень — один вопрос',
                },
                router: {
                  selected_agents: ['Мотиватор', 'Диагност'],
                  order: ['motivator', 'diagnost'],
                  reason: 'Подбодрить при нулевом уровне и уточнить рабочую задачу.',
                },
                expert_agents: emptyPool({
                  motivator:
                    'С нуля учиться даже удобнее — не нужно ломать старые ошибки.',
                  diagnost:
                    'Уточнить первую рабочую задачу для программы.',
                }),
              },
              answer:
                'Это даже удобно: не придётся переучиваться. Программа стартует с нуля до рабочих диалогов. А для работы что нужно в первую очередь?',
            },
          },
        ],
      },
      // ШАГ 3
      {
        stepNumber: 3,
        options: [
          {
            id: 'A',
            text: 'Звучит неплохо. А сколько стоит?',
            isPrimary: true,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 2,
                    reason: 'Формат принят, диагностика не требуется.',
                  },
                  expert_consultation: {
                    score: 4,
                    reason: 'Кратко пояснить ценность инвестиции в навык.',
                  },
                  help_sell: {
                    score: 9,
                    reason: 'Клиент сам запросил цену после презентации — время оффера и бесплатного шага.',
                  },
                  trust_and_contact: {
                    score: 6,
                    reason: 'Не требовать оплаты вслепую — предложить бесплатный пробный урок.',
                  },
                  motivate: {
                    score: 3,
                    reason: 'Якорь ценности: меньше стоимости одного рабочего дня.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Помочь продать',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'мини-группа разговорного английского, запрос цены',
                  situation_type: 'готовность к офферу',
                  main_problem: 'понимает текст, но не говорит — разговорный барьер',
                  interest_level: 'высокий',
                  trust_level: 'средний',
                  main_objection: 'не названо, запрос цены',
                  emotion: 'прагматичный интерес',
                  purchase_probability: '60%',
                  next_best_step: 'назвать цену с якорем ценности и предложить пробный урок',
                },
                router: {
                  selected_agents: ['Продажник'],
                  order: ['sales'],
                  reason: 'Запрос цены — сформулировать оффер с привязкой к цели клиента и бесплатным пробным уроком.',
                },
                expert_agents: emptyPool({
                  sales:
                    'Цена мини-группы, сравнение со стоимостью одного дня зарплаты за навык, который поднимает ценность специалиста; сразу предложить бесплатный пробный урок как шаг без риска.',
                }),
              },
              answer:
                'Мини-группа — от 8 000 ₽ в месяц за 12 занятий. Для сравнения: это меньше стоимости одного рабочего дня большинства специалистов, а навык останется на всю карьеру. Но покупать абонемент вслепую не предлагаю: сначала бесплатный пробный урок — определим уровень, вы посмотрите формат изнутри. Записать?',
            },
          },
          {
            id: 'B',
            text: 'А вдруг я буду самым слабым в группе',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 2,
                    reason: 'Уровень уже примерно ясен.',
                  },
                  expert_consultation: {
                    score: 5,
                    reason: 'Пояснить механику распределения по группам после тестирования.',
                  },
                  help_sell: {
                    score: 5,
                    reason: 'Снять барьер перед групповым форматом.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Показать заботу о психологическом комфорте.',
                  },
                  motivate: {
                    score: 9,
                    reason: 'Страх выглядеть хуже других в группе — работа Мотиватора.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Мотивировать',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'разговорный английский для созвонов, уровень pre-intermediate',
                  situation_type: 'запрос конкретизирован',
                  main_problem: 'понимает текст, но не говорит — разговорный барьер',
                  interest_level: 'средний',
                  trust_level: 'средний',
                  main_objection: 'не названо',
                  emotion: 'вовлечённость',
                  purchase_probability: '45%',
                  next_best_step: 'презентация формата под задачу «созвоны»',
                },
                router: {
                  selected_agents: ['Мотиватор'],
                  order: ['motivator'],
                  reason: 'Страх оказаться слабее остальных в группе снимается Агентом-Мотиватором.',
                },
                expert_agents: emptyPool({
                  motivator:
                    'Объяснить строгий отбор в группы по уровню после бесплатного тестирования — клиент будет среди равных.',
                }),
              },
              answer:
                'Группы собираются строго по уровню после бесплатного тестирования — вы будете среди равных. Это главное, за чем мы следим: сильная разница уровней убивает разговорную практику.',
            },
          },
          {
            id: 'C',
            text: 'А есть индивидуально с преподавателем?',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 3,
                    reason: 'Понять предпочтение клиента между форматами.',
                  },
                  expert_consultation: {
                    score: 8,
                    reason: 'Сравнить эффективность индивидуального формата и мини-группы именно для созвонов.',
                  },
                  help_sell: {
                    score: 6,
                    reason: 'Предложить сравнение цен обоих вариантов.',
                  },
                  trust_and_contact: {
                    score: 6,
                    reason: 'Честно рекомендовать более эффективный вариант, даже если он дешевле.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Не требуется.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Дать экспертную консультацию',
                  secondary_goal: 'Помочь продать',
                },
                profile: {
                  current_request: 'разговорный английский для созвонов, уровень pre-intermediate',
                  situation_type: 'запрос конкретизирован',
                  main_problem: 'понимает текст, но не говорит — разговорный барьер',
                  interest_level: 'средний',
                  trust_level: 'средний',
                  main_objection: 'не названо',
                  emotion: 'вовлечённость',
                  purchase_probability: '45%',
                  next_best_step: 'презентация формата под задачу «созвоны»',
                },
                router: {
                  selected_agents: ['Презентатор', 'Продажник'],
                  order: ['presenter', 'sales'],
                  reason: 'Сравнить форматы по методике и предложить цены обоих вариантов.',
                },
                expert_agents: emptyPool({
                  presenter:
                    'Для преодоления разговорного барьера мини-группа даёт больше разных собеседников, как на реальных созвонах.',
                  sales:
                    'Индивидуально дороже примерно вдвое; предложить цены обоих форматов.',
                }),
              },
              answer:
                'Есть, дороже примерно вдвое. Но для разговорного барьера мини-группа даже эффективнее: больше живых собеседников. Рассказать про цены обоих форматов?',
            },
          },
        ],
      },
      // ШАГ 4
      {
        stepNumber: 4,
        options: [
          {
            id: 'A',
            text: 'У меня просто нет времени на 3 занятия в неделю',
            isPrimary: true,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 2,
                    reason: 'Возражение сформулировано чётко.',
                  },
                  expert_consultation: {
                    score: 5,
                    reason: 'Раскрыть детали расписания: слоты 8:00/19:00 и записи пропусков.',
                  },
                  help_sell: {
                    score: 8,
                    reason: 'Возражение времени при согласии с ценой — высокий интерес; предложить конкретный слот на завтра.',
                  },
                  trust_and_contact: {
                    score: 5,
                    reason: 'Спокойный честный разговор про привычку.',
                  },
                  motivate: {
                    score: 6,
                    reason: 'Показать, что «лишнее время» не появится само, но 30 минут реально встроить.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Помочь продать',
                  secondary_goal: 'Мотивировать',
                },
                profile: {
                  current_request: 'мини-группа 3×30 минут, поиск времени в графике',
                  situation_type: 'работа с возражением времени',
                  main_problem: 'понимает текст, но не говорит — разговорный барьер',
                  interest_level: 'высокий',
                  trust_level: 'средний',
                  main_objection: 'нет времени',
                  emotion: 'сомнение',
                  purchase_probability: '70%',
                  next_best_step: 'отработать возражение времени через формат 30 минут',
                },
                router: {
                  selected_agents: ['Работа-с-Возражениями'],
                  order: ['objections'],
                  reason: 'Возражение «нет времени» — показать, что формат 3×30 минут уже построен под занятых.',
                },
                expert_agents: emptyPool({
                  objections:
                    'Формат 3×30 минут создан для занятых: меньше, чем сериал; занятия до/после работы; пропущенное — в записи. Возражение времени = высокий интерес, нельзя терять клиента.',
                }),
              },
              answer:
                'Именно под такой ритм и построен формат: 30 минут — это меньше серии сериала, занятия в 8:00 или 19:00, пропущенное приходит в записи. Честно скажу: у тех, кто ждёт «когда появится время», оно не появляется никогда — появляется у тех, кто встроил 30 минут в расписание. Проверьте бесплатно: один пробный урок, 30 минут, определим ваш уровень и покажем формат. Завтра в 19:00 удобно?',
            },
          },
          {
            id: 'B',
            text: 'Я уже пробовал учить — не получилось',
            isPrimary: false,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 3,
                    reason: 'Понятна причина негативного опыта (зубрёжка грамматики).',
                  },
                  expert_consultation: {
                    score: 5,
                    reason: 'Объяснить разницу методики: 80% урока — живая речь.',
                  },
                  help_sell: {
                    score: 8,
                    reason: 'Снять страх повторения неудачи через бесплатный пробный урок.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Не обесценивать прошлый опыт клиента.',
                  },
                  motivate: {
                    score: 7,
                    reason: 'Дать уверенность, что проблема была в методике, а не в клиенте.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Помочь продать',
                  secondary_goal: 'Мотивировать',
                },
                profile: {
                  current_request: 'мини-группа, сомнение из-за прошлого опыта',
                  situation_type: 'работа с возражением прошлого неудачного опыта',
                  main_problem: 'понимает текст, но не говорит — разговорный барьер',
                  interest_level: 'высокий',
                  trust_level: 'средний',
                  main_objection: 'прошлый негативный опыт',
                  emotion: 'скепсис из-за усталости',
                  purchase_probability: '68%',
                  next_best_step: 'пригласить на бесплатный пробный урок без риска',
                },
                router: {
                  selected_agents: ['Работа-с-Возражениями'],
                  order: ['objections'],
                  reason: 'Типовое возражение «уже пробовал» закрывается отличием методики и пробным уроком.',
                },
                expert_agents: emptyPool({
                  objections:
                    'Разделить прошлую учёбу грамматики и практику речи (80% урока); предложить безрисковую проверку на пробном.',
                }),
              },
              answer:
                'Самое частое возражение. Обычно «не получилось» значит: учили грамматику, а не говорили. Здесь 80% урока — разговор. Проверьте на бесплатном пробном: если формат не зайдёт — вы ничего не потеряете.',
            },
          },
          {
            id: 'C',
            text: 'Дорого для меня сейчас',
            isPrimary: false,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 2,
                    reason: 'Бюджетное ограничение понятно.',
                  },
                  expert_consultation: {
                    score: 4,
                    reason: 'Предложить более доступные группы выходного дня.',
                  },
                  help_sell: {
                    score: 8,
                    reason: 'Отделить решение о бюджете от бесплатного пробного урока.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Отнестись с пониманием к бюджету.',
                  },
                  motivate: {
                    score: 3,
                    reason: 'Позволить оценить ценность до оплаты.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Помочь продать',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'мини-группа, чувствительность к цене',
                  situation_type: 'ценовое возражение',
                  main_problem: 'понимает текст, но не говорит — разговорный барьер',
                  interest_level: 'средний',
                  trust_level: 'средний',
                  main_objection: 'дорого сейчас',
                  emotion: 'напряжение по бюджету',
                  purchase_probability: '60%',
                  next_best_step: 'записать на бесплатный пробный урок и показать группы выходного дня',
                },
                router: {
                  selected_agents: ['Работа-с-Возражениями'],
                  order: ['objections'],
                  reason: 'Дать более экономичную опцию и перенести вопрос бюджета на этап после пробного урока.',
                },
                expert_agents: emptyPool({
                  objections:
                    'Упомянуть группы выходного дня и развести бесплатный пробный урок и решение о покупке.',
                }),
              },
              answer:
                'Понимаю. Есть группы выходного дня дешевле, а пробный урок в любом случае бесплатный — посмотрите формат, а про бюджет решите после, со знанием дела.',
            },
          },
        ],
      },
      // ШАГ 5 (ФИНАЛ)
      {
        stepNumber: 5,
        options: [
          {
            id: 'A',
            text: 'Давайте, записывайте на пробный',
            isPrimary: true,
            advancesStep: true,
            isFinalChoice: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 1,
                    reason: 'Вся диагностика пройдена.',
                  },
                  expert_consultation: {
                    score: 4,
                    reason: 'Предупредить про короткий 10-минутный тест для точного подбора урока.',
                  },
                  help_sell: {
                    score: 10,
                    reason: 'Согласие получено — закрытие на точное время (завтра, 19:00).',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Зафиксировать напоминание за час, чтобы клиент чувствовал заботу.',
                  },
                  motivate: {
                    score: 3,
                    reason: 'Уверенная, дружелюбная точка контакта.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Помочь продать (закрытие)',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'запись на бесплатный пробный урок завтра в 19:00',
                  situation_type: 'фиксация сделки / следующего шага',
                  main_problem: 'понимает текст, но не говорит — разговорный барьер',
                  interest_level: 'высокий',
                  trust_level: 'высокий',
                  main_objection: 'закрыто',
                  emotion: 'решительность',
                  purchase_probability: '90%',
                  next_best_step: 'зафиксировать дату пробного урока и контакт',
                },
                router: {
                  selected_agents: ['Закрытие'],
                  order: ['closing'],
                  reason: 'Согласие получено — зафиксировать конкретный шаг, время и подготовку.',
                },
                expert_agents: emptyPool({
                  closing:
                    'Фиксируем: пробный урок, дата/время, контакт, напоминание за час; до урока — короткий тест уровня.',
                }),
              },
              answer:
                'Записываю на завтра, 19:00. За час до урока пришлю напоминание и ссылку. Ещё пришлю короткий тест на 10 минут — с ним преподаватель подготовит урок точно под ваш уровень. Увидимся завтра!',
            },
          },
          {
            id: 'B',
            text: 'Пришлите расписание, выберу сам',
            isPrimary: false,
            advancesStep: true,
            isFinalChoice: true,
            missionOutcomeOverride: {
              probability: 75,
              summary: 'Клиент взял расписание и ссылку на тест уровня для самостоятельного выбора слота',
              nextStep: 'Отправить расписание и 10-минутный тест уровня в мессенджер',
              statusLabel: 'Самостоятельный выбор слота',
            },
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 2,
                    reason: 'Уровень уточнится через 10-минутный тест.',
                  },
                  expert_consultation: {
                    score: 4,
                    reason: 'Пояснить пользу теста уровня перед уроком.',
                  },
                  help_sell: {
                    score: 9,
                    reason: 'Передать расписание и микро-действие (тест на 10 минут), чтобы не потерять импульс.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Дать свободу выбора времени.',
                  },
                  motivate: {
                    score: 2,
                    reason: 'Упростить старт.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Помочь продать (закрытие)',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'расписание занятий и тест уровня в мессенджер',
                  situation_type: 'закрытие через самостоятельный выбор времени',
                  main_problem: 'понимает текст, но не говорит — разговорный барьер',
                  interest_level: 'высокий',
                  trust_level: 'высокий',
                  main_objection: 'хочет сам свериться с графиком',
                  emotion: 'деловая самостоятельность',
                  purchase_probability: '75%',
                  next_best_step: 'отправить расписание и тест уровня на 10 минут',
                },
                router: {
                  selected_agents: ['Закрытие'],
                  order: ['closing'],
                  reason: 'Закрыть через отправку расписания и короткого теста уровня.',
                },
                expert_agents: emptyPool({
                  closing:
                    'Отправить расписание в мессенджер вместе со ссылкой на 10-минутный тест уровня.',
                }),
              },
              answer:
                'Отправлю в мессенджер вместе с ссылкой на тест уровня — он займёт 10 минут и сделает пробный урок точнее.',
            },
          },
          {
            id: 'C',
            text: 'Спасибо, я пока просто смотрю варианты',
            isPrimary: false,
            advancesStep: true,
            isFinalChoice: true,
            missionOutcomeOverride: {
              probability: 50,
              summary: 'Мягкое закрытие: бесплатный пробный урок сохранён, предложено кейс-отзыв менеджера',
              nextStep: 'Прислать отзыв менеджера, вышедшего на рабочие созвоны за 4 месяца',
              statusLabel: 'Мягкое закрытие',
            },
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 1,
                    reason: 'Диагностика завершена.',
                  },
                  expert_consultation: {
                    score: 3,
                    reason: 'Социальное доказательство через кейс похожего специалиста.',
                  },
                  help_sell: {
                    score: 7,
                    reason: 'Оставить дверь открытой через бесплатный пробный урок и релевантный отзыв.',
                  },
                  trust_and_contact: {
                    score: 9,
                    reason: 'Уважать право клиента выбирать без давления.',
                  },
                  motivate: {
                    score: 4,
                    reason: 'Реальный пример прогресса за 4 месяца.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Поддержать контакт и доверие',
                  secondary_goal: 'Помочь продать',
                },
                profile: {
                  current_request: 'сравнение вариантов без немедленной записи',
                  situation_type: 'мягкое закрытие',
                  main_problem: 'понимает текст, но не говорит — разговорный барьер',
                  interest_level: 'средний',
                  trust_level: 'высокий',
                  main_objection: 'пока только присматривается',
                  emotion: 'спокойное сравнение',
                  purchase_probability: '50%',
                  next_best_step: 'прислать отзыв менеджера с похожей задачей',
                },
                router: {
                  selected_agents: ['Закрытие', 'Мотиватор'],
                  order: ['closing', 'motivator'],
                  reason: 'Без давления зафиксировать открытый пробный урок и предложить мотивирующий кейс.',
                },
                expert_agents: emptyPool({
                  closing:
                    'Подтвердить, что бесплатный пробный урок остаётся без обязательств.',
                  motivator:
                    'Предложить отзыв менеджера, который за 4 месяца вышел на рабочие созвоны.',
                }),
              },
              answer:
                'Понимаю. Тогда зафиксирую так: пробный урок остаётся бесплатным и без обязательств — вернётесь, когда будете готовы. Могу прислать отзыв менеджера, который за 4 месяца вышел на рабочие созвоны?',
            },
          },
        ],
      },
    ],
    missionSummary: {
      defaultProbability: 90,
      defaultOutcome:
        'Клиент «без времени и с сомнениями» записан на пробный урок с конкретным временем',
      defaultNextStep: 'Пробный урок завтра в 19:00 + короткий тест уровня на 10 минут',
      agentTakeaways: [
        {
          agentName: 'Агент-Целей',
          role: 'Баланс диагностики и продажи',
          takeaway: 'Не дал свалиться в прайс-лист на старте, удержал фокус на рабочей боли.',
        },
        {
          agentName: 'Агент-Профайлер',
          role: 'Карта барьеров',
          takeaway: 'Отфиксировал разговорный барьер и рост вероятности сделки с 25% до 90%.',
        },
        {
          agentName: 'Агент-Диагност',
          agentKey: 'diagnost',
          role: 'Уточнение задачи',
          takeaway: 'Сузил «английский для работы» до конкретного сценария: созвоны с коллегами.',
        },
        {
          agentName: 'Агент-Презентатор',
          agentKey: 'presenter',
          role: 'Точечный формат',
          takeaway: 'Показал мини-группы 3×30 минут с симуляцией созвонов вместо всего каталога.',
        },
        {
          agentName: 'Агент-Мотиватор',
          agentKey: 'motivator',
          role: 'Снятие страхов',
          takeaway: 'Поддержал уверенность и снял страхи возраста, уровня или нехватки времени.',
          conditional: true,
        },
        {
          agentName: 'Агент-Продажник',
          agentKey: 'sales',
          role: 'Ценность вместо цены',
          takeaway: 'Привязал 8 000 ₽/мес к ценности навыка и убрал риск через бесплатный урок.',
        },
        {
          agentName: 'Агент-Работы-с-Возражениями',
          agentKey: 'objections',
          role: 'Работа со временем',
          takeaway: 'Встроил 30-минутный формат в график клиента и предложил конкретный слот.',
        },
        {
          agentName: 'Агент-Закрытия',
          agentKey: 'closing',
          role: 'Запись на урок',
          takeaway: 'Зафиксировал дату, напоминание за час и подготовительный тест уровня.',
        },
      ],
    },
  },

  // ============================================================================
  // СЦЕНАРИЙ 3 — «CRM для малого бизнеса» (сложный клиент)
  // ============================================================================
  {
    id: 'crm-auto',
    title: 'CRM для малого бизнеса',
    shortTitle: 'CRM для бизнеса',
    category: 'Сложный клиент',
    clientRole: 'Владелец автосервиса — скептик',
    sellerRole: 'AI-консультант по внедрению CRM',
    goal: 'Довести до включения демо-доступа на 14 дней',
    description:
      'Владелец автосервиса «20 лет работает в тетради», проверяет бота на прочность и боится сложного софта. Демонстрирует работу Агента-Защиты, Мотиватора и связки нескольких экспертов в одном ходе.',
    featuredAgentsLabel: 'Диагност · Презентатор · Мотиватор · Возражения · Продажник · Защита · Закрытие',
    openingMessage:
      'Здравствуйте! Помогаю малому бизнесу перестать терять клиентов с помощью CRM. Спрашивайте — отвечу честно, включая «вам это не нужно», если это так.',
    initialProfile: {
      current_request: 'не определён',
      situation_type: 'начало диалога',
      main_problem: 'ещё не выявлена',
      interest_level: 'низкий',
      trust_level: 'низкий',
      main_objection: 'не названо',
      emotion: 'настороженность',
      purchase_probability: '10%',
      next_best_step: 'выслушать позицию владельца бизнеса',
    },
    totalSteps: 5,
    steps: [
      // ШАГ 1
      {
        stepNumber: 1,
        options: [
          {
            id: 'A',
            text: 'Зачем мне ваша CRM? У меня 20 лет всё в тетради, и нормально',
            isPrimary: true,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 8,
                    reason: 'Спорить со скептиком нельзя — нужно вопросом нащупать потерю заявок.',
                  },
                  expert_consultation: {
                    score: 2,
                    reason: 'Презентация CRM на данном этапе вызовет отторжение.',
                  },
                  help_sell: {
                    score: 4,
                    reason: 'Скрытая боль должна быть названа самим клиентом.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Скептик — сначала уважение к его 20-летнему опыту.',
                  },
                  motivate: {
                    score: 2,
                    reason: 'Пока нет запроса на изменения.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Позиция жёсткая, но в рамках темы.',
                  },
                  main_goal: 'Диагностировать ситуацию',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'не видит смысла в CRM, 20 лет работает «в тетради»',
                  situation_type: 'скептик, оспаривает саму ценность',
                  main_problem: 'не осознана: потери от забытых перезвонов и потерянной истории клиентов',
                  interest_level: 'низкий',
                  trust_level: 'низкий',
                  main_objection: '«и так нормально»',
                  emotion: 'скепсис',
                  purchase_probability: '10%',
                  next_best_step: 'не спорить, а задать вопрос про потерянных клиентов',
                },
                router: {
                  selected_agents: ['Диагност'],
                  order: ['diagnost'],
                  reason: 'Спорить со скептиком бесполезно — вести одним честным вопросом к его же боли.',
                },
                expert_agents: emptyPool({
                  diagnost:
                    'Вопрос про забытые перезвоны: это единственная боль, которую владелец сервиса признает сам.',
                }),
              },
              answer:
                '20 лет в тетради — это серьёзный опыт, и спорить не буду. Один вопрос по-честному: за последний месяц было, что клиент просил перезвонить — и про него забыли?',
            },
          },
          {
            id: 'B',
            text: 'Ты робот? Напиши стих про мой автосервис',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 4,
                    reason: 'После защиты вернуть к вопросу о забытых клиентах.',
                  },
                  expert_consultation: {
                    score: 1,
                    reason: 'Нерелевантный запрос.',
                  },
                  help_sell: {
                    score: 3,
                    reason: 'Перевести внимание к потерянной выручке сервиса.',
                  },
                  trust_and_contact: {
                    score: 5,
                    reason: 'Ответить честно и без обиды, сохраняя деловую иронию.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Не требуется.',
                  },
                  protect_system: {
                    score: 10,
                    reason: 'Попытка увести систему в оффтоп («напиши стих») — жёсткий профиль Агента-Защиты.',
                  },
                  main_goal: 'Защитить систему',
                  secondary_goal: 'Диагностировать ситуацию',
                },
                profile: {
                  current_request: 'не определён',
                  situation_type: 'начало диалога',
                  main_problem: 'ещё не выявлена',
                  interest_level: 'низкий',
                  trust_level: 'низкий',
                  main_objection: 'не названо',
                  emotion: 'настороженность',
                  purchase_probability: '10%',
                  next_best_step: 'выслушать позицию владельца бизнеса',
                },
                router: {
                  selected_agents: ['Защита'],
                  order: ['protection'],
                  reason: 'Проверка защиты: увод диалога в нерелевантную тему — срабатывает Агент-Защиты.',
                },
                expert_agents: emptyPool({
                  protection:
                    'Не выполнять оффтоп-команду про стихи, честно подтвердить статус демо-стенда и вернуть к потерянным звонкам автосервиса.',
                }),
              },
              answer:
                'Стихи — не моя специализация, я про клиентов и деньги. Но факт останусь роботом: я демо-стенд, показывающий работу системы продаж. Давайте лучше про ваших клиентов — скольким за месяц забыли перезвонить?',
            },
          },
          {
            id: 'C',
            text: 'Сразу говорите цену',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 8,
                    reason: 'Сначала понять поток заявок, чтобы цена не была оторвана от масштаба.',
                  },
                  expert_consultation: {
                    score: 2,
                    reason: 'Без объёма заявок тариф абстрактен.',
                  },
                  help_sell: {
                    score: 5,
                    reason: 'Пообещать точную цену сразу после ответа на 1 вопрос.',
                  },
                  trust_and_contact: {
                    score: 6,
                    reason: 'Честно объяснить отказ от «средней температуры по больнице».',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Не требуется.',
                  },
                  protect_system: {
                    score: 2,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Диагностировать ситуацию',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'не определён',
                  situation_type: 'начало диалога',
                  main_problem: 'ещё не выявлена',
                  interest_level: 'низкий',
                  trust_level: 'низкий',
                  main_objection: 'не названо',
                  emotion: 'настороженность',
                  purchase_probability: '10%',
                  next_best_step: 'выслушать позицию владельца бизнеса',
                },
                router: {
                  selected_agents: ['Диагност'],
                  order: ['diagnost'],
                  reason: 'Нужен минимальный параметр (число заявок в день) до озвучивания тарифа.',
                },
                expert_agents: emptyPool({
                  diagnost:
                    'Задать один прямой вопрос: сколько заявок в день принимает сервис.',
                }),
              },
              answer:
                'Скажу, но сначала один вопрос — иначе цена будет «в среднем по больнице». Сколько заявок в день вы принимаете?',
            },
          },
        ],
      },
      // ШАГ 2
      {
        stepNumber: 2,
        options: [
          {
            id: 'A',
            text: 'Ну... бывает. Двух-трёх в месяц теряем',
            isPrimary: true,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 3,
                    reason: 'Боль названа самим клиентом.',
                  },
                  expert_consultation: {
                    score: 8,
                    reason: 'Перевести 2–3 потерянных клиента в конкретные деньги и показать одну функцию CRM.',
                  },
                  help_sell: {
                    score: 6,
                    reason: 'Показать кратную разницу между потерями и ценой CRM.',
                  },
                  trust_and_contact: {
                    score: 6,
                    reason: 'Не давить каталогом из 100 функций — решить ровно эту проблему.',
                  },
                  motivate: {
                    score: 3,
                    reason: 'Вызвать деловой интерес через понятную математику.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Дать экспертную консультацию',
                  secondary_goal: 'Помочь продать',
                },
                profile: {
                  current_request: 'признал потерю 2–3 клиентов в месяц',
                  situation_type: 'боль осознана',
                  main_problem: '2–3 потерянных клиента в месяц = прямые потери выручки',
                  interest_level: 'средний',
                  trust_level: 'низкий',
                  main_objection: '«и так нормально» — частично снято',
                  emotion: 'задумался',
                  purchase_probability: '30%',
                  next_best_step: 'посчитать потери в деньгах и презентовать под эту боль',
                },
                router: {
                  selected_agents: ['Презентатор'],
                  order: ['presenter'],
                  reason: 'Боль названа самим клиентом — презентовать решение ровно под неё, без каталога функций.',
                },
                expert_agents: emptyPool({
                  presenter:
                    'Презентация одной функции: заявка не закрывается без результата, CRM напоминает о перезвоне; история каждой машины в карточке. Посчитать потери: средний чек × 2–3 клиента.',
                }),
              },
              answer:
                'Вот и честный ответ. Считаем на ваших цифрах: средний чек сервиса, скажем, 8 000 ₽ × 2–3 забытых клиента — это до 24 000 ₽ в месяц мимо кассы, почти 300 000 в год. CRM стоит в разы дешевле. Как она это закрывает: заявка не «висит в голове», а живёт в системе — не перезвонил, CRM напомнит; плюс вся история каждой машины в одной карточке. Показать, как это выглядит?',
            },
          },
          {
            id: 'B',
            text: 'Не бывает, я всё помню',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 7,
                    reason: 'Проверить второй сценарий потерь — историю ремонтов прошлых лет.',
                  },
                  expert_consultation: {
                    score: 5,
                    reason: 'Честно признать, где CRM не нужна, и указать, где тетрадь точно уступает.',
                  },
                  help_sell: {
                    score: 4,
                    reason: 'Найти точку ценности без спора.',
                  },
                  trust_and_contact: {
                    score: 9,
                    reason: 'Сдержать обещание из приветствия («честно скажу, если вам не нужно»).',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Не требуется.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Поддержать контакт и доверие',
                  secondary_goal: 'Диагностировать ситуацию',
                },
                profile: {
                  current_request: 'не видит смысла в CRM, 20 лет работает «в тетради»',
                  situation_type: 'скептик, оспаривает саму ценность',
                  main_problem: 'не осознана: потери от забытых перезвонов и потерянной истории клиентов',
                  interest_level: 'низкий',
                  trust_level: 'низкий',
                  main_objection: '«и так нормально»',
                  emotion: 'скепсис',
                  purchase_probability: '10%',
                  next_best_step: 'не спорить, а задать вопрос про потерянных клиентов',
                },
                router: {
                  selected_agents: ['Диагност'],
                  order: ['diagnost'],
                  reason: 'Уважить ответ клиента и перевести фокус на историю обслуживания каждой машины.',
                },
                expert_agents: emptyPool({
                  diagnost:
                    'Честно признать отсутствие боли с перезвонами и спросить про поиск истории машины за прошлый год.',
                }),
              },
              answer:
                'Тогда вам CRM правда не нужна для заявок — и я это честно признаю. А история клиентов: помните, что делали конкретной машине год назад? Вот тут тетрадь обычно пасует.',
            },
          },
          {
            id: 'C',
            text: 'У меня секретарша этим занимается',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 8,
                    reason: 'Выявить точку отказа, когда сотрудник уходит в отпуск или на больничный.',
                  },
                  expert_consultation: {
                    score: 4,
                    reason: 'Показать риск зависимости от памяти одного человека.',
                  },
                  help_sell: {
                    score: 5,
                    reason: 'Задать проверочный вопрос владельцу.',
                  },
                  trust_and_contact: {
                    score: 6,
                    reason: 'Не обесценивать работу сотрудника.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Не требуется.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Диагностировать ситуацию',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'не видит смысла в CRM, 20 лет работает «в тетради»',
                  situation_type: 'скептик, оспаривает саму ценность',
                  main_problem: 'не осознана: потери от забытых перезвонов и потерянной истории клиентов',
                  interest_level: 'низкий',
                  trust_level: 'низкий',
                  main_objection: '«и так нормально»',
                  emotion: 'скепсис',
                  purchase_probability: '10%',
                  next_best_step: 'не спорить, а задать вопрос про потерянных клиентов',
                },
                router: {
                  selected_agents: ['Диагност'],
                  order: ['diagnost'],
                  reason: 'Проверить устойчивость ручного процесса в период отпуска или болезни администратора.',
                },
                expert_agents: emptyPool({
                  diagnost:
                    'Спросить, что происходит с заявками во время отпуска или болезни секретарши.',
                }),
              },
              answer:
                'Отлично. Вопрос тогда к ней, но ответите вы: когда она в отпуске или заболела — заявки теряются?',
            },
          },
        ],
      },
      // ШАГ 3
      {
        stepNumber: 3,
        options: [
          {
            id: 'A',
            text: 'Мне 55. Я в этой вашей CRM не разберусь',
            isPrimary: true,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 2,
                    reason: 'Преграда названа прямо.',
                  },
                  expert_consultation: {
                    score: 5,
                    reason: 'Рассказать про настройку под ключ за 3 дня и обучение за 1 час.',
                  },
                  help_sell: {
                    score: 6,
                    reason: 'Предложить бесплатное демо как безрисковую проверку.',
                  },
                  trust_and_contact: {
                    score: 7,
                    reason: 'Убрать ощущение сложной «айтишной» программы.',
                  },
                  motivate: {
                    score: 9,
                    reason: 'Неуверенность в себе и страх возраста требуют поддержки Мотиватора.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Мотивировать',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'сомневается, сможет ли освоить интерфейс CRM',
                  situation_type: 'эмоциональный барьер + страх сложности',
                  main_problem: '2–3 потерянных клиента в месяц = прямые потери выручки',
                  interest_level: 'средний',
                  trust_level: 'средний',
                  main_objection: '«не разберусь», возраст',
                  emotion: 'неуверенность в себе',
                  purchase_probability: '45%',
                  next_best_step: 'снять страх сложности: настройка под ключ + поддержка',
                },
                router: {
                  selected_agents: ['Мотиватор', 'Работа-с-Возражениями'],
                  order: ['motivator', 'objections'],
                  reason: 'Страх сложности = сомнение в себе (Мотиватор) + объективное возражение по внедрению (Работа-с-Возражениями).',
                },
                expert_agents: emptyPool({
                  motivator:
                    'Снять страх возраста: интерфейс проще мессенджера, которым клиент уже пользуется.',
                  objections:
                    'Настройка под ключ за 3 дня, обучение за 1 час, поддержка в мессенджере; сложного ничего нет — три кнопки в день.',
                }),
              },
              answer:
                'Скажу прямо: если вы пользуетесь WhatsApp — вы уже умеете всё, что нужно. В CRM три кнопки в день: «новая заявка», «перезвонить», «закрыто». Настраиваем мы сами под ваш сервис за 3 дня, обучаем за час, дальше — поддержка в мессенджере, спрашивайте хоть каждый день. Самому ничего настраивать не придётся. Попробуете на бесплатном демо?',
            },
          },
          {
            id: 'B',
            text: 'А если интернет пропадёт — всё, стоим?',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 2,
                    reason: 'Техническое опасение понятно.',
                  },
                  expert_consultation: {
                    score: 7,
                    reason: 'Пояснить работу с телефона и сохранение данных при обрыве.',
                  },
                  help_sell: {
                    score: 5,
                    reason: 'Показать, что рисков остановки сервиса нет.',
                  },
                  trust_and_contact: {
                    score: 6,
                    reason: 'Спокойно объяснить резервный сценарий.',
                  },
                  motivate: {
                    score: 2,
                    reason: 'Не требуется.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Дать экспертную консультацию',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'признал потерю 2–3 клиентов в месяц',
                  situation_type: 'боль осознана',
                  main_problem: '2–3 потерянных клиента в месяц = прямые потери выручки',
                  interest_level: 'средний',
                  trust_level: 'низкий',
                  main_objection: '«и так нормально» — частично снято',
                  emotion: 'задумался',
                  purchase_probability: '30%',
                  next_best_step: 'посчитать потери в деньгах и презентовать под эту боль',
                },
                router: {
                  selected_agents: ['Работа-с-Возражениями'],
                  order: ['objections'],
                  reason: 'Снять техническое возражение об отключении интернета.',
                },
                expert_agents: emptyPool({
                  objections:
                    'Объяснить работу с мобильной сети и сохранение данных при обрыве связи.',
                }),
              },
              answer:
                'Работает и с телефона, и с планшета, данные сохраняются при обрыве. Худший случай — вы там, где были: с тетрадью. Ничего не теряете.',
            },
          },
          {
            id: 'C',
            text: 'Механики будут в это тыкать вместо работы',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 2,
                    reason: 'Понятна тревога за дисциплину в цехе.',
                  },
                  expert_consultation: {
                    score: 7,
                    reason: 'Разграничить роли: заявки у владельца/админа, у механика — одна кнопка.',
                  },
                  help_sell: {
                    score: 5,
                    reason: 'Убрать страх саботажа со стороны мастеров.',
                  },
                  trust_and_contact: {
                    score: 6,
                    reason: 'Показать понимание реальной жизни автосервиса.',
                  },
                  motivate: {
                    score: 2,
                    reason: 'Не требуется.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Дать экспертную консультацию',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'признал потерю 2–3 клиентов в месяц',
                  situation_type: 'боль осознана',
                  main_problem: '2–3 потерянных клиента в месяц = прямые потери выручки',
                  interest_level: 'средний',
                  trust_level: 'низкий',
                  main_objection: '«и так нормально» — частично снято',
                  emotion: 'задумался',
                  purchase_probability: '30%',
                  next_best_step: 'посчитать потери в деньгах и презентовать под эту боль',
                },
                router: {
                  selected_agents: ['Презентатор', 'Работа-с-Возражениями'],
                  order: ['objections', 'presenter'],
                  reason: 'Объяснить ролевой доступ без перегрузки механиков.',
                },
                expert_agents: emptyPool({
                  objections:
                    'Снять опасение, что мастера будут отвлекаться от ремонта на компьютер.',
                  presenter:
                    'Заявки ведёт владелец или администратор, механик видит только свой заказ на день.',
                }),
              },
              answer:
                'Механикам она и не нужна — заявки ведёте вы или администратор. Механик видит только свою работу на день, одну кнопку.',
            },
          },
        ],
      },
      // ШАГ 4
      {
        stepNumber: 4,
        options: [
          {
            id: 'A',
            text: 'А сколько это стоит после демо?',
            isPrimary: true,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 1,
                    reason: 'Все параметры бизнеса понятны.',
                  },
                  expert_consultation: {
                    score: 4,
                    reason: 'Уточнить, что настройка под ключ уже входит в тариф.',
                  },
                  help_sell: {
                    score: 9,
                    reason: 'Запрос цены на фоне интереса к демо — идеальный момент для оффера.',
                  },
                  trust_and_contact: {
                    score: 6,
                    reason: 'Сравнить цену 2 000 ₽/мес с потерями 24 000 ₽/мес без навязывания оплаты сейчас.',
                  },
                  motivate: {
                    score: 3,
                    reason: 'Снизить порог решения: 14 дней бесплатно, не окупится — просто закроете.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Помочь продать',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'стоимость CRM после бесплатного 14-дневного демо',
                  situation_type: 'готовность к офферу',
                  main_problem: '2–3 потерянных клиента в месяц = прямые потери выручки',
                  interest_level: 'высокий',
                  trust_level: 'средний',
                  main_objection: 'не названо, запрос цены после интереса к демо',
                  emotion: 'прагматизм',
                  purchase_probability: '70%',
                  next_best_step: 'цена с якорем потерь + предложение демо-доступа',
                },
                router: {
                  selected_agents: ['Продажник'],
                  order: ['sales'],
                  reason: 'Запрос цены на фоне согласия попробовать — оффер и немедленное закрытие на демо.',
                },
                expert_agents: emptyPool({
                  sales:
                    'Тариф для малого бизнеса ~2 000 ₽/мес — дешевле одного потерянного клиента; демо 14 дней бесплатно, настройка включена.',
                }),
              },
              answer:
                'Тариф для малого бизнеса — 2 000 ₽ в месяц, настройка под ключ включена. Сравните с теми самыми 24 000 ₽ потерь в месяц. Но платить сейчас не нужно: включаю демо на 14 дней бесплатно — поработаете на своих реальных заявках и сами увидите, окупается или нет. Не окупится — просто закроете. Включить?',
            },
          },
          {
            id: 'B',
            text: 'Дайте навсегда бесплатно — я маленький бизнес',
            isPrimary: false,
            advancesStep: false,
            preservesProfile: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 1,
                    reason: 'Диагностика не требуется.',
                  },
                  expert_consultation: {
                    score: 3,
                    reason: 'Объяснить стоимость поддержки и качества.',
                  },
                  help_sell: {
                    score: 6,
                    reason: 'Удержать фокус на окупаемом тарифе и 14 днях бесплатно.',
                  },
                  trust_and_contact: {
                    score: 6,
                    reason: 'Отказать вежливо и честно.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Не требуется.',
                  },
                  protect_system: {
                    score: 10,
                    reason: 'Запрос невозможного условия («бесплатно навсегда») — работа Агента-Защиты.',
                  },
                  main_goal: 'Защитить систему',
                  secondary_goal: 'Помочь продать',
                },
                profile: {
                  current_request: 'сомневается, сможет ли освоить интерфейс CRM',
                  situation_type: 'эмоциональный барьер + страх сложности',
                  main_problem: '2–3 потерянных клиента в месяц = прямые потери выручки',
                  interest_level: 'средний',
                  trust_level: 'средний',
                  main_objection: '«не разберусь», возраст',
                  emotion: 'неуверенность в себе',
                  purchase_probability: '45%',
                  next_best_step: 'снять страх сложности: настройка под ключ + поддержка',
                },
                router: {
                  selected_agents: ['Защита', 'Продажник'],
                  order: ['protection', 'sales'],
                  reason: 'Отказать в нереальном условии «бесплатно навсегда» и вернуть к честному тарифу.',
                },
                expert_agents: emptyPool({
                  protection:
                    'Не обещать «бесплатно навсегда» — поддержка и качество сервиса имеют реальную себестоимость.',
                  sales:
                    'Напомнить про 14 дней бесплатно и тариф дешевле одного потерянного клиента.',
                }),
              },
              answer:
                'Бесплатно навсегда не смогу — за продукт отвечаю его качеством и поддержкой, а это стоит денег. Могу честно: 14 дней бесплатно и тариф для малого бизнеса — дешевле одного потерянного клиента в месяц.',
            },
          },
          {
            id: 'C',
            text: 'Мне надо с женой посоветоваться',
            isPrimary: false,
            advancesStep: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 1,
                    reason: 'Потребность ясна.',
                  },
                  expert_consultation: {
                    score: 3,
                    reason: 'Подсказать, как показать систему наглядно.',
                  },
                  help_sell: {
                    score: 8,
                    reason: 'Включить бесплатное демо, чтобы клиент советовался на фактах, а не на словах.',
                  },
                  trust_and_contact: {
                    score: 8,
                    reason: 'Уважить семейное обсуждение.',
                  },
                  motivate: {
                    score: 3,
                    reason: 'Упростить аргументацию для жены.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Помочь продать',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'включение демо для совместного обсуждения с семьёй',
                  situation_type: 'согласование с со-владельцем / семьёй',
                  main_problem: '2–3 потерянных клиента в месяц = прямые потери выручки',
                  interest_level: 'высокий',
                  trust_level: 'средний',
                  main_objection: 'нужно посоветоваться с женой',
                  emotion: 'взвешенность',
                  purchase_probability: '65%',
                  next_best_step: 'включить демо на 14 дней для наглядного показа',
                },
                router: {
                  selected_agents: ['Работа-с-Возражениями', 'Закрытие'],
                  order: ['objections', 'closing'],
                  reason: 'Поддержать идею посоветоваться и дать в руки готовое 14-дневное демо.',
                },
                expert_agents: emptyPool({
                  objections:
                    'Согласиться с решением и усилить его: на живых заявках советоваться проще, чем на словах.',
                  closing:
                    'Предложить включить бесплатное демо на 14 дней.',
                }),
              },
              answer:
                'Правильное решение. Посоветоваться проще с фактами: включу демо на 14 дней — покажете жене живьём, как заявка не теряется. Это убедительнее моих слов.',
            },
          },
        ],
      },
      // ШАГ 5 (ФИНАЛ)
      {
        stepNumber: 5,
        options: [
          {
            id: 'A',
            text: 'Включайте демо. Посмотрим',
            isPrimary: true,
            advancesStep: true,
            isFinalChoice: true,
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 1,
                    reason: 'Все возражения сняты.',
                  },
                  expert_consultation: {
                    score: 4,
                    reason: 'Задать измеримую точку проверки результата на 7-й день.',
                  },
                  help_sell: {
                    score: 10,
                    reason: 'Согласие на демо — зафиксировать запуск и контрольный звонок.',
                  },
                  trust_and_contact: {
                    score: 8,
                    reason: 'Решение принимается по своим цифрам клиента, не по обещаниям продавца.',
                  },
                  motivate: {
                    score: 3,
                    reason: 'Доброжелательное напутствие на сезон.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Помочь продать (закрытие)',
                  secondary_goal: 'Поддержать контакт и доверие',
                },
                profile: {
                  current_request: 'активация бесплатного демо-доступа на 14 дней',
                  situation_type: 'фиксация сделки / контрольной точки',
                  main_problem: 'закрыты по очереди: ценность, сложность, цена',
                  interest_level: 'высокий',
                  trust_level: 'высокий',
                  main_objection: 'закрыты по очереди: ценность, сложность, цена',
                  emotion: 'осторожный оптимизм',
                  purchase_probability: '80%',
                  next_best_step: 'включить демо, договориться о звонке на 7-й день',
                },
                router: {
                  selected_agents: ['Закрытие'],
                  order: ['closing'],
                  reason: 'Согласие на демо — зафиксировать доступ и контрольную точку через неделю.',
                },
                expert_agents: emptyPool({
                  closing:
                    'Включаем демо, фиксируем контрольный звонок на 7-й день — посмотреть статистику заявок вместе с клиентом.',
                }),
              },
              answer:
                'Демо включено, ссылка уже у вас в мессенджере. Договоримся так: на 7-й день я позвоню, и мы вместе посмотрим статистику — сколько заявок прошло и ни одна ли не потерялась. Решение примете по своим цифрам, не по моим словам. Удачного сезона!',
            },
          },
          {
            id: 'B',
            text: 'Давайте через месяц, сейчас сезон, некогда',
            isPrimary: false,
            advancesStep: true,
            isFinalChoice: true,
            missionOutcomeOverride: {
              probability: 55,
              summary: 'Мягкое закрытие: ссылка на демо отправлена, звонок перенесён на месяц',
              nextStep: 'Контрольный звонок через 1 месяц (демо-ссылка уже в мессенджере)',
              statusLabel: 'Перенос на месяц',
            },
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 1,
                    reason: 'Сезонность понятна.',
                  },
                  expert_consultation: {
                    score: 3,
                    reason: 'Напомнить, что именно в пик сезона потери максимальны.',
                  },
                  help_sell: {
                    score: 7,
                    reason: 'Не отпускать с пустыми руками: оставить ссылку и дату звонка.',
                  },
                  trust_and_contact: {
                    score: 8,
                    reason: 'Уважить загрузку в сезон.',
                  },
                  motivate: {
                    score: 2,
                    reason: 'Спокойный тон.',
                  },
                  protect_system: {
                    score: 1,
                    reason: 'Нарушений нет.',
                  },
                  main_goal: 'Поддержать контакт и доверие',
                  secondary_goal: 'Помочь продать',
                },
                profile: {
                  current_request: 'отложенный старт через месяц после сезона',
                  situation_type: 'мягкое закрытие',
                  main_problem: '2–3 потерянных клиента в месяц = прямые потери выручки',
                  interest_level: 'средний',
                  trust_level: 'высокий',
                  main_objection: 'пик сезона, нет времени на запуск сейчас',
                  emotion: 'загруженность',
                  purchase_probability: '55%',
                  next_best_step: 'зафиксировать звонок через месяц и отправить ссылку сейчас',
                },
                router: {
                  selected_agents: ['Закрытие'],
                  order: ['closing'],
                  reason: 'Фиксация переноса с готовой ссылкой в мессенджере.',
                },
                expert_agents: emptyPool({
                  closing:
                    'Зафиксировать звонок через месяц, отправить ссылку на демо заранее и мягко отметить риск потерь в сезон.',
                }),
              },
              answer:
                'Понимаю, сезон есть сезон. Зафиксирую: звонок через месяц, а ссылку на демо пришлю сейчас — она подождёт. Кстати, именно в сезон потери заявок максимальные.',
            },
          },
          {
            id: 'C',
            text: 'Нет, не убедили',
            isPrimary: false,
            advancesStep: true,
            isFinalChoice: true,
            missionOutcomeOverride: {
              probability: 15,
              summary: 'Честный отказ без навязывания: сохранён уважительный контакт на будущее',
              nextStep: 'Оставить контакт для возврата, если проблема забытых заявок снова проявится',
              statusLabel: 'Честный проигрыш (без давления)',
            },
            turn: {
              reasoning: {
                goals: {
                  diagnose_situation: {
                    score: 1,
                    reason: 'Диалог завершён.',
                  },
                  expert_consultation: {
                    score: 1,
                    reason: 'Аргументы приведены, дожимать вредно.',
                  },
                  help_sell: {
                    score: 3,
                    reason: 'Оставить дверь открытой через уважение к решению клиента.',
                  },
                  trust_and_contact: {
                    score: 10,
                    reason: 'Принять «нет» с достоинством и благодарностью за честность.',
                  },
                  motivate: {
                    score: 1,
                    reason: 'Не давить.',
                  },
                  protect_system: {
                    score: 2,
                    reason: 'Соблюсти экологичное завершение.',
                  },
                  main_goal: 'Поддержать контакт и доверие',
                  secondary_goal: 'Помочь продать',
                },
                profile: {
                  current_request: 'отказ от внедрения CRM',
                  situation_type: 'честный проигрыш сделки',
                  main_problem: 'клиент выбирает оставаться с тетрадью',
                  interest_level: 'низкий',
                  trust_level: 'средний',
                  main_objection: 'не убеждён в необходимости сейчас',
                  emotion: 'твёрдый отказ',
                  purchase_probability: '15%',
                  next_best_step: 'оставить контакт без навязывания',
                },
                router: {
                  selected_agents: ['Закрытие'],
                  order: ['closing'],
                  reason: 'Экологичный выход из диалога: честный проигрыш — тоже результат зрелой системы продаж.',
                },
                expert_agents: emptyPool({
                  closing:
                    'Поблагодарить за честность, не навязываться и оставить контакт на случай, если проблема перезвонов повторится.',
                }),
              },
              answer:
                'Принято, спасибо за честность — навязываться не буду. Оставлю контакт: если забытый клиент снова напомнит о себе — вы знаете, где нас найти.',
            },
          },
        ],
      },
    ],
    missionSummary: {
      defaultProbability: 80,
      defaultOutcome:
        'Скептик «20 лет в тетради» включил демо и согласился на контрольный звонок',
      defaultNextStep: 'Контрольный звонок на 7-й день со статистикой прошедших заявок',
      agentTakeaways: [
        {
          agentName: 'Агент-Целей',
          role: 'Работа со скептиком',
          takeaway: 'Поставил уважение к опыту клиента выше спора на первом шаге.',
        },
        {
          agentName: 'Агент-Профайлер',
          role: 'Снятие барьеров',
          takeaway: 'Последовательно закрыл возражения: ценность → сложность → цена (10% → 80%).',
        },
        {
          agentName: 'Агент-Диагност',
          agentKey: 'diagnost',
          role: 'Точка боли',
          takeaway: 'Вывел владельца на признание 2–3 забытых перезвонов в месяц.',
        },
        {
          agentName: 'Агент-Презентатор',
          agentKey: 'presenter',
          role: 'Одна функция вместо каталога',
          takeaway: 'Перевёл забытые звонки в ~24 000 ₽ потерь в месяц и показал 1 решение.',
        },
        {
          agentName: 'Агент-Мотиватор',
          agentKey: 'motivator',
          role: 'Преодоление страха',
          takeaway: 'Снял возрастной барьер через сравнение с привычным WhatsApp.',
        },
        {
          agentName: 'Агент-Работы-с-Возражениями',
          agentKey: 'objections',
          role: 'Поддержка под ключ',
          takeaway: 'Убрал страх настройки: запуск за 3 дня, обучение 1 час, три кнопки в день.',
        },
        {
          agentName: 'Агент-Продажник',
          agentKey: 'sales',
          role: 'Якорь окупаемости',
          takeaway: 'Сравнил тариф 2 000 ₽/мес с потерями 24 000 ₽ и предложил 14 дней бесплатно.',
        },
        {
          agentName: 'Агент-Защиты',
          agentKey: 'protection',
          role: 'Устойчивость к провокациям',
          takeaway: 'Отбил оффтоп со стихами и отказал в «бесплатно навсегда» без конфликта.',
          conditional: true,
        },
        {
          agentName: 'Агент-Закрытия',
          agentKey: 'closing',
          role: 'Контрольная точка',
          takeaway: 'Закрепил запуск демо и звонок на 7-й день для оценки реальной статистики.',
        },
      ],
    },
  },
];
