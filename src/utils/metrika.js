export const reachGoal = (targetName, params = {}) => {

    const COUNTER_ID = 113172348;

    if (typeof window !== 'undefined' && window.ym) {
        window.ym(COUNTER_ID, 'reachGoal', targetName, params);
    } else {
        console.warn(`[Yandex Metrika] Цель ${targetName} не отправлена: ym не найден`);
    }
};