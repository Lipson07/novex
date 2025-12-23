import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, setVerificationCode, setVerified } from "../../store/user";
import emailjs from "@emailjs/browser";
import style from "../../style/Form/EmailCheck.module.scss";

interface EmailCheckProps {
  onSuccess?: () => void;
  onNotification?: (message: string, type: "success" | "error") => void;
}

function EmailCheck({ onSuccess, onNotification }: EmailCheckProps) {
  const { name, email, password, status } = useSelector(selectUser);
  const dispatch = useDispatch();
  const [conf, setConf] = useState(false);
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string>(""); // Сохраняем отправленный код
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const EMAILJS_CONFIG = {
    serviceId: "service_aqxioho",
    templateId: "template_wtb954d",
    publicKey: "Z_jLCC7KkwuPkxQkL",
  };

  const generateVerificationCode = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async (): Promise<boolean> => {
    setSending(true);

    try {
      const verificationCode = generateVerificationCode();

      // Сохраняем сгенерированный код для последующей проверки
      setGeneratedCode(verificationCode);
      dispatch(setVerificationCode(verificationCode));

      const templateParams = {
        to_name: name,
        to_email: email,
        verification_code: verificationCode,
        app_name: "Your App",
      };

      console.log("Отправка письма через EmailJS...", templateParams);

      const result = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      console.log("EmailJS результат:", result);

      if (result.status === 200) {
        onNotification?.(
          "Код подтверждения отправлен на вашу почту!",
          "success"
        );
        setIsCodeSent(true); // Разрешаем ввод кода
        return true;
      } else {
        throw new Error(`Ошибка отправки: ${result.text}`);
      }
    } catch (error: any) {
      console.error("Ошибка отправки email:", error);

      if (
        error.text?.includes("Gmail_API") ||
        error.text?.includes("insufficient authentication")
      ) {
        onNotification?.(
          "Ошибка настройки email сервиса. Пожалуйста, используйте EmailJS сервис вместо Gmail.",
          "error"
        );
      } else {
        onNotification?.(
          "Не удалось отправить код подтверждения. Проверьте настройки EmailJS.",
          "error"
        );
      }
      return false;
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    sendVerificationEmail();
  }, []);

  useEffect(() => {
    if (inputRefs.current[0] && isCodeSent) {
      inputRefs.current[0]?.focus();
    }
  }, [isCodeSent]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      console.log("Текущий введенный код:", newCode.join(""));

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (index: number, e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, ""); // Принимаем только цифры

    if (pastedData.length === 6) {
      const newCode = [...pastedData].slice(0, 6);
      setCode(newCode);
    } else {
      onNotification?.("Неверный формат кода. Ожидается 6 цифр", "error");
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");

    if (verificationCode.length !== 6) {
      onNotification?.("Пожалуйста, введите все 6 цифр кода", "error");
      return;
    }

    if (verificationCode !== generatedCode) {
      onNotification?.("Неверный код подтверждения", "error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          status: status || "user", // Устанавливаем значение по умолчанию если status не передан
          verification_code: verificationCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onNotification?.("Регистрация завершена успешно!", "success");

        dispatch(setVerified(true));

        setTimeout(() => {
          onSuccess?.();
        }, 1500);
      } else {
        if ((data.errors || data.error) && response.status === 422) {
          const errorMsg = Array.isArray(data.errors)
            ? data.errors.join(", ")
            : JSON.stringify(data.errors || data.error);
          throw new Error(errorMsg);
        }
        throw new Error(data.error || data.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Ошибка при регистрации:", error);
      onNotification?.(
        error.message || "Произошла ошибка при регистрации",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    await sendVerificationEmail();
  };

  return (
    <div className={style.container}>
      <h1>Подтверждение почты</h1>
      <p className={style.subtitle}>
        Мы отправили 6-значный код подтверждения на
        <br />
        <strong>{email}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <div className={style.codeInputs}>
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                if (el) {
                  inputRefs.current[index] = el;
                }
              }} // ИСПРАВЛЕНО
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onPaste={(e) => handlePaste(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              disabled={loading || !isCodeSent}
              className={style.codeInput}
              required
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading || code.join("").length !== 6 || !isCodeSent}
          className={style.verifyButton}
        >
          {loading ? "Регистрация..." : "Завершить регистрацию"}
        </button>
      </form>

      <div className={style.resendSection}>
        <p>Не получили код?</p>
        <button
          type="button"
          className={style.resendButton}
          onClick={handleResendCode}
          disabled={sending}
        >
          {sending ? "Отправка..." : "Отправить код повторно"}
        </button>
      </div>
    </div>
  );
}

export default EmailCheck;
