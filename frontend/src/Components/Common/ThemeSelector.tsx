import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  themes,
  themeNames,
  type ThemeName,
} from "../../assets/LeftPanel/themes";
import { selectTheme, setTheme } from "../../store/theme";
import styles from "../../style/Common/ThemeSelector.module.scss";

interface ThemeSelectorProps {
  /**
   * Текущая выбранная тема
   */
  currentTheme?: string;
  /**
   * Callback при изменении темы
   */
  onThemeChange?: (theme: string) => void;
  /**
   * Показывать ли предпросмотр цветов
   */
  showColorPreview?: boolean;
  /**
   * Размер компонента
   */
  size?: "small" | "medium" | "large";
  /**
   * Стиль отображения
   */
  variant?: "button" | "dropdown" | "inline";
  /**
   * Плейсхолдер, когда тема не выбрана
   */
  placeholder?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme = "",
  onThemeChange,
  showColorPreview = true,
  size = "medium",
  variant = "dropdown",
  placeholder = "Выберите тему",
}) => {
  const selectedTheme = useSelector(selectTheme);
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Синхронизация с внешним значением (если пропс currentTheme передан)
  useEffect(() => {
    if (currentTheme && currentTheme !== selectedTheme) {
      dispatch(setTheme(currentTheme as ThemeName | ""));
    }
  }, [currentTheme, dispatch, selectedTheme]);

  // Обработчик выбора темы
  const handleThemeSelect = (theme: string) => {
    dispatch(setTheme(theme as ThemeName | ""));
    setIsOpen(false);

    if (onThemeChange) {
      onThemeChange(theme);
    }
  };

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

  // Обработчик клика вне dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // Определение классов в зависимости от размера и варианта
  const sizeClass = styles[`size-${size}`];
  const variantClass = styles[`variant-${variant}`];
  const buttonClass = `${
    styles.themeSelectorButton
  } ${sizeClass} ${variantClass} ${isOpen ? styles.open : ""}`;

  // Рендер кнопки/триггера
  const renderTrigger = () => {
    const displayName = selectedTheme
      ? getThemeDisplayName(selectedTheme)
      : placeholder;

    if (variant === "inline") {
      return (
        <div
          className={styles.inlineTrigger}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={styles.inlineLabel}>Тема:</span>
          <span className={styles.inlineValue}>
            {selectedTheme ? (
              <>
                {showColorPreview && (
                  <div className={styles.inlineColorPreview}>
                    {getThemePreviewColors(selectedTheme).map((color, idx) => (
                      <div
                        key={idx}
                        className={styles.inlineColorDot}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                )}
                {displayName}
              </>
            ) : (
              <span className={styles.placeholder}>{placeholder}</span>
            )}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      );
    }

    // Вариант button или dropdown
    return (
      <button
        type="button"
        className={buttonClass}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={styles.buttonContent}>
          {selectedTheme && showColorPreview && (
            <div className={styles.buttonColorPreview}>
              {getThemePreviewColors(selectedTheme).map((color, idx) => (
                <div
                  key={idx}
                  className={styles.buttonColorDot}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}
          <span className={styles.buttonText}>
            {selectedTheme ? displayName : placeholder}
          </span>
        </div>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    );
  };

  // Рендер dropdown меню
  const renderDropdown = () => {
    if (!isOpen) return null;

    return (
      <div className={styles.dropdownMenu} role="menu">
        <div className={styles.dropdownHeader}>
          <h4 className={styles.dropdownTitle}>Выбор темы</h4>
          <p className={styles.dropdownSubtitle}>
            Выберите тему интерфейса приложения
          </p>
        </div>
        <div className={styles.themeList}>
          {themeNames.map((theme) => {
            const previewColors = getThemePreviewColors(theme);
            const isSelected = selectedTheme === theme;

            return (
              <button
                key={theme}
                type="button"
                className={`${styles.themeItem} ${
                  isSelected ? styles.themeItemSelected : ""
                }`}
                onClick={() => handleThemeSelect(theme)}
                aria-selected={isSelected}
              >
                <div className={styles.themeItemContent}>
                  <div className={styles.themeItemInfo}>
                    <span className={styles.themeItemName}>
                      {getThemeDisplayName(theme)}
                    </span>
                    {isSelected && (
                      <span className={styles.themeItemBadge}>Выбрано</span>
                    )}
                  </div>
                  {showColorPreview && previewColors.length > 0 && (
                    <div className={styles.themeItemColors}>
                      {previewColors.map((color, idx) => (
                        <div
                          key={idx}
                          className={styles.themeItemColor}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  )}
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
          >
            Сбросить тему
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.themeSelector} ref={dropdownRef}>
      {renderTrigger()}
      {renderDropdown()}
    </div>
  );
};

export default ThemeSelector;
