import type {Ref} from "vue";

const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export const useCountdown = (target: Ref<Date | null>) => {
    const now = ref(new Date());
    let interval: ReturnType<typeof setInterval> | null = null;

    const remainingMs = computed(() => {
        if (!target.value) return 0;
        return Math.max(0, target.value.getTime() - now.value.getTime());
    });

    const remaining = computed(() => {
        let rest = remainingMs.value;
        const days = Math.floor(rest / DAY_MS);
        rest -= days * DAY_MS;
        const hours = Math.floor(rest / HOUR_MS);
        rest -= hours * HOUR_MS;
        const minutes = Math.floor(rest / MINUTE_MS);
        rest -= minutes * MINUTE_MS;
        const seconds = Math.floor(rest / SECOND_MS);

        return {days, hours, minutes, seconds};
    });

    onMounted(() => {
        interval = setInterval(() => {
            now.value = new Date();
        }, SECOND_MS);
    });

    onUnmounted(() => {
        if (interval) clearInterval(interval);
    });

    return {
        now,
        remaining,
        remainingMs,
    };
};
