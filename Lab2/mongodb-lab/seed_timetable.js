// ============================================================
// seed_timetable.js
// Загружает расписание занятий группы ИС-24-22 в MongoDB.
// Запускать ОДИН РАЗ (или повторно — старые данные будут заменены).
// Запуск: mongosh --file "путь\seed_timetable.js"
// ============================================================

const DB_NAME = 'university';
const GROUP = 'БИО-24-22';

const db = connect(`mongodb://localhost:27017/${DB_NAME}`);

function log(msg) {
  print(`[${new Date().toISOString()}] ${msg}`);
}

// --- Расписание по дням недели ---
// day: технический ключ на английском (используется скриптом для поиска "сегодня")
// dayLabel: как день называется в расписании (для красивого вывода)
const timetable = [
  {
    day: 'Monday',
    dayLabel: 'Дүйсенбі / Понедельник',
    lessons: [
      { time: '12.00-12.50', subject: 'Молекулярная биология', teacher: 'Ахметова С.К.', type: 'лекция', room: '501-Б' },
      { time: '13.05-13.55', subject: 'Молекулярная биология', teacher: 'Ахметова С.К.', type: 'лабораторная', room: '401-С' },
      { time: '15.15-16.05', subject: 'Микробиология', teacher: 'Ахметова С.К.', type: 'лабораторная', room: '404-С' },
    ],
  },
  {
    day: 'Tuesday',
    dayLabel: 'Сейсенбі / Вторник',
    lessons: [
      { time: '12.00-12.50', subject: 'Генетика', teacher: 'Ахметова С.К.', type: 'лекция', room: '501-Б' },
      { time: '13.05-13.55', subject: 'Генетика', teacher: 'Ахметова С.К.', type: 'лабораторная', room: '404-С' },
      { time: '16.10-17.00', subject: 'Биохимия', teacher: 'Сексембаева Н.С.', type: 'лабораторная', room: '510-1' },
    ],
  },
  {
    day: 'Wednesday',
    dayLabel: 'Сәрсенбі / Среда',
    lessons: [],
  },
  {
    day: 'Thursday',
    dayLabel: 'Бейсенбі / Четверг',
    lessons: [
      { time: '8.30-9.20', subject: 'Микробиология', teacher: 'Ахметова С.К.', type: 'лекция', room: '501-Б' },
      { time: '9.35-10.25', subject: 'Физиология человека', teacher: 'Казангапова Б.А.', type: 'лекция', room: '501-Б' },
      { time: '10.40-11.30', subject: 'Физиология человека', teacher: 'Казангапова Б.А.', type: 'лабораторная', room: '316-Б' },
    ],
  },
  {
    day: 'Friday',
    dayLabel: 'Жұма / Пятница',
    lessons: [
      { time: '16.20-17.10', subject: 'Экология и биоразнообразие', teacher: 'Казангапова Б.А.', type: 'лекция', room: '501-Б' },
      { time: '17.25-18.15', subject: 'Экология и биоразнообразие', teacher: 'Казангапова Б.А.', type: 'лабораторная', room: '401-С' },
    ],
  },
  {
    day: 'Saturday',
    dayLabel: 'Сенбі / Суббота',
    lessons: [],
  },
  {
    day: 'Sunday',
    dayLabel: 'Жексенбі / Воскресенье',
    lessons: [],
  },
];

try {
  // Удаляем старое расписание этой группы, чтобы не было дублей при повторном запуске
  const deleted = db.timetable.deleteMany({ group: GROUP });
  log(`Удалено старых записей: ${deleted.deletedCount}`);

  const docs = timetable.map((d) => ({ group: GROUP, ...d }));
  const result = db.timetable.insertMany(docs);
  log(`Загружено дней расписания: ${Object.keys(result.insertedIds).length}`);
  log('Готово. Расписание сохранено в university.timetable');
} catch (err) {
  log(`ОШИБКА: ${err.message}`);
  quit(1);
}

quit(0);
