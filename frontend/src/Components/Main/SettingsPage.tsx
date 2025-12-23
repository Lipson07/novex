import React, { useState } from "react";
import styles from "../../style/Main/SimplePage.module.scss";

type SettingGroup =
  | "account"
  | "appearance"
  | "notifications"
  | "integrations"
  | "privacy"
  | "performance"
  | "accessibility"
  | "language"
  | "advanced";

type SettingCard = {
  id: number;
  title: string;
  description: string;
  badge?: string;
  tone?: "info" | "success" | "warning";
  icon?: string;
  hasToggle?: boolean;
  toggleState?: boolean;
  type?: "category" | "toggle" | "select" | "input" | "checkbox";
  options?: { value: string; label: string }[];
  inputType?: "text" | "email" | "password" | "tel" | "number" | "url";
  checkboxState?: boolean;
  value?: string;
  group: SettingGroup;
  hint?: string;
  actionLabel?: string;
  actionUrl?: string;
};

const ToggleSwitch: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}> = ({ checked, onChange, disabled }) => {
  return (
    <label className={styles.toggle}>
      <input
        type="checkbox"
        className={styles.toggleInput}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
      <span className={styles.toggleSlider} />
    </label>
  );
};

const settings: SettingCard[] = [
  // Группа: Аккаунт (account)
  {
    id: 5,
    title: "Безопасность",
    description: "Двухфакторная аутентификация и управление устройствами.",
    badge: "Активно",
    tone: "success",
    icon: "variant=5.svg",
    type: "category",
    group: "account",
  },
  {
    id: 15,
    title: "Двухфакторная аутентификация",
    description: "Требовать подтверждение входа через код из приложения.",
    hasToggle: true,
    toggleState: false,
    badge: "Рекомендуется",
    tone: "info",
    icon: "variant=15.svg",
    type: "toggle",
    group: "account",
  },
  {
    id: 38,
    title: "История входов",
    description: "Показывать последние активности в аккаунте.",
    type: "toggle",
    hasToggle: true,
    toggleState: true,
    icon: "variant=5.svg",
    group: "account",
  },
  {
    id: 11,
    title: "Удаление аккаунта",
    description: "Удалите аккаунт и все связанные с ним данные.",
    tone: "info",
    icon: "variant=11.svg",
    type: "category",
    group: "account",
  },

  // Группа: Внешний вид (appearance)
  {
    id: 17,
    title: "Показывать аватары",
    description: "Отображать аватары пользователей в чате и на доске.",
    hasToggle: true,
    toggleState: true,
    icon: "variant=17.svg",
    type: "toggle",
    group: "appearance",
  },
  {
    id: 21,
    title: "Автоматическая тема",
    description: "Следовать системным настройкам темы (светлая/тёмная).",
    hasToggle: true,
    toggleState: true,
    icon: "variant=21.svg",
    type: "toggle",
    group: "appearance",
  },
  {
    id: 22,
    title: "Плотность интерфейса",
    description: "Выберите компактный, стандартный или просторный вид.",
    icon: "variant=22.svg",
    type: "select",
    options: [
      { value: "compact", label: "Компактный" },
      { value: "standard", label: "Стандартный" },
      { value: "spacious", label: "Просторный" },
    ],
    value: "standard",
    group: "appearance",
  },
  {
    id: 39,
    title: "Цвет акцента",
    description: "Выберите основной цвет интерфейса.",
    icon: "variant=2.svg",
    type: "select",
    options: [
      { value: "blue", label: "Синий" },
      { value: "green", label: "Зеленый" },
      { value: "purple", label: "Фиолетовый" },
      { value: "orange", label: "Оранжевый" },
    ],
    value: "blue",
    group: "appearance",
  },
  {
    id: 40,
    title: "Анимации интерфейса",
    description: "Включить плавные анимации и переходы.",
    type: "toggle",
    hasToggle: true,
    toggleState: true,
    icon: "variant=21.svg",
    group: "appearance",
  },

  // Группа: Уведомления (notifications)
  {
    id: 4,
    title: "Уведомления",
    description: "Настройте, какие события отправлять в почту и мессенджеры.",
    badge: "Рекомендуется",
    tone: "info",
    icon: "variant=4.svg",
    type: "category",
    group: "notifications",
  },
  {
    id: 13,
    title: "Уведомления по email",
    description: "Получать уведомления на электронную почту.",
    hasToggle: true,
    toggleState: false,
    icon: "variant=13.svg",
    type: "toggle",
    group: "notifications",
  },
  {
    id: 14,
    title: "Push-уведомления",
    description: "Разрешить отправку push-уведомлений в браузере.",
    hasToggle: true,
    toggleState: true,
    icon: "variant=14.svg",
    type: "toggle",
    group: "notifications",
  },
  {
    id: 23,
    title: "Уведомления в браузере",
    description: "Показывать уведомления в правом нижнем углу экрана.",
    hasToggle: true,
    toggleState: true,
    icon: "variant=23.svg",
    type: "toggle",
    group: "notifications",
  },
  {
    id: 31,
    title: "Уведомления о задачах",
    description: "Получать уведомления о новых и обновленных задачах.",
    type: "checkbox",
    checkboxState: true,
    icon: "variant=4.svg",
    group: "notifications",
  },
  {
    id: 32,
    title: "Уведомления о сообщениях",
    description: "Получать уведомления о новых сообщениях в чате.",
    type: "checkbox",
    checkboxState: true,
    icon: "variant=4.svg",
    group: "notifications",
  },

  // Группа: Конфиденциальность и данные (privacy)
  {
    id: 8,
    title: "Конфиденциальность",
    description: "Настройте видимость профиля и управление данными.",
    icon: "variant=8.svg",
    type: "category",
    group: "privacy",
  },
  {
    id: 10,
    title: "Экспорт данных",
    description:
      "Скачайте архив с вашими данными или перенесите их в другой сервис.",
    icon: "variant=10.svg",
    type: "category",
    group: "privacy",
  },
  {
    id: 24,
    title: "Экспорт в PDF/CSV",
    description: "Выгружать задачи и проекты в удобных форматах.",
    icon: "variant=24.svg",
    type: "category",
    group: "privacy",
  },
  {
    id: 33,
    title: "Email для экспорта",
    description: "Укажите email для отправки экспортированных данных.",
    type: "input",
    inputType: "email",
    value: "",
    icon: "variant=10.svg",
    group: "privacy",
  },

  // Группа: Производительность (performance)
  {
    id: 16,
    title: "Автосохранение",
    description: "Автоматически сохранять изменения каждые 5 минут.",
    hasToggle: true,
    toggleState: true,
    icon: "variant=16.svg",
    type: "toggle",
    group: "performance",
  },
  {
    id: 18,
    title: "Синхронизация в реальном времени",
    description: "Обновлять данные без перезагрузки страницы.",
    hasToggle: true,
    toggleState: true,
    icon: "variant=18.svg",
    type: "toggle",
    group: "performance",
  },
  {
    id: 19,
    title: "Экспериментальные функции",
    description: "Доступ к новым функциям, которые ещё в разработке.",
    hasToggle: true,
    toggleState: false,
    badge: "Бета",
    tone: "warning",
    icon: "variant=19.svg",
    type: "toggle",
    group: "performance",
  },
  {
    id: 25,
    title: "Автоматическое обновление",
    description: "Проверять обновления приложения при запуске.",
    hasToggle: true,
    toggleState: true,
    icon: "variant=25.svg",
    type: "toggle",
    group: "performance",
  },

  // Группа: Доступность (accessibility)
  {
    id: 9,
    title: "Доступность",
    description: "Настройте параметры для улучшения доступности интерфейса.",
    icon: "variant=9.svg",
    type: "category",
    group: "accessibility",
  },
  {
    id: 45,
    title: "Высокий контраст",
    description: "Увеличить контрастность элементов интерфейса.",
    type: "checkbox",
    checkboxState: false,
    icon: "variant=9.svg",
    group: "accessibility",
  },
  {
    id: 46,
    title: "Увеличенный размер шрифта",
    description: "Увеличить базовый размер текста на 20%.",
    type: "toggle",
    hasToggle: true,
    toggleState: false,
    icon: "variant=9.svg",
    group: "accessibility",
  },
  {
    id: 47,
    title: "Озвучивание элементов",
    description: "Проговаривать названия кнопок и ссылок.",
    type: "toggle",
    hasToggle: true,
    toggleState: false,
    icon: "variant=9.svg",
    group: "accessibility",
  },

  // Группа: Язык и регион (language)
  {
    id: 3,
    title: "Язык интерфейса",
    description: "Выберите язык интерфейса.",
    icon: "variant=3.svg",
    type: "select",
    options: [
      { value: "ru", label: "Русский" },
      { value: "en", label: "English" },
    ],
    value: "ru",
    group: "language",
  },
  {
    id: 26,
    title: "Формат даты",
    description: "Выберите предпочитаемый формат отображения дат.",
    icon: "variant=26.svg",
    type: "select",
    options: [
      { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
      { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
      { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
    ],
    value: "DD/MM/YYYY",
    group: "language",
  },
  {
    id: 27,
    title: "Формат времени",
    description: "12-часовой или 24-часовой формат.",
    icon: "variant=27.svg",
    type: "select",
    options: [
      { value: "12", label: "12-часовой" },
      { value: "24", label: "24-часовой" },
    ],
    value: "24",
    group: "language",
  },
  {
    id: 48,
    title: "Часовой пояс",
    description: "Выберите ваш часовой пояс для отображения времени.",
    icon: "variant=27.svg",
    type: "select",
    options: [
      { value: "UTC+3", label: "Москва (UTC+3)" },
      { value: "UTC+1", label: "Лондон (UTC+1)" },
      { value: "UTC-5", label: "Нью-Йорк (UTC-5)" },
      { value: "UTC+9", label: "Токио (UTC+9)" },
    ],
    value: "UTC+3",
    group: "language",
  },

  // Группа: Расширенные настройки (advanced)
  {
    id: 28,
    title: "Клавиатурные сокращения",
    description: "Настройка горячих клавиш для быстрых действий.",
    icon: "variant=28.svg",
    type: "category",
    group: "advanced",
  },
  {
    id: 49,
    title: "Включить горячие клавиши",
    description: "Активировать сочетания клавиш для навигации.",
    type: "toggle",
    hasToggle: true,
    toggleState: true,
    icon: "variant=28.svg",
    group: "advanced",
  },
  {
    id: 29,
    title: "Настройки AI-ассистента",
    description: "Управление поведением и подсказками AI.",
    icon: "variant=29.svg",
    type: "category",
    group: "advanced",
  },
  {
    id: 50,
    title: "Модель AI",
    description: "Выберите модель искусственного интеллекта.",
    type: "select",
    options: [
      { value: "gpt-4", label: "GPT-4" },
      { value: "claude-3", label: "Claude 3" },
      { value: "gemini", label: "Gemini Pro" },
    ],
    value: "gpt-4",
    icon: "variant=29.svg",
    group: "advanced",
  },
  {
    id: 51,
    title: "Креативность",
    description: "Уровень креативности ответов (температура).",
    type: "select",
    options: [
      { value: "low", label: "Низкая" },
      { value: "medium", label: "Средняя" },
      { value: "high", label: "Высокая" },
    ],
    value: "medium",
    icon: "variant=29.svg",
    group: "advanced",
  },
  {
    id: 30,
    title: "Настройки чата",
    description: "Звуковые уведомления, показ онлайн-статуса.",
    icon: "variant=30.svg",
    type: "category",
    group: "advanced",
  },
  {
    id: 52,
    title: "Звуковые уведомления",
    description: "Воспроизводить звук при новом сообщении.",
    type: "toggle",
    hasToggle: true,
    toggleState: true,
    icon: "variant=30.svg",
    group: "advanced",
  },
  {
    id: 53,
    title: "Тема чата",
    description: "Внешний вид окна чата.",
    type: "select",
    options: [
      { value: "light", label: "Светлая" },
      { value: "dark", label: "Тёмная" },
      { value: "auto", label: "Авто" },
    ],
    value: "auto",
    icon: "variant=30.svg",
    group: "advanced",
  },
];

const groupLabels: Record<SettingGroup, string> = {
  account: "Аккаунт",
  appearance: "Внешний вид",
  notifications: "Уведомления",
  integrations: "Интеграции",
  privacy: "Конфиденциальность и данные",
  performance: "Производительность",
  accessibility: "Доступность",
  language: "Язык и регион",
  advanced: "Расширенные настройки",
};

const groupOrder: SettingGroup[] = [
  "account",
  "appearance",
  "notifications",
  "integrations",
  "privacy",
  "performance",
  "accessibility",
  "language",
  "advanced",
];

const SettingsPage: React.FC = () => {
  const [activeGroup, setActiveGroup] = useState<SettingGroup>("account");
  const [toggleStates, setToggleStates] = useState<Record<number, boolean>>(
    () => {
      const initial: Record<number, boolean> = {};
      settings.forEach((setting) => {
        if (setting.hasToggle) {
          initial[setting.id] = setting.toggleState ?? false;
        }
      });
      return initial;
    }
  );
  const [selectValues, setSelectValues] = useState<Record<number, string>>(
    () => {
      const initial: Record<number, string> = {};
      settings.forEach((setting) => {
        if (
          setting.type === "select" &&
          setting.options &&
          setting.options.length > 0
        ) {
          initial[setting.id] = setting.value ?? setting.options[0].value;
        }
      });
      return initial;
    }
  );
  const [inputValues, setInputValues] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    settings.forEach((setting) => {
      if (setting.type === "input") {
        initial[setting.id] = setting.value ?? "";
      }
    });
    return initial;
  });
  const [checkboxStates, setCheckboxStates] = useState<Record<number, boolean>>(
    () => {
      const initial: Record<number, boolean> = {};
      settings.forEach((setting) => {
        if (setting.type === "checkbox") {
          initial[setting.id] = setting.checkboxState ?? false;
        }
      });
      return initial;
    }
  );

  const getBadgeClass = (tone?: SettingCard["tone"]) => {
    if (tone === "success") return `${styles.badge} ${styles.badgeSuccess}`;
    if (tone === "info") return `${styles.badge} ${styles.badgeInfo}`;
    if (tone === "warning") return `${styles.badge} ${styles.badgeWarning}`;
    return styles.badge;
  };

  const handleToggleChange = (id: number, checked: boolean) => {
    setToggleStates((prev) => ({ ...prev, [id]: checked }));
  };

  const handleSelectChange = (id: number, value: string) => {
    setSelectValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleInputChange = (id: number, value: string) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setCheckboxStates((prev) => ({ ...prev, [id]: checked }));
  };

  // Группировка настроек по группам
  const groupedSettings = settings.reduce((acc, setting) => {
    if (!acc[setting.group]) {
      acc[setting.group] = [];
    }
    acc[setting.group].push(setting);
    return acc;
  }, {} as Record<SettingGroup, SettingCard[]>);

  // Фильтруем настройки по активной группе
  const activeSettings = groupedSettings[activeGroup] || [];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Настройки</h1>
        <p className={styles.pageSubtitle}>
          Управляйте личными настройками, интеграциями и безопасностью учетной
          записи.
        </p>
      </div>

      {/* Вкладки категорий */}
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {groupOrder.map((group) => (
            <button
              key={group}
              className={`${styles.tab} ${
                activeGroup === group ? styles.tabActive : ""
              }`}
              onClick={() => setActiveGroup(group)}
            >
              {groupLabels[group]}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.settingsList}>
        <div className={styles.settingsGroup}>
          <h2 className={styles.groupTitle}>{groupLabels[activeGroup]}</h2>
          <div className={styles.groupContent}>
            {activeSettings.map((setting) => {
              if (setting.type === "category") {
                return (
                  <div key={setting.id} className={styles.card}>
                    <h3 className={styles.cardTitle}>
                      {setting.icon && (
                        <img
                          src={`/src/assets/icons/${setting.icon}`}
                          alt=""
                          className={styles.cardIcon}
                        />
                      )}
                      {setting.title}
                    </h3>
                    <p className={styles.cardText}>{setting.description}</p>
                    {setting.hint && (
                      <p className={styles.cardHint}>{setting.hint}</p>
                    )}
                    <div className={styles.metaRow}>
                      {setting.badge && (
                        <span className={getBadgeClass(setting.tone)}>
                          {setting.badge}
                        </span>
                      )}
                      {setting.actionLabel && (
                        <button
                          className={styles.actionButton}
                          onClick={() => {
                            if (setting.actionUrl) {
                              window.location.href = setting.actionUrl;
                            }
                          }}
                        >
                          {setting.actionLabel}
                        </button>
                      )}
                    </div>
                  </div>
                );
              } else if (setting.type === "toggle") {
                return (
                  <div key={setting.id} className={styles.settingItem}>
                    <div className={styles.settingItemContent}>
                      <h3 className={styles.settingItemTitle}>
                        {setting.icon && (
                          <img
                            src={`/src/assets/icons/${setting.icon}`}
                            alt=""
                            className={styles.settingItemIcon}
                          />
                        )}
                        {setting.title}
                      </h3>
                      <p className={styles.settingItemDescription}>
                        {setting.description}
                      </p>
                      <div className={styles.settingItemMeta}>
                        {setting.badge && (
                          <span className={getBadgeClass(setting.tone)}>
                            {setting.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    {setting.hasToggle && (
                      <ToggleSwitch
                        checked={toggleStates[setting.id] ?? false}
                        onChange={(checked) =>
                          handleToggleChange(setting.id, checked)
                        }
                      />
                    )}
                  </div>
                );
              } else if (setting.type === "select") {
                return (
                  <div key={setting.id} className={styles.settingItem}>
                    <div className={styles.settingItemContent}>
                      <h3 className={styles.settingItemTitle}>
                        {setting.icon && (
                          <img
                            src={`/src/assets/icons/${setting.icon}`}
                            alt=""
                            className={styles.settingItemIcon}
                          />
                        )}
                        {setting.title}
                      </h3>
                      <p className={styles.settingItemDescription}>
                        {setting.description}
                      </p>
                      <div className={styles.settingItemMeta}>
                        {setting.badge && (
                          <span className={getBadgeClass(setting.tone)}>
                            {setting.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <select
                      value={selectValues[setting.id] ?? ""}
                      onChange={(e) =>
                        handleSelectChange(setting.id, e.target.value)
                      }
                      className={styles.select}
                    >
                      {setting.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                );
              } else if (setting.type === "input") {
                return (
                  <div key={setting.id} className={styles.settingItem}>
                    <div className={styles.settingItemContent}>
                      <h3 className={styles.settingItemTitle}>
                        {setting.icon && (
                          <img
                            src={`/src/assets/icons/${setting.icon}`}
                            alt=""
                            className={styles.settingItemIcon}
                          />
                        )}
                        {setting.title}
                      </h3>
                      <p className={styles.settingItemDescription}>
                        {setting.description}
                      </p>
                      <div className={styles.settingItemMeta}>
                        {setting.badge && (
                          <span className={getBadgeClass(setting.tone)}>
                            {setting.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <input
                      type={setting.inputType || "text"}
                      value={inputValues[setting.id] ?? ""}
                      onChange={(e) =>
                        handleInputChange(setting.id, e.target.value)
                      }
                      className={styles.input}
                    />
                  </div>
                );
              } else if (setting.type === "checkbox") {
                return (
                  <div key={setting.id} className={styles.settingItem}>
                    <div className={styles.settingItemContent}>
                      <h3 className={styles.settingItemTitle}>
                        {setting.icon && (
                          <img
                            src={`/src/assets/icons/${setting.icon}`}
                            alt=""
                            className={styles.settingItemIcon}
                          />
                        )}
                        {setting.title}
                      </h3>
                      <p className={styles.settingItemDescription}>
                        {setting.description}
                      </p>
                      <div className={styles.settingItemMeta}>
                        {setting.badge && (
                          <span className={getBadgeClass(setting.tone)}>
                            {setting.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={checkboxStates[setting.id] ?? false}
                      onChange={(checked) =>
                        handleCheckboxChange(setting.id, checked)
                      }
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
