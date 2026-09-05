// ========================================
// J / LY – MATEKMOZGÁS JÁTÉK
// ========================================


// ========================================
// JÁTÉK ÁLLAPOTA
// ========================================

const state = {
    running: false,
    sound: true,

    total: 300,
    gameTime: 5,
    thinkingTime: 5,

    answer: '',
    current: null,

    timer: null,
    next: null,
    thinkingTimer: null
};


// ========================================
// SEGÉDFÜGGVÉNYEK
// ========================================

const $ = (id) => document.getElementById(id);


// Véletlen egész szám
function rand(min, max) {
    return Math.floor(
        Math.random() * (max - min + 1)
    ) + min;
}


// Idő formázása
// Például: 300 → 05:00
function fmt(seconds) {

    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return (
        String(minutes).padStart(2, '0') +
        ':' +
        String(secs).padStart(2, '0')
    );
}


// ========================================
// SZAVAK
// ========================================
//
// A szóban a "__" helyén kell eldönteni:
// J vagy LY.
//
// Példa:
// "ha__ó" + "J" → hajó
//
// A lista később könnyen bővíthető.
//

const words = [

    // ------------------------------------
    // LY
    // ------------------------------------

    ['gó__a', 'LY'],
    ['kirá__', 'LY'],
    ['fo__ó', 'LY'],
    ['he__', 'LY'],
    ['mé__', 'LY'],
    ['vá__ú', 'LY'],
    ['bo__', 'LY'],
    ['pá__a', 'LY'],
    ['go__ó', 'LY'],
    ['se__mes', 'LY'],

    ['fo__tat', 'LY'],
    ['o__an', 'LY'],
    ['i__en', 'LY'],
    ['mi__en', 'LY'],
    ['ami__en', 'LY'],

    ['__uk', 'LY'],
    ['__ukas', 'LY'],
    ['sú__', 'LY'],
    ['sú__zó', 'LY'],
    ['sú__os', 'LY'],

    ['osztá__', 'LY'],
    ['kirá__lány', 'LY'],
    ['kirá__fi', 'LY'],
    ['fo__ton', 'LY'],
    ['fo__tatás', 'LY'],
    ['mo__', 'LY'],
    ['he__ett', 'LY'],


    // ------------------------------------
    // J
    // ------------------------------------

    ['__ég', 'J'],
    ['__ó', 'J'],
    ['__ön', 'J'],
    ['__ár', 'J'],
    ['__árda', 'J'],
    ['__áték', 'J'],
    ['__átszik', 'J'],
    ['__avít', 'J'],

    ['ha__', 'J'],
    ['ha__ó', 'J'],
    ['ha__nal', 'J'],
    ['ha__lik', 'J'],
    ['ha__t', 'J'],

    ['a__tó', 'J'],
    ['a__ándék', 'J'],

    ['ba__', 'J'],
    ['ba__nok', 'J'],
    ['ba__usz', 'J'],

    ['fe__', 'J'],
    ['te__', 'J'],
    ['za__', 'J'],

    ['ra__z', 'J'],
    ['ra__zol', 'J'],

    ['sa__t', 'J'],
    ['pa__ta', 'J'],
    ['pa__zs', 'J'],

    ['ma__om', 'J'],
    ['to__ás', 'J'],
    ['ú__ság', 'J'],

    ['va__', 'J'],
    ['ka__la', 'J']
];


// ========================================
// HANG
// ========================================

function beep(
    frequency = 520,
    duration = 70
) {

    if (!state.sound) {
        return;
    }

    try {

        const AudioCtx =
            window.AudioContext ||
            window.webkitAudioContext;

        const context = new AudioCtx();

        const oscillator =
            context.createOscillator();

        const gain =
            context.createGain();


        oscillator.frequency.value =
            frequency;

        oscillator.type = 'sine';

        gain.gain.value = 0.045;


        oscillator.connect(gain);
        gain.connect(context.destination);


        oscillator.start();


        setTimeout(() => {

            oscillator.stop();
            context.close();

        }, duration);

    } catch (error) {

        // Ha a böngésző nem engedi a hangot,
        // a játék ettől még működjön.

    }
}


// ========================================
// ÚJ SZÓ GENERÁLÁSA
// ========================================

function makeProblem() {

    const word =
        words[rand(0, words.length - 1)];


    state.current = word;
    state.answer = word[1];


    // A "__" helyén lesz a hiányzó J / LY.

    const parts =
        word[0].split('__');


    $('wordPrefix').textContent =
        parts[0];

    $('wordSuffix').textContent =
        parts[1] || '';


    // A középső jel helyén kérdőjel.

    $('op').textContent = '?';
}


// ========================================
// GONDOLKODÁSI IDŐ
// ========================================

function thinking() {

    if (!state.running) {
        return;
    }


    // Előző eredmény eltüntetése

    $('result').classList.remove('show');
    $('result').style.opacity = '0';


    // Új szó

    makeProblem();


    // Beállított gondolkodási idő

    let number =
        state.thinkingTime;


    $('countdown').textContent =
        number;

    beep();


    // Előző visszaszámláló törlése

    clearInterval(
        state.thinkingTimer
    );


    state.thinkingTimer =
        setInterval(() => {

            if (!state.running) {

                clearInterval(
                    state.thinkingTimer
                );

                return;
            }


            number--;


            if (number > 0) {

                $('countdown').textContent =
                    number;

                beep();

            } else {

                clearInterval(
                    state.thinkingTimer
                );

                reveal();
            }

        }, 1000);
}


// ========================================
// EREDMÉNY MEGMUTATÁSA
// ========================================

function reveal() {

    if (!state.running) {
        return;
    }


    const isLy =
        state.answer === 'LY';


    // Színosztály

    $('result').classList.remove(
        'even',
        'odd'
    );

    $('result').classList.add(
        isLy ? 'even' : 'odd'
    );


    // Eredmény

    $('resultAnswer').textContent =
        state.answer;

    $('resultLabel').textContent =
        'HELYES!';


    // Animáció újraindítása

    $('result').classList.remove(
        'show'
    );

    void $('result').offsetWidth;

    $('result').classList.add(
        'show'
    );


    $('countdown').textContent =
        'Mozdulj!';


    // Hang

    beep(
        isLy ? 760 : 620,
        120
    );


    // Következő szó

    state.next =
        setTimeout(() => {

            if (state.running) {
                thinking();
            }

        }, 3000);
}


// ========================================
// JÁTÉK INDÍTÁSA
// ========================================

function startGame() {

    if (state.running) {
        return;
    }


    // A játék indításakor próbáljunk meg teljes képernyőre váltani.
    // A Start gomb megnyomása felhasználói művelet, ezért a böngésző ezt engedélyezheti.
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen?.().catch(() => {});
    }


    state.running = true;

    state.total =
        state.gameTime * 60;


    // Idő kijelzése

    $('totalTimer').textContent =
        fmt(state.total);


    // Gombok

    $('startBtn').classList.add(
        'hidden'
    );

    $('stopBtn').classList.remove(
        'hidden'
    );


    // Játékidő

    state.timer =
        setInterval(() => {

            state.total--;

            $('totalTimer').textContent =
                fmt(state.total);


            if (state.total <= 0) {
                endGame();
            }

        }, 1000);


    // Első feladat

    thinking();
}


// ========================================
// JÁTÉK VÉGE
// ========================================

function endGame() {

    state.running = false;


    // Összes időzítő törlése

    clearInterval(state.timer);
    clearInterval(state.thinkingTimer);
    clearTimeout(state.next);


    state.timer = null;
    state.thinkingTimer = null;
    state.next = null;


    // Eredmény eltüntetése

    $('result').classList.remove(
        'show'
    );

    $('result').style.opacity = '0';


    // Gombok

    $('startBtn').classList.remove(
        'hidden'
    );

    $('stopBtn').classList.add(
        'hidden'
    );


    // Üzenet

    $('countdown').textContent =
        '🎉 Ügyesek vagytok!';
}


// ========================================
// HANG KI / BE
// ========================================

function toggleSound() {

    state.sound =
        !state.sound;


    $('soundBtn').textContent =
        state.sound
            ? '🔊'
            : '🔇';
}


// ========================================
// BEÁLLÍTÁSOK
// ========================================

const overlay =
    $('overlay');


function openSettings() {

    overlay.classList.add(
        'open'
    );
}


function closeSettings() {

    overlay.classList.remove(
        'open'
    );
}


// Beállítások megnyitása

$('settingsBtn').onclick =
    openSettings;


// X gomb

$('closeX').onclick =
    closeSettings;


// Kész gomb

$('closeSettings').onclick =
    closeSettings;


// Háttérre kattintás

overlay.onclick = (event) => {

    if (event.target === overlay) {
        closeSettings();
    }
};


// ESC

document.addEventListener(
    'keydown',
    (event) => {

        if (event.key === 'Escape') {
            closeSettings();
        }

    }
);


// ========================================
// JÁTÉKIDŐ BEÁLLÍTÁSA
// ========================================

$('gameTime').oninput =
    (event) => {

        state.gameTime =
            Number(event.target.value);


        $('gameTimeText').textContent =
            state.gameTime + ' perc';
    };


// ========================================
// GONDOLKODÁSI IDŐ BEÁLLÍTÁSA
// ========================================

$('thinkingTime').oninput =
    (event) => {

        state.thinkingTime =
            Number(event.target.value);


        $('thinkingTimeText').textContent =
            state.thinkingTime +
            ' másodperc';
    };


// ========================================
// TELJES KÉPERNYŐ
// ========================================

$('fullscreenBtn').onclick =
    () => {

        if (!document.fullscreenElement) {

            document.documentElement
                .requestFullscreen?.();

        } else {

            document
                .exitFullscreen?.();
        }
    };


// ========================================
// FŐ GOMBOK
// ========================================

$('startBtn').onclick =
    startGame;

$('stopBtn').onclick =
    endGame;

$('soundBtn').onclick =
    toggleSound;


// ========================================
// ZÁROLT JÁTÉKOK
// ========================================

document
    .querySelectorAll('.game-select')
    .forEach((button) => {

        button.onclick = () => {

            if (
                button.classList.contains(
                    'locked'
                )
            ) {

                toast(
                    'Ez a játék hamarosan érkezik! 🚀'
                );
            }

        };

    });


// ========================================
// ÉRTESÍTÉS
// ========================================

function toast(message) {

    $('toast').textContent =
        message;


    $('toast').classList.add(
        'show'
    );


    setTimeout(() => {

        $('toast').classList.remove(
            'show'
        );

    }, 1400);
}