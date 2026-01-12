/**
 * Парсит человекочитаемую строку дедлайна и возвращает объект с датой и отформатированной строкой.
 * Поддерживаемые форматы:
 * - "2 часа", "1 час", "30 минут"
 * - "1 день", "2 дня", "5 дней"
 * - "1 неделя", "2 недели", "5 недель"
 * - "1 месяц", "2 месяца", "5 месяцев"
 * Также поддерживает комбинации типа "1 день 2 часа" (пока не реализовано, но можно расширить).
 *
 * @param input Строка ввода пользователя (например, "2 дня")
 * @returns Объект { date: Date, formatted: string, isoString: string } или null при ошибке
 */
export function parseDeadline(
  input: string
): { date: Date; formatted: string; isoString: string } | null {
  if (!input || typeof input !== "string") {
    return null;
  }

  const trimmed = input.trim().toLowerCase();

  // Предопределённые опции для быстрого выбора
  const predefined: Record<string, number> = {
    "30 минут": 30 * 60 * 1000,
    "1 час": 60 * 60 * 1000,
    "2 часа": 2 * 60 * 60 * 1000,
    "1 день": 24 * 60 * 60 * 1000,
    "2 дня": 2 * 24 * 60 * 60 * 1000,
    "5 дней": 5 * 24 * 60 * 60 * 1000,
    "1 неделя": 7 * 24 * 60 * 60 * 1000,
    "2 недели": 14 * 24 * 60 * 60 * 1000,
    "5 недель": 35 * 24 * 60 * 60 * 1000,
    "1 месяц": 30 * 24 * 60 * 60 * 1000, // приблизительно 30 дней
    "2 месяца": 60 * 24 * 60 * 60 * 1000,
    "5 месяцев": 150 * 24 * 60 * 60 * 1000,
  };

  // Если точное совпадение с предопределёнными
  if (predefined[trimmed] !== undefined) {
    const now = new Date();
    const future = new Date(now.getTime() + predefined[trimmed]);
    return {
      date: future,
      formatted: formatDeadline(future),
      isoString: future.toISOString(),
    };
  }

  // Попробуем парсить общий паттерн: число + единица
  const pattern =
    /^(\d+)\s+(час|часа|часов|минут|минуты|минуту|день|дня|дней|недел|недели|неделю|недель|месяц|месяца|месяцев)$/;
  const match = trimmed.match(pattern);
  if (match) {
    const num = parseInt(match[1], 10);
    const unit = match[2];
    let multiplier = 0;

    // Определяем множитель в миллисекундах
    switch (unit) {
      case "минут":
      case "минуты":
      case "минуту":
        multiplier = 60 * 1000;
        break;
      case "час":
      case "часа":
      case "часов":
        multiplier = 60 * 60 * 1000;
        break;
      case "день":
      case "дня":
      case "дней":
        multiplier = 24 * 60 * 60 * 1000;
        break;
      case "недел":
      case "недели":
      case "неделю":
      case "недель":
        multiplier = 7 * 24 * 60 * 60 * 1000;
        break;
      case "месяц":
      case "месяца":
      case "месяцев":
        multiplier = 30 * 24 * 60 * 60 * 1000; // приблизительно
        break;
      default:
        return null;
    }

    const now = new Date();
    const future = new Date(now.getTime() + num * multiplier);
    return {
      date: future,
      formatted: formatDeadline(future),
      isoString: future.toISOString(),
    };
  }

  // Если ввод не распознан, возвращаем null
  return null;
}

/**
 * Форматирует дату дедлайна в удобочитаемую строку.
 * Пример: "через 2 дня (15 января 2026)"
 */
function formatDeadline(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(
    (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );

  let relative = "";
  if (diffDays > 0) {
    relative = `через ${diffDays} ${pluralize(
      diffDays,
      "день",
      "дня",
      "дней"
    )}`;
    if (diffHours > 0) {
      relative += ` ${diffHours} ${pluralize(
        diffHours,
        "час",
        "часа",
        "часов"
      )}`;
    }
  } else if (diffHours > 0) {
    relative = `через ${diffHours} ${pluralize(
      diffHours,
      "час",
      "часа",
      "часов"
    )}`;
  } else {
    relative = "менее часа";
  }

  const dateStr = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${relative} (${dateStr})`;
}

/**
 * Склонение существительных после числительных.
 */
function pluralize(
  count: number,
  one: string,
  two: string,
  five: string
): string {
  const n = Math.abs(count) % 100;
  const n1 = n % 10;
  if (n > 10 && n < 20) return five;
  if (n1 === 1) return one;
  if (n1 >= 2 && n1 <= 4) return two;
  return five;
}

/**
 * Форматирует дату дедлайна для отображения в интерфейсе (краткий вариант).
 * Примеры: "Сегодня", "Завтра", "Через 2 дня", "10 янв."
 */
export function formatDeadlineDisplay(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Сбрасываем время для сравнения дат
  const isToday = date.toDateString() === today.toDateString();
  const isTomorrow = date.toDateString() === tomorrow.toDateString();

  if (isToday) {
    return "Сегодня";
  }
  if (isTomorrow) {
    return "Завтра";
  }

  const diffMs = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 1 && diffDays <= 7) {
    return `Через ${diffDays} ${pluralize(diffDays, "день", "дня", "дней")}`;
  }

  // Если больше недели, показываем дату
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

/**
 * Возвращает список предопределённых опций для выбора дедлайна.
 */
export const deadlineOptions = [
  { label: "30 минут", value: "30 минут" },
  { label: "1 час", value: "1 час" },
  { label: "2 часа", value: "2 часа" },
  { label: "1 день", value: "1 день" },
  { label: "2 дня", value: "2 дня" },
  { label: "5 дней", value: "5 дней" },
  { label: "1 неделя", value: "1 неделя" },
  { label: "2 недели", value: "2 недели" },
  { label: "5 недель", value: "5 недель" },
  { label: "1 месяц", value: "1 месяц" },
  { label: "2 месяца", value: "2 месяца" },
  { label: "5 месяцев", value: "5 месяцев" },
];
