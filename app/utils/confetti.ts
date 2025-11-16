import confetti from 'canvas-confetti';

const duration = 60 * 60 * 1000;
const animationEnd = Date.now() + duration;
const defaults = {startVelocity: 30, spread: 360, ticks: 20, zIndex: 0};

let confettiInterval: any = null;
let passed = false;

function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

const checkDatePassed = (eDate: Date) => {
    return Date.now() > eDate.getTime();
}

export const launchConfetti = (eDate: Date) => {
    if (confettiInterval) return;

    if (!passed && checkDatePassed(eDate)) {
        passed = true;
    }

    if (passed) {
        confettiInterval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(confettiInterval);
                confettiInterval = null;
                return;
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti(
                Object.assign({}, defaults, {
                    particleCount,
                    origin: {x: randomInRange(0.1, 0.3), y: Math.random() - 0.2}
                })
            );
            confetti(
                Object.assign({}, defaults, {
                    particleCount,
                    origin: {x: randomInRange(0.7, 0.9), y: Math.random() - 0.2}
                })
            );
            confetti(
                Object.assign({}, defaults, {
                    particleCount: particleCount * 0.75,
                    origin: {x: randomInRange(0.4, 0.6), y: Math.random() - 0.2}
                })
            );
        }, 300);
    }
}

// Only run on client-side
if (process.client) {
    const handleWindowFocus = (eDate: Date) => {
        if (passed && !confettiInterval) {
            launchConfetti(eDate);
        }
    };

    const handleWindowBlur = () => {
        if (confettiInterval) {
            clearInterval(confettiInterval);
            confettiInterval = null;
        }
    };

    window.addEventListener('focus', () => handleWindowFocus(new Date('2025-06-02T17:00:00Z')));
    window.addEventListener('blur', handleWindowBlur);
}
