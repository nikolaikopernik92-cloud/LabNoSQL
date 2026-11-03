// ============================================================
// week_schedule.js
// Показывает расписание на несколько дней ВПЕРЁД, начиная с сегодня.
// Сколько дней показать — меняешь в переменной DAYS_TO_SHOW ниже.
// Запуск: mongosh --file "путь\week_schedule.js"
// ============================================================

const DB_NAME = 'university';
const GROUP = 'БИО-24-22';

// --- Сколько дней показать вперёд (включая сегодня) ---
// Поставь 3, если нужно на 3 дня. Поставь 7 — вся неделя.
const DAYS_TO_SHOW = 7;

const db = connect(`mongodb://localhost:27017/${DB_NAME}`);

function log(msg) {
  print(msg);
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

try {
  log(`\n===== Расписание на ближайшие ${DAYS_TO_SHOW} дн. (группа ${GROUP}) =====\n`);

  const today = new Date();

  for (let i = 0; i < DAYS_TO_SHOW; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dayKey = dayNames[d.getDay()];

    const dayDoc = db.timetable.findOne({ group: GROUP, day: dayKey });

    const dateLabel = d.toLocaleDateString('ru-RU');
    const heading = i === 0 ? `Сегодня, ${dateLabel}` : `${dateLabel}`;

    if (!dayDoc) {
      log(`--- ${heading}: расписание не найдено ---\n`);
      continue;
    }

    log(`--- ${heading} — ${dayDoc.dayLabel} ---`);

    if (!dayDoc.lessons || dayDoc.lessons.length === 0) {
      log('  Занятий нет 🎉');
    } else {
      dayDoc.lessons.forEach((l) => {
        log(`  ${l.time}  |  ${l.subject}  |  ${l.teacher}  |  ${l.type}  |  ауд. ${l.room}`);
      });
    }
    log('');
  }

  log('=========================================================');
} catch (err) {
  log(`ОШИБКА: ${err.message}`);
  quit(1);
}

quit(0);
