// Базові елементи
const uploadArea = document.getElementById('uploadArea');
const progressContainer = document.getElementById('progressContainer');
const animationArea = document.getElementById('animationArea');
const resultArea = document.getElementById('resultArea');
const progressFill = document.getElementById('progressFill');
const progressStatus = document.getElementById('progressStatus');
const progressPercentage = document.getElementById('progressPercentage');
const resetButton = document.getElementById('resetButton');
const lottieContainer = document.getElementById('lottieContainer');
const icons = document.querySelectorAll('.icon');

// Ініціалізація Lottie
let successAnimation;

function initLottie() {
    successAnimation = lottie.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'https://assets2.lottiefiles.com/packages/lf20_obhph3sh.json'
    });
}

// Стани обробки
const states = {
    IDLE: 'idle',
    UPLOADING: 'uploading',
    PROCESSING: 'processing',
    COMPLETE: 'complete'
};

let currentState = states.IDLE;
let progress = 0;

// Анімація іконок
function animateIcons() {
    icons.forEach((icon, index) => {
        setTimeout(() => {
            icon.classList.add('active');
        }, index * 300);
    });
}

function resetIcons() {
    icons.forEach(icon => {
        icon.classList.remove('active');
    });
}

// Клік по області завантаження
uploadArea.addEventListener('click', startProcess);
resetButton.addEventListener('click', resetProcess);

// Додаємо ефект перетягування файлу
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    startProcess();
});

// Ініціалізація при завантаженні сторінки
window.addEventListener('load', () => {
    initLottie();
});

function startProcess() {
    if (currentState !== states.IDLE) return;
    
    currentState = states.UPLOADING;
    uploadArea.style.display = 'none';
    progressContainer.style.display = 'block';
    
    simulateUpload();
}

function simulateUpload() {
    const uploadDuration = 2000;
    const startTime = Date.now();
    
    const updateUpload = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.min((elapsed / uploadDuration) * 30, 30);
        
        updateProgress('Завантаження файлу...', progress);
        
        if (progress < 30) {
            requestAnimationFrame(updateUpload);
        } else {
            setTimeout(startProcessing, 500);
        }
    };
    
    updateUpload();
}

function startProcessing() {
    currentState = states.PROCESSING;
    animationArea.style.display = 'block';
    animateIcons();
    
    const processingSteps = [
        { text: 'Аналіз даних...', duration: 2000 },
        { text: 'Генерація діаграм...', duration: 1500 },
        { text: 'Перевірка структури...', duration: 1000 }
    ];
    
    let stepIndex = 0;
    
    function runStep() {
        if (stepIndex >= processingSteps.length) {
            completeProcess();
            return;
        }
        
        const step = processingSteps[stepIndex];
        const startProgress = 30 + (stepIndex * 20);
        const endProgress = 30 + ((stepIndex + 1) * 20);
        const startTime = Date.now();
        
        const updateStep = () => {
            const elapsed = Date.now() - startTime;
            const stepProgress = Math.min(elapsed / step.duration, 1);
            progress = startProgress + (stepProgress * (endProgress - startProgress));
            
            updateProgress(step.text, progress);
            
            if (stepProgress < 1) {
                requestAnimationFrame(updateStep);
            } else {
                stepIndex++;
                setTimeout(runStep, 300);
            }
        };
        
        updateStep();
    }
    
    runStep();
}

function completeProcess() {
    currentState = states.COMPLETE;
    progress = 100;
    updateProgress('Звіт готовий!', 100);
    
    setTimeout(() => {
        progressContainer.style.display = 'none';
        animationArea.style.display = 'none';
        resultArea.style.display = 'block';
        successAnimation.play();
    }, 1000);
}

function updateProgress(status, percent) {
    progressStatus.textContent = status;
    progressPercentage.textContent = Math.round(percent) + '%';
    progressFill.style.width = percent + '%';
}

function resetProcess() {
    currentState = states.IDLE;
    progress = 0;
    
    resultArea.style.display = 'none';
    progressContainer.style.display = 'none';
    animationArea.style.display = 'none';
    uploadArea.style.display = 'block';
    
    updateProgress('', 0);
    resetIcons();
    successAnimation.goToAndStop(0, true);
}
