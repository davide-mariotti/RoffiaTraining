// Firenze Marathon 2026 - Training Plan Data
// Parsed from Runna CSV export

const RACE_DATE = new Date('2026-11-29');
const PLAN_START = new Date(2026, 5, 2); // June 2, 2026 — local time (avoids UTC offset bug)
const TOTAL_WEEKS = 26;

// Workout types with Runna-style colors
const TYPE_CONFIG = {
    'Easy Run': { color: '#4CAF50', bg: '#1a2e1a', label: 'Easy Run', icon: '🟢' },
    'Long Run': { color: '#9C27B0', bg: '#261a2e', label: 'Long Run', icon: '🟣' },
    'Intervals': { color: '#F44336', bg: '#2e1a1a', label: 'Intervals', icon: '🔴' },
    'Tempo': { color: '#FF9800', bg: '#2e1f0a', label: 'Tempo', icon: '🟠' },
    'Time Trial': { color: '#2196F3', bg: '#0a1a2e', label: 'Time Trial', icon: '🔵' },
    'Taper Intervals': { color: '#2196F3', bg: '#0a1a2e', label: 'Taper Intervals', icon: '🔵' },
    'Race': { color: '#FFD700', bg: '#2e2800', label: 'Race', icon: '🏁' },
};

// Parse "DD.MM.YYYY" -> Date
function parseDate(s) {
    const [d, m, y] = s.split('.');
    return new Date(+y, +m - 1, +d);
}

// Get week number (1-based) from date
function getWeek(dateStr) {
    const d = parseDate(dateStr);
    const msPerWeek = 7 * 24 * 3600 * 1000;
    return Math.floor((d - PLAN_START) / msPerWeek) + 1;
}

// Clean and humanize description
function cleanDesc(raw) {
    return raw
        .replace(/📲 View in the Runna app:.*?(?=\n|$)/g, '')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/a passo conversazionale \(non più veloce di [\d:]+\/km\)/g, 'easy')
        .replace(/a passo conversazionale \(o più lento!\)/g, 'easy')
        .replace(/a passo conversazionale/g, 'easy')
        .replace(/Camminata di riposo di (\d+) s/g, 'Rest $1s')
        .replace(/Camminata di riposo di (\d+) m/g, 'Rest $1min')
        .replace(/riscaldamento/gi, 'Warmup')
        .replace(/raffreddamento/gi, 'Cooldown')
        .replace(/([\d,]+(?:\.\d+)?)\/km/g, (_, p) => `@${p.replace(',', '.')}`)
        .replace(/\s+/g, ' ')
        .trim();
}

// Raw workouts: [title, type, date, km, durationRange, notes]
const RAW_WORKOUTS = [
    // Week 1
    ["11km di corsa facile", "Easy Run", "02.06.2026", "11", "55m - 1h5m", "11km easy (max @5:25)"],
    ["1 km a ritmo alternato", "Tempo", "03.06.2026", "12", "55m - 1h10m", "Warmup 2km easy\nRepeat 4x:\n  1km @4:45\n  1km @4:25\nRest 90s\nCooldown 2km easy"],
    ["11km di corsa facile", "Easy Run", "05.06.2026", "11", "55m - 1h5m", "11km easy (max @5:25)"],
    ["Lungo progressivo di 26 km", "Long Run", "07.06.2026", "26", "2h0m - 2h20m", "8.5km easy\n5.5km @5:10\n6km @4:55\n6km @4:45"],

    // Week 2
    ["12km di corsa facile", "Easy Run", "09.06.2026", "12", "1h0m - 1h10m", "12km easy (max @5:20)"],
    ["Ripetute da 1 km", "Intervals", "10.06.2026", "12", "1h0m - 1h20m", "Warmup 3km easy\nRest 90s\n8x:\n  1km @4:15 (±10s)\nRest 90s\nCooldown 1km easy"],
    ["13km di corsa facile", "Easy Run", "12.06.2026", "13", "1h0m - 1h20m", "13km easy (max @5:20)"],
    ["26km di lungo", "Long Run", "14.06.2026", "26", "2h10m - 2h30m", "26km easy"],

    // Week 3
    ["13km di corsa facile", "Easy Run", "16.06.2026", "13", "1h5m - 1h15m", "13km easy (max @5:20)"],
    ["Ripetute di corto veloce su 2 km", "Tempo", "17.06.2026", "12", "1h0m - 1h10m", "Warmup 2km easy\nRepeat 4x:\n  2km @4:25 (±10s)\nRest 120s\nCooldown 2km easy"],
    ["15km di corsa facile", "Easy Run", "19.06.2026", "15", "1h15m - 1h25m", "15km easy (max @5:20)"],
    ["Lungo progressivo a ripetute di 26 km", "Long Run", "21.06.2026", "26", "2h0m - 2h20m", "6.5km easy\n3.5km @4:55\n3.5km @4:40\n5.5km @5:05\n3.5km @4:55\n3.5km @4:40"],

    // Week 4
    ["8km di corsa facile", "Easy Run", "23.06.2026", "8", "40m - 45m", "8km easy (max @5:20)"],
    ["Tempo 4km", "Tempo", "24.06.2026", "8", "40m - 45m", "Warmup 3km easy\n4km @4:20 (±10s)\nRest 150s\nCooldown 1km easy"],
    ["11km di corsa facile", "Easy Run", "26.06.2026", "11", "55m - 1h10m", "11km easy (max @5:20)"],
    ["15km di lungo", "Long Run", "28.06.2026", "15", "1h10m - 1h30m", "15km easy"],

    // Week 5
    ["13km di corsa facile", "Easy Run", "30.06.2026", "13", "1h5m - 1h15m", "13km easy (max @5:20)"],
    ["Ripetute a piramide", "Intervals", "01.07.2026", "12", "1h0m - 1h20m", "Warmup 3.2km easy\nRest 90s\n200m @3:40, Rest 60s\n400m @3:45, Rest 90s\n800m @4:00, Rest 90s\n1.2km @4:10, Rest 120s\n1.6km @4:15, Rest 120s\n1.2km @4:10, Rest 120s\n800m @4:00, Rest 90s\n400m @3:45, Rest 90s\n200m @3:40, Rest 60s\nCooldown 2km easy"],
    ["13km di corsa facile", "Easy Run", "03.07.2026", "13", "1h5m - 1h15m", "13km easy (max @5:20)"],
    ["Lungo progressivo di 26 km", "Long Run", "05.07.2026", "26", "2h0m - 2h20m", "11km easy\n5km @5:05\n5km @4:55\n5km @4:40"],

    // Week 6
    ["14km di corsa facile", "Easy Run", "07.07.2026", "14", "1h10m - 1h20m", "14km easy (max @5:20)"],
    ["Corsa semplice 400 m", "Tempo", "08.07.2026", "10.9", "50m - 1h0m", "Warmup 3km easy\nRepeat 8x:\n  400m @4:15\n  400m @5:00\nRest 90s\nCooldown 1.5km easy"],
    ["16km di corsa facile", "Easy Run", "10.07.2026", "16", "1h20m - 1h30m", "16km easy (max @5:20)"],
    ["26km di lungo", "Long Run", "12.07.2026", "26", "2h10m - 2h20m", "26km easy"],

    // Week 7
    ["16km di corsa facile", "Easy Run", "14.07.2026", "16", "1h20m - 1h30m", "16km easy (max @5:15)"],
    ["Corto veloce su 5 km", "Tempo", "15.07.2026", "12", "55m - 1h10m", "Warmup 4km easy\n5km @4:25 (±10s)\nRest 150s\nCooldown 3km easy"],
    ["16km di corsa facile", "Easy Run", "17.07.2026", "16", "1h20m - 1h30m", "16km easy (max @5:15)"],
    ["Lungo hotspot di 26 km", "Long Run", "19.07.2026", "26", "2h10m - 2h20m", "9.5km easy\n1km @4:20\n8km easy\n1km @4:20\n6.5km easy"],

    // Week 8
    ["8km di corsa facile", "Easy Run", "21.07.2026", "8", "40m - 45m", "8km easy (max @5:15)"],
    ["Cronometro di 5 km", "Time Trial", "22.07.2026", "8", "40m - 45m", "Warmup 2km easy\nRest 180s\n5km @4:10\nRest 180s\nCooldown 1km easy"],
    ["11km di corsa facile", "Easy Run", "24.07.2026", "11", "55m - 1h0m", "11km easy (max @5:15)"],
    ["15km di lungo", "Long Run", "26.07.2026", "15", "1h10m - 1h20m", "15km easy"],

    // Week 9
    ["13km di corsa facile", "Easy Run", "28.07.2026", "13", "1h5m - 1h15m", "13km easy (max @5:15)"],
    ["Corsa semplice 300 m", "Tempo", "29.07.2026", "12.2", "55m - 1h10m", "Warmup 3km easy\nRepeat 12x:\n  300m @4:10\n  300m @5:00\nRest 90s\nCooldown 2km easy"],
    ["15km di corsa facile", "Easy Run", "31.07.2026", "15", "1h10m - 1h30m", "15km easy (max @5:15)"],
    ["Lungo a blocchi di 26 km", "Long Run", "02.08.2026", "26", "2h0m - 2h20m", "6km easy\n14km @4:50\n6km easy"],

    // Week 10
    ["15km di corsa facile", "Easy Run", "04.08.2026", "15", "1h10m - 1h30m", "15km easy (max @5:15)"],
    ["Tempo 8km", "Tempo", "05.08.2026", "14", "1h0m - 1h20m", "Warmup 3km easy\n8km @4:25 (±10s)\nRest 180s\nCooldown 3km easy"],
    ["15km di corsa facile", "Easy Run", "07.08.2026", "15", "1h10m - 1h30m", "15km easy (max @5:15)"],
    ["26km di lungo", "Long Run", "09.08.2026", "26", "2h10m - 2h20m", "26km easy"],

    // Week 11
    ["16km di corsa facile", "Easy Run", "11.08.2026", "16", "1h20m - 1h30m", "16km easy (max @5:15)"],
    ["Miglia frazionate", "Intervals", "12.08.2026", "14", "1h10m - 1h30m", "Warmup 3km easy\nRest 90s\n5x:\n  1.2km @4:05\n  Rest 120s\n  400m @3:50\n  Rest 60s\nCooldown 3km easy"],
    ["18km di corsa facile", "Easy Run", "14.08.2026", "18", "1h30m - 1h40m", "18km easy (max @5:15)"],
    ["Lungo progressivo di 26 km", "Long Run", "16.08.2026", "26", "2h0m - 2h20m", "8.5km easy\n5.5km @5:00\n6km @4:45\n6km @4:35"],

    // Week 12
    ["11km di corsa facile", "Easy Run", "18.08.2026", "11", "55m - 1h0m", "11km easy (max @5:15)"],
    ["2 km a ritmo alternato", "Tempo", "19.08.2026", "9", "40m - 45m", "Warmup 500m easy\nRepeat 2x:\n  2km @4:55\n  2km @4:15\nRest 90s\nCooldown 500m easy"],
    ["13km di corsa facile", "Easy Run", "21.08.2026", "13", "1h0m - 1h20m", "13km easy (max @5:15)"],
    ["15km di lungo", "Long Run", "23.08.2026", "15", "1h10m - 1h20m", "15km easy"],

    // Week 13
    ["15km di corsa facile", "Easy Run", "25.08.2026", "15", "1h10m - 1h20m", "15km easy (max @5:10)"],
    ["Corsa progressiva", "Tempo", "26.08.2026", "14", "1h0m - 1h10m", "Warmup 1km easy\n4km @4:45\n3km @4:35\n3km @4:25\n2km @4:15\nRest 90s\nCooldown 1km easy"],
    ["15km di corsa facile", "Easy Run", "28.08.2026", "15", "1h10m - 1h20m", "15km easy (max @5:10)"],
    ["Lungo a blocchi di 26 km", "Long Run", "30.08.2026", "26", "2h0m - 2h20m", "6km easy\n14km @4:45\n6km easy"],

    // Week 14
    ["16km di corsa facile", "Easy Run", "01.09.2026", "16", "1h20m - 1h30m", "16km easy (max @5:10)"],
    ["Ripetute da 800 m", "Intervals", "02.09.2026", "14", "1h10m - 1h30m", "Warmup 3.5km easy\nRest 90s\n10x:\n  800m @4:00 (±10s)\nRest 90s\nCooldown 2.5km easy"],
    ["18km di corsa facile", "Easy Run", "04.09.2026", "18", "1h30m - 1h40m", "18km easy (max @5:10)"],
    ["26km di lungo", "Long Run", "06.09.2026", "26", "2h10m - 2h20m", "26km easy"],

    // Week 15
    ["16km di corsa facile", "Easy Run", "08.09.2026", "16", "1h20m - 1h30m", "16km easy (max @5:10)"],
    ["Chilometri a ritmo alternato", "Tempo", "09.09.2026", "14", "1h0m - 1h10m", "Warmup 3km easy\nRepeat 5x:\n  1km @4:45\n  1km @4:05\nRest 90s\nCooldown 1km easy"],
    ["18km di corsa facile", "Easy Run", "11.09.2026", "18", "1h30m - 1h40m", "18km easy (max @5:10)"],
    ["Lungo di preparazione alla gara di 28 km", "Long Run", "13.09.2026", "28", "2h0m - 2h20m", "7km easy\n7km @4:45\n12km @4:30\n2km easy"],

    // Week 16
    ["10km di corsa facile", "Easy Run", "15.09.2026", "10", "50m - 55m", "10km easy (max @5:10)"],
    ["Cronometro di 5 miglia", "Time Trial", "16.09.2026", "9.1", "35m - 45m", "Warmup 1km easy\nRest 120s\n8.05km @4:10\nCooldown easy"],
    ["14km di corsa facile", "Easy Run", "18.09.2026", "14", "1h10m - 1h20m", "14km easy (max @5:10)"],
    ["16km di lungo", "Long Run", "20.09.2026", "16", "1h20m - 1h30m", "16km easy"],

    // Week 17
    ["15km di corsa facile", "Easy Run", "22.09.2026", "15", "1h10m - 1h20m", "15km easy (max @5:10)"],
    ["Ripetute sul miglio", "Intervals", "23.09.2026", "13.1", "1h0m - 1h20m", "Warmup 2.5km easy\nRest 90s\n6x:\n  1.6km @4:05 (±10s)\nRest 120s\nCooldown 1km easy"],
    ["15km di corsa facile", "Easy Run", "25.09.2026", "15", "1h10m - 1h20m", "15km easy (max @5:10)"],
    ["Lungo di preparazione alla gara di 30 km", "Long Run", "27.09.2026", "30", "2h20m - 2h30m", "8km easy\n14km @4:30\n8km easy"],

    // Week 18
    ["14km di corsa facile", "Easy Run", "29.09.2026", "14", "1h10m - 1h20m", "14km easy (max @5:10)"],
    ["Ripetute di corto veloce su 2 km", "Tempo", "30.09.2026", "14", "1h10m - 1h20m", "Warmup 2km easy\nRepeat 5x:\n  2km @4:10 (±10s)\nRest 120s\nCooldown 2km easy"],
    ["18km di corsa facile", "Easy Run", "02.10.2026", "18", "1h30m - 1h40m", "18km easy (max @5:10)"],
    ["32km di lungo", "Long Run", "04.10.2026", "32", "2h40m - 2h50m", "32km easy"],

    // Week 19
    ["16km di corsa facile", "Easy Run", "06.10.2026", "16", "1h20m - 1h30m", "16km easy (max @5:05)"],
    ["Ripetute di corto veloce su 5 km", "Tempo", "07.10.2026", "15", "1h10m - 1h20m", "Warmup 3km easy\nRepeat 2x:\n  5km @4:15 (±10s)\nRest 180s\nCooldown 2km easy"],
    ["17km di corsa facile", "Easy Run", "09.10.2026", "17", "1h20m - 1h30m", "17km easy (max @5:05)"],
    ["Lungo di preparazione alla gara di 34 km", "Long Run", "11.10.2026", "34", "2h30m - 2h50m", "8km easy\n8km @4:40\n17km @4:30\n1km easy"],

    // Week 20
    ["19km di corsa facile", "Easy Run", "13.10.2026", "19", "1h30m - 1h40m", "19km easy (max @5:05)"],
    ["Ripetute da 800 m", "Intervals", "14.10.2026", "14", "1h10m - 1h30m", "Warmup 3.5km easy\nRest 90s\n10x:\n  800m @3:55 (±10s)\nRest 90s\nCooldown 2.5km easy"],
    ["16km di corsa facile", "Easy Run", "16.10.2026", "16", "1h20m - 1h30m", "16km easy (max @5:05)"],
    ["Lungo di preparazione alla gara di 36 km", "Long Run", "18.10.2026", "36", "2h40m - 3h0m", "18km easy\n18km @4:30"],

    // Week 21
    ["10km di corsa facile", "Easy Run", "20.10.2026", "10", "50m - 55m", "10km easy (max @5:05)"],
    ["Corto veloce su 7 km", "Tempo", "21.10.2026", "10", "45m - 50m", "Warmup 2km easy\n7km @4:15 (±10s)\nRest 180s\nCooldown 1km easy"],
    ["18km di corsa facile", "Easy Run", "23.10.2026", "18", "1h30m - 1h40m", "18km easy (max @5:05)"],
    ["19km di lungo", "Long Run", "25.10.2026", "19", "1h30m - 1h40m", "19km easy"],

    // Week 22
    ["19km di corsa facile", "Easy Run", "27.10.2026", "19", "1h30m - 1h40m", "19km easy (max @5:05)"],
    ["Corsa progressiva", "Tempo", "28.10.2026", "15", "1h0m - 1h20m", "Warmup 1km easy\n4km @4:45\n4km @4:30\n3km @4:20\n2km @4:05\nRest 90s\nCooldown 1km easy"],
    ["17km di corsa facile", "Easy Run", "30.10.2026", "17", "1h20m - 1h30m", "17km easy (max @5:05)"],
    ["Lungo di preparazione alla gara di 38 km", "Long Run", "01.11.2026", "38", "2h50m - 3h10m", "6km easy\n10km @4:30\n6km easy\n10km @4:30\n6km easy"],

    // Week 23
    ["18km di corsa facile", "Easy Run", "03.11.2026", "18", "1h30m - 1h40m", "18km easy (max @5:05)"],
    ["Ripetute da 1 km", "Intervals", "04.11.2026", "15", "1h10m - 1h30m", "Warmup 3km easy\nRest 90s\n10x:\n  1km @4:00 (±10s)\nRest 90s\nCooldown 2km easy"],
    ["18km di corsa facile", "Easy Run", "06.11.2026", "18", "1h30m - 1h40m", "18km easy (max @5:05)"],
    ["34km di lungo", "Long Run", "08.11.2026", "34", "2h40m - 3h0m", "34km easy"],

    // Week 24
    ["14km di corsa facile", "Easy Run", "10.11.2026", "14", "1h10m - 1h20m", "14km easy (max @5:05)"],
    ["Corto veloce 4-3-2-1", "Tempo", "11.11.2026", "12", "55m - 1h10m", "Warmup 1km easy\n4km @4:15, Rest 210s\n3km @4:10, Rest 180s\n2km @4:05, Rest 120s\n1km @4:00, Rest 90s\nCooldown 1km easy"],
    ["18km di corsa facile", "Easy Run", "13.11.2026", "18", "1h30m - 1h40m", "18km easy (max @5:05)"],
    ["Lungo di preparazione alla gara di 23 km", "Long Run", "15.11.2026", "23", "1h40m - 2h0m", "7km easy\n7km @4:35\n7.5km @4:30\n1.5km easy"],

    // Week 25
    ["13km di corsa facile", "Easy Run", "17.11.2026", "13", "1h0m - 1h10m", "13km easy (max @5:05)"],
    ["2 km a ritmo alternato", "Tempo", "18.11.2026", "10", "45m - 50m", "Warmup 1km easy\nRepeat 2x:\n  2km @4:45\n  2km @4:05\nRest 90s\nCooldown 1km easy"],
    ["13km di corsa facile", "Easy Run", "20.11.2026", "13", "1h0m - 1h10m", "13km easy (max @5:05)"],
    ["14km di lungo", "Long Run", "22.11.2026", "14", "1h0m - 1h20m", "14km easy"],

    // Week 26
    ["8km di corsa facile", "Easy Run", "27.11.2026", "8", "40m - 45m", "8km easy (max @5:05)"],
    ["Ripetute a ritmo di gara sul miglio", "Taper Intervals", "25.11.2026", "9", "40m - 45m", "Warmup 2.4km easy\n1.6km @4:30 (Marathon pace)\nRest 400m easy\n1.6km @4:30\nRest 400m easy\n1.6km @4:30\nCooldown 1km easy"],
    ["Estra Firenze Marathon", "Race", "29.11.2026", "42.2", "3h6m - 3h14m", "Race 42.2km @4:25-4:35"],
];

// Build workout objects
const WORKOUTS = RAW_WORKOUTS.map((r, i) => {
    const [title, type, date, km, duration, notes] = r;
    const week = getWeek(date);
    return {
        id: i,
        title,
        type,
        date,
        dateObj: parseDate(date),
        km: parseFloat(String(km).replace(',', '.')),
        duration,
        notes,
        week: Math.max(1, Math.min(26, week)),
        config: TYPE_CONFIG[type] || TYPE_CONFIG['Easy Run'],
    };
}).sort((a, b) => a.dateObj - b.dateObj);

// Group by week
const WEEKS = {};
for (let w = 1; w <= TOTAL_WEEKS; w++) WEEKS[w] = [];
WORKOUTS.forEach(wo => {
    if (wo.week >= 1 && wo.week <= TOTAL_WEEKS) WEEKS[wo.week].push(wo);
});

// Weekly km totals
const WEEK_KM = {};
for (let w = 1; w <= TOTAL_WEEKS; w++) {
    WEEK_KM[w] = WEEKS[w].reduce((s, wo) => s + wo.km, 0);
}

const TOTAL_KM = WORKOUTS.reduce((s, wo) => s + wo.km, 0);

// Get current week number based on today's date
function getCurrentWeek() {
    const today = new Date();
    if (today < PLAN_START) return 1;
    if (today > RACE_DATE) return TOTAL_WEEKS;
    const ms = today - PLAN_START;
    return Math.min(TOTAL_WEEKS, Math.max(1, Math.floor(ms / (7 * 24 * 3600 * 1000)) + 1));
}

// Format date for display
function fmtDate(dateStr) {
    const d = parseDate(dateStr);
    return d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' });
}
