import type { LearningPlan } from "@/types/learning-plan";

export const learningPlans: LearningPlan[] = [
  {
    id: "onboarding-day1",
    title: "Старт зміни для новачка",
    description: "Перший день: засвой базові скрипти, чек-листи та перевір знання про хіти продажу.",
    duration: "45 хв",
    checklistIds: ["morning-shift"],
    articleIds: ["welcome-flow", "cross-selling"],
    testIds: ["product-knowledge"],
  },
  {
    id: "upsell-pro",
    title: "Майстер перехресних продажів",
    description: "План для досвідчених: відпрацюй заперечення, онови викладку та отримай бейджі.",
    duration: "60 хв",
    checklistIds: ["closing"],
    articleIds: ["cross-selling", "merchandising-basics"],
    testIds: ["objections", "merchandising"],
  },
];
