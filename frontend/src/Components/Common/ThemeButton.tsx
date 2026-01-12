import React, { useState, useEffect, useRef, KeyboardEvent } from "react";
import {
  themes,
  themeNames,
  type ThemeName,
} from "../../assets/LeftPanel/themes";
import styles from "../../style/Common/ThemeButton.module.scss";

interface ThemeButtonProps {
  /**
   * Текущая выбранная тема
   */
  currentTheme?: string;
  /**
   * Callback при изменении темы
   */
  onThemeChange?: (theme: string) => void;
  /**
   * Размер кнопки
   */
  size?: "small" | "medium" | "large";
  /**
   * Показывать ли предпросмотр цветов на кнопке
   */
  showColorPreview?: boolean;
  /**
   * Показывать ли название темы на кнопке
   */
  showThemeName?: boolean;
  /**
   * Плейсхолдер, когда тема не выбрана
   */
  placeholder?: string;
  /**
   * Дополнительные CSS классы
   */
  className?: string;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({
  currentTheme = "",
  onThemeChange,
  size = "medium",
  showColorPreview = true,
  showThemeName = true,
  placeholder = "Выберите тему",
  className = "",
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>(currentTheme);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [announcement, setAnnouncement] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const themeItemsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Синхронизация с внешним значением
  useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);

  // Получение цветов для предпросмотра
  const getThemePreviewColors = (themeName: string): string[] => {
    const theme = themes[themeName];
    if (!theme) return [];
    const colors = [
      theme["bg-primary"],
      theme["accent-primary"],
      theme["accent-secondary"],
      theme["border-primary"],
    ].filter(Boolean);
    return colors.slice(0, 4);
  };

  // Получение читаемого названия темы
  const getThemeDisplayName = (theme: string): string => {
    const nameMap: Record<string, string> = {
      "dark-plus": "Dark+",
      "light-plus": "Light+",
      "solarized-dark": "Solarized Dark",
      "solarized-light": "Solarized Light",
      "github-dark": "GitHub Dark",
      "github-light": "GitHub Light",
      "one-dark-pro": "One Dark Pro",
      "material-theme-darker": "Material Darker",
      "night-owl": "Night Owl",
      "synthwave-84": "Synthwave 84",
      "tokyo-night": "Tokyo Night",
      "catppuccin-mocha": "Catppuccin Mocha",
      "ayu-dark": "Ayu Dark",
      "gruvbox-dark": "Gruvbox Dark",
      "kimbie-dark": "Kimbie Dark",
    };
    return nameMap[theme] || theme.replace(/-/g, " ");
  };

  // Функция применения темы
  const applyTheme = (theme: string) => {
    try {
      // Удаляем существующие theme-* классы
      Array.from(document.body.classList)
        .filter(
          (c): c is string => typeof c === "string" && c.startsWith("theme-")
        )
        .forEach((c) => document.body.classList.remove(c));

      if (theme) {
        // Добавляем класс вида theme-<name>
        document.body.classList.add(`theme-${theme}`);
        document.body.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
      } else {
        document.body.removeAttribute("data-theme");
        localStorage.removeItem("theme");
      }
    } catch (e) {
      console.error("[ThemeButton] apply error", e);
    }
  };

  // Функция для объявления изменений через aria-live
  const announceThemeChange = (theme: string) => {
    if (theme) {
      const displayName = getThemeDisplayName(theme);
      setAnnouncement(`Тема изменена на ${displayName}`);
    } else {
      setAnnouncement("Тема сброшена");
    }
    
    // Очищаем объявление через 3 секунды
    setTimeout(() => setAnnouncement(""), 3000);
  };

  // Обработчик выбора темы
  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    setIsOpen(false);
    setFocusedIndex(-1);

    // Объявляем изменение темы
    announceThemeChange(theme);

    if (onThemeChange) {
      onThemeChange(theme);
    }

    // Применяем тему немедленно
    applyTheme(theme);
  };

  // Обработчик клика вне dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape as any);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape as any);
    };
  }, []);

  // Обработчик клавиатурной навигации
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev < themeNames.length - 1 ? prev + 1 : 0;
          themeItemsRef.current[next]?.focus();
          return next;
        });
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) => {
          const next = prev > 0 ? prev - 1 : themeNames.length - 1;
          themeItemsRef.current[next]?.focus();
          return next;
        });
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        themeItemsRef.current[0]?.focus();
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(themeNames.length - 1);
        themeItemsRef.current[themeNames.length - 1]?.focus();
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case "Tab":
        if (!e.shiftKey) {
          // При закрытии меню фокус должен перейти на следующий элемент
          setIsOpen(false);
        }
        break;
    }
  };

  // Определение классов в зависимости от размера
  const sizeClass = styles[`size-${size}`];
  const buttonClass = `${styles.themeButton} ${sizeClass} ${
    isOpen ? styles.open : ""
  } ${className}`.trim();

  // Рендер кнопки
  const renderButton = () => {
    const displayName = selectedTheme
      ? getThemeDisplayName(selectedTheme)
      : placeholder;
    const previewColors = selectedTheme
      ? getThemePreviewColors(selectedTheme)
      : [];

    return (
      <button
        ref={buttonRef}
        type="button"
        className={buttonClass}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="theme-button-dropdown"
        aria-label={
          selectedTheme
            ? `Тема: ${displayName}. Нажмите для выбора другой темы`
            : "Выбор темы"
        }
      >
        <div className={styles.buttonContent}>
          {showColorPreview && previewColors.length > 0 && (
            <div className={styles.colorPreview}>
              {previewColors.map((color, idx) => (
                <div
                  key={idx}
                  className={styles.colorDot}
                  style={{ backgroundColor: color }}
                  aria-hidden="true"
                />
              ))}
            </div>
          )}
          {showThemeName && (
            <span className={styles.buttonText}>
              {selectedTheme ? displayName : placeholder}
            </span>
          )}
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`}
            aria-hidden="true"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>
    );
  };

  // Рендер dropdown меню
  const renderDropdown = () => {
    if (!isOpen) return null;

    return (
      <div
        id="theme-button-dropdown"
        ref={dropdownRef}
        className={styles.dropdownMenu}
        role="menu"
        aria-label="Выбор темы"
      >
        <div className={styles.dropdownHeader}>
          <h4 className={styles.dropdownTitle}>Выбор темы</h4>
          <p className={styles.dropdownSubtitle}>
            Выберите тему интерфейса приложения
          </p>
        </div>
        <div className={styles.themeGrid}>
          {themeNames.map((theme, index) => {
            const previewColors = getThemePreviewColors(theme);
            const isSelected = selectedTheme === theme;
            const displayName = getThemeDisplayName(theme);

            return (
              <button
                key={theme}
                ref={(el) => (themeItemsRef.current[index] = el)}
                type="button"
                className={`${styles.themeOption} ${
                  isSelected ? styles.selected : ""
                }`}
                onClick={() => handleThemeSelect(theme)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleThemeSelect(theme);
                  }
                }}
                role="menuitemradio"
                aria-checked={isSelected}
                aria-label={`Тема: ${displayName}`}
                tabIndex={focusedIndex === index ? 0 : -1}
              >
                <div className={styles.themeOptionContent}>
                  <div className={styles.themeOptionPreview}>
                    {previewColors.map((color, idx) => (
                      <div
                        key={idx}
                        className={styles.themeOptionColor}
                        style={{ backgroundColor: color }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <div className={styles.themeOptionInfo}>
                    <span className={styles.themeOptionName}>
                      {displayName}
                    </span>
                    {isSelected && (
                      <span className={styles.themeOptionBadge}>Выбрано</span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className={styles.checkIcon}
                    aria-hidden="true"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
        <div className={styles.dropdownFooter}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={() => handleThemeSelect("")}
            aria-label="Сбросить тему"
          >
            Сбросить тему
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.themeButtonContainer}>
      {/* Область для объявлений скринридера */}
      <div
        className={styles.visuallyHidden}
        aria-live="polite"
        aria-atomic="true"
      >
        {announcement}
      </div>
      
      {renderButton()}
      {renderDropdown()}
    </div>
  );
};

export default ThemeButton;