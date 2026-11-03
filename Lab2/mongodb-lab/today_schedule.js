// ============================================================
// today_schedule.js
// Показывает расписание занятий НА СЕГОДНЯ.
// Сам определяет текущий день недели — ничего вручную указывать не нужно.
// Можно запускать вручную или поставить на Планировщик каждое утро.
// Запуск: mongosh --file "путь\today_schedule.js"
// ============================================================

const DB_NAME = 'university';
const GROUP = 'БИО-24-22';

const db = connect(`mongodb://localhost:27017/${DB_NAME}`);

function log(msg) {
  print(msg);
}

// JS: getDay() возвращает 0=Воскресенье, 1=Понедельник, ..., 6=Суббота
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const today = new Date();
const todayKey = dayNames[today.getDay()];

log(`===== Расписание на сегодня (${today.toLocaleDateString('ru-RU')}) =====`);

try {
  const dayDoc = db.timetable.findOne({ group: GROUP, day: todayKey });

  if (!dayDoc) {
    log(`Расписание для группы ${GROUP} не найдено. Сначала запусти seed_timetable.js`);
    quit(1);
  }

  log(dayDoc.dayLabel);

  if (!dayDoc.lessons || dayDoc.lessons.length === 0) {
    log('Сегодня занятий нет 🎉');
  } else {
    dayDoc.lessons.forEach((l) => {
      log(`  ${l.time}  |  ${l.subject}  |  ${l.teacher}  |  ${l.type}  |  ауд. ${l.room}`);
    });
  }

  log('=========================================================');
} catch (err) {
  log(`ОШИБКА: ${err.message}`);
  quit(1);
}

quit(0);
