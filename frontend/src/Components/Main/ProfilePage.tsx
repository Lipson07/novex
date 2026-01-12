import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setUserData } from "../../store/user";
import { userService } from "../../services/userService";
import style from "../../style/Main/ProfilePage.module.scss";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface ProfilePageProps {
  onBack?: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack }) => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    status: user?.status || "",
  });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const roles = [
    { value: "lead", label: "Lead", description: "Может создавать проекты и задачи, назначать людей" },
    { value: "developer", label: "Developer", description: "Может работать с задачами и проектами" },
    { value: "designer", label: "Designer", description: "Может работать с задачами и проектами" },
    { value: "manager", label: "Manager", description: "Может управлять проектами и задачами" },
    { value: "member", label: "Member", description: "Базовый доступ к проектам" },
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        status: user.status || "",
      });
      setAvatar(user.avatar || null);
      setAvatarPreview(user.avatar || null);
    }
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Валидация размера файла (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: "Размер файла не должен превышать 5MB" });
      return;
    }

    // Валидация типа файла
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: "Выберите изображение" });
      return;
    }

    // Показываем превью
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Загружаем аватар
    setIsUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`${API_BASE_URL}/users/${user.id}/avatar`, {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const avatarUrl = data.avatar || data.user?.avatar;
        setAvatar(avatarUrl);
        setAvatarPreview(avatarUrl);
        
        // Обновляем Redux store
        dispatch(
          setUserData({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            status: user.status,
            isVerified: user.isVerified,
          })
        );

        setMessage({ type: "success", text: "Аватар успешно обновлен" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error(data.message || "Ошибка загрузки аватара");
      }
    } catch (error: any) {
      console.error("Ошибка загрузки аватара:", error);
      setMessage({
        type: "error",
        text: error.message || "Ошибка при загрузке аватара",
      });
      setAvatarPreview(avatar || null);
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      const response = await fetch(`${API_BASE_URL}/users/${user.id}/avatar`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setAvatar(null);
        setAvatarPreview(null);
        setMessage({ type: "success", text: "Аватар удален" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        throw new Error(data.message || "Ошибка удаления аватара");
      }
    } catch (error: any) {
      console.error("Ошибка удаления аватара:", error);
      setMessage({
        type: "error",
        text: error.message || "Ошибка при удалении аватара",
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Очищаем ошибку для этого поля
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно для заполнения";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен для заполнения";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Введите корректный email";
    }

    if (password) {
      if (password.length < 6) {
        newErrors.password = "Пароль должен содержать минимум 6 символов";
      }
      if (password !== confirmPassword) {
        newErrors.confirmPassword = "Пароли не совпадают";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRoleChange = (role: string) => {
    setFormData((prev) => ({
      ...prev,
      status: role,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) {
      setMessage({ type: "error", text: "Пожалуйста, исправьте ошибки в форме" });
      return;
    }

    setIsLoading(true);

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        status: formData.status,
      };

      if (password) {
        updateData.password = password;
      }

      const updatedUser = await userService.updateProfile(user.id, updateData);

      // Обновляем Redux store
      dispatch(
        setUserData({
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          password: password || user.password,
          status: updatedUser.status,
          isVerified: user.isVerified,
        })
      );

      setMessage({ type: "success", text: "Профиль успешно обновлен" });
      setPassword("");
      setConfirmPassword("");
      setErrors({});

      // Очищаем сообщение через 3 секунды
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error("Ошибка обновления профиля:", error);
      setMessage({
        type: "error",
        text: error.message || "Ошибка при обновлении профиля",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={style.profilePage}>
      <div className={style.profileHeader}>
        {onBack && (
          <button className={style.backButton} onClick={onBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 12H5M5 12L12 19M5 12L12 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Назад
          </button>
        )}
        <h1 className={style.profileTitle}>Профиль</h1>
      </div>

      <div className={style.profileContent}>
        <div className={style.profileCard}>
          <div className={style.profileAvatar}>
            <div className={style.avatarWrapper}>
              <div className={style.avatarCircle}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className={style.avatarImage} />
                ) : (
                  <span className={style.avatarInitial}>
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
              </div>
              <div className={style.onlineIndicator}></div>
              <div className={style.avatarOverlay}>
                <button
                  type="button"
                  className={style.avatarButton}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingAvatar}
                  title="Изменить аватар"
                >
                  {isUploadingAvatar ? (
                    <div className={style.avatarSpinner}></div>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M23 19C23 19.5304 22.7893 20.0391 22.4142 20.4142C22.0391 20.7893 21.5304 21 21 21H3C2.46957 21 1.96086 20.7893 1.58579 20.4142C1.21071 20.0391 1 19.5304 1 19V5C1 4.46957 1.21071 3.96086 1.58579 3.58579C1.96086 3.21071 2.46957 3 3 3H9L11 5H21C21.5304 5 22.0391 5.21071 22.4142 5.58579C22.7893 5.96086 23 6.46957 23 7V19Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                {avatarPreview && (
                  <button
                    type="button"
                    className={style.avatarRemoveButton}
                    onClick={handleRemoveAvatar}
                    disabled={isUploadingAvatar}
                    title="Удалить аватар"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className={style.avatarInput}
                disabled={isUploadingAvatar}
              />
            </div>
          </div>

          <form className={style.profileForm} onSubmit={handleSubmit}>
            <div className={style.formSection}>
              <h2 className={style.sectionTitle}>Личные данные</h2>

              <div className={style.formGroup}>
                <label htmlFor="name" className={style.label}>
                  Имя <span className={style.required}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${style.input} ${errors.name ? style.inputError : ""}`}
                  placeholder="Введите ваше имя"
                />
                {errors.name && <span className={style.errorText}>{errors.name}</span>}
              </div>

              <div className={style.formGroup}>
                <label htmlFor="email" className={style.label}>
                  Email <span className={style.required}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${style.input} ${errors.email ? style.inputError : ""}`}
                  placeholder="example@email.com"
                />
                {errors.email && <span className={style.errorText}>{errors.email}</span>}
              </div>
            </div>

            <div className={style.formSection}>
              <h2 className={style.sectionTitle}>Роль</h2>
              <p className={style.sectionDescription}>
                Выберите роль, которая определяет ваши права доступа в системе
              </p>

              <div className={style.rolesGrid}>
                {roles.map((role) => (
                  <div
                    key={role.value}
                    className={`${style.roleCard} ${
                      formData.status === role.value ? style.roleCardActive : ""
                    }`}
                    onClick={() => handleRoleChange(role.value)}
                  >
                    <div className={style.roleCardHeader}>
                      <input
                        type="radio"
                        name="status"
                        value={role.value}
                        checked={formData.status === role.value}
                        onChange={() => handleRoleChange(role.value)}
                        className={style.roleRadio}
                      />
                      <span className={style.roleLabel}>{role.label}</span>
                    </div>
                    <p className={style.roleDescription}>{role.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className={style.formSection}>
              <h2 className={style.sectionTitle}>Безопасность</h2>

              <div className={style.formGroup}>
                <label htmlFor="password" className={style.label}>
                  Новый пароль
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.password;
                        return newErrors;
                      });
                    }
                  }}
                  className={`${style.input} ${errors.password ? style.inputError : ""}`}
                  placeholder="Минимум 6 символов"
                />
                {errors.password && <span className={style.errorText}>{errors.password}</span>}
                {password && (
                  <div className={style.passwordStrength}>
                    <div
                      className={`${style.strengthBar} ${
                        password.length >= 6 ? style.strengthBarGood : style.strengthBarWeak
                      }`}
                    ></div>
                    <span className={style.strengthText}>
                      {password.length >= 6 ? "Надежный пароль" : "Слабый пароль"}
                    </span>
                  </div>
                )}
              </div>

              {password && (
                <div className={style.formGroup}>
                  <label htmlFor="confirmPassword" className={style.label}>
                    Подтвердите пароль
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.confirmPassword;
                          return newErrors;
                        });
                      }
                    }}
                    className={`${style.input} ${
                      errors.confirmPassword ? style.inputError : ""
                    } ${confirmPassword && password === confirmPassword ? style.inputSuccess : ""}`}
                    placeholder="Повторите пароль"
                  />
                  {errors.confirmPassword && (
                    <span className={style.errorText}>{errors.confirmPassword}</span>
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <span className={style.successText}>Пароли совпадают</span>
                  )}
                </div>
              )}
            </div>

            {message && (
              <div
                className={`${style.message} ${
                  message.type === "success" ? style.messageSuccess : style.messageError
                }`}
              >
                {message.text}
              </div>
            )}

            <div className={style.formActions}>
              <button
                type="submit"
                className={style.saveButton}
                disabled={isLoading}
              >
                {isLoading ? "Сохранение..." : "Сохранить изменения"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

