#!/usr/bin/env node

/**
 * Тестовый скрипт проверки API
 * Проверяет доступность бэкенда и правильность конфигурации фронтенда
 */

const https = require("https");
const http = require("http");
const { execSync } = require("child_process");

const API_URL = process.env.VITE_API_URL || "http://localhost:8000";
const TEST_ENDPOINTS = ["/api", "/api/projects", "/api/users/login"];

console.log("=== Тестирование конфигурации API ===\n");
console.log(`Используемый базовый URL: ${API_URL}`);
console.log("Ожидаемый домен для продакшена: https://api.novextask.ru");
console.log("Текущий IP сервера: 94.29.6.121\n");

// Проверка переменных окружения
console.log("1. Проверка переменных окружения:");
try {
  const env = require("dotenv").config({ path: ".env.production" });
  if (env.parsed && env.parsed.VITE_API_URL) {
    console.log(
      `   ✅ VITE_API_URL в .env.production: ${env.parsed.VITE_API_URL}`
    );
    if (
      env.parsed.VITE_API_URL.includes("localhost") ||
      env.parsed.VITE_API_URL.includes("127.0.0.1")
    ) {
      console.log("   ⚠️  ВНИМАНИЕ: В продакшене используется localhost!");
    }
  } else {
    console.log("   ❌ VITE_API_URL не найден в .env.production");
  }
} catch (e) {
  console.log("   ⚠️  Файл .env.production не найден");
}

// Проверка доступности бэкенда
console.log("\n2. Проверка доступности бэкенда:");

const testEndpoint = (url) => {
  return new Promise((resolve) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, (res) => {
      console.log(`   ✅ ${url} - HTTP ${res.statusCode}`);
      resolve(true);
    });
    req.on("error", (err) => {
      console.log(`   ❌ ${url} - Ошибка: ${err.message}`);
      resolve(false);
    });
    req.setTimeout(5000, () => {
      console.log(`   ❌ ${url} - Таймаут`);
      req.destroy();
      resolve(false);
    });
  });
};

(async () => {
  let allPassed = true;
  for (const endpoint of TEST_ENDPOINTS) {
    const fullUrl = `${API_URL}${endpoint}`;
    const passed = await testEndpoint(fullUrl);
    if (!passed) allPassed = false;
  }

  // Проверка CORS заголовков
  console.log("\n3. Проверка CORS заголовков:");
  const corsUrl = `${API_URL}/api`;
  const req = http.request(corsUrl, { method: "OPTIONS" }, (res) => {
    const corsHeader = res.headers["access-control-allow-origin"];
    if (corsHeader) {
      console.log(`   ✅ CORS заголовок присутствует: ${corsHeader}`);
      if (corsHeader === "*" || corsHeader.includes("novextask.ru")) {
        console.log("   ✅ Домен разрешен");
      } else {
        console.log(
          `   ⚠️  Возможно, домен novextask.ru не разрешен: ${corsHeader}`
        );
      }
    } else {
      console.log("   ⚠️  CORS заголовок отсутствует");
    }
  });
  req.on("error", () => console.log("   ❌ Не удалось проверить CORS"));
  req.end();

  // Проверка сборки фронтенда
  console.log("\n4. Проверка сборки фронтенда:");
  try {
    const buildCheck = execSync(
      'grep -r "localhost\\|127.0.0.1\\|:8000\\|:8080" frontend/dist/ 2>/dev/null | head -5',
      { encoding: "utf8" }
    );
    if (buildCheck.trim()) {
      console.log("   ⚠️  В собранных файлах найдены локальные адреса:");
      console.log(
        buildCheck
          .split("\n")
          .map((line) => `      ${line}`)
          .join("\n")
      );
    } else {
      console.log("   ✅ В собранных файлах локальные адреса не найдены");
    }
  } catch (e) {
    console.log("   ✅ Проверка пройдена (или dist отсутствует)");
  }

  // Итог
  console.log("\n=== ИТОГ ===");
  if (allPassed) {
    console.log("✅ Все основные проверки пройдены");
    console.log("Рекомендации:");
    console.log(
      "1. Убедитесь, что в Vercel добавлена переменная VITE_API_URL=https://api.novextask.ru"
    );
    console.log(
      "2. Настройте DNS запись A для api.novextask.ru на IP 94.29.6.121"
    );
    console.log("3. Перезапустите деплой в Vercel после настройки DNS");
  } else {
    console.log("❌ Есть проблемы с доступностью API");
    console.log("Рекомендации:");
    console.log("1. Проверьте, запущен ли бэкенд на сервере 94.29.6.121:8080");
    console.log("2. Проверьте настройки firewall и проброс портов");
    console.log("3. Убедитесь, что домен api.novextask.ru разрешен в CORS");
  }
})();
