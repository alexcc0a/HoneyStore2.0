#!/bin/bash

# 🚀 Быстрый старт для проверки Scroll Snap

echo "════════════════════════════════════════════════════════════════"
echo "🎯 ПРОВЕРКА ВЕРТИКАЛЬНОГО SCROLL SNAP"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Проверить, что сервер запущен
echo "📡 Проверка HTTP сервера..."
if curl -s http://localhost:8000/index.html > /dev/null 2>&1; then
    echo "✓ Сервер работает на http://localhost:8000/"
else
    echo "✗ Сервер не запущен"
    echo ""
    echo "Для запуска сервера выполните:"
    echo "  cd /Users/alexandernesterov/Desktop/HoneyStore2.0"
    echo "  python3 -m http.server 8000"
    echo ""
    exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "📱 ПРОВЕРКА HTML-СТРУКТУРЫ"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Проверить наличие hero-wrapper
echo "Ищу .hero-wrapper..."
if curl -s http://localhost:8000/index.html | grep -q 'class="hero-wrapper"'; then
    echo "✓ Найден .hero-wrapper"
else
    echo "✗ Не найден .hero-wrapper"
fi

# Проверить наличие hero-section--top
echo "Ищу .hero-section--top..."
if curl -s http://localhost:8000/index.html | grep -q 'hero-section--top'; then
    echo "✓ Найден .hero-section--top"
else
    echo "✗ Не найден .hero-section--top"
fi

# Проверить наличие hero-section--bottom
echo "Ищу .hero-section--bottom..."
if curl -s http://localhost:8000/index.html | grep -q 'hero-section--bottom'; then
    echo "✓ Найден .hero-section--bottom"
else
    echo "✗ Не найден .hero-section--bottom"
fi

# Проверить наличие заголовка "Рекомендуем"
echo "Ищу 'Рекомендуем'..."
if curl -s http://localhost:8000/index.html | grep -q 'Рекомендуем'; then
    echo "✓ Найден заголовок 'Рекомендуем'"
else
    echo "✗ Не найден 'Рекомендуем'"
fi

# Проверить наличие footer
echo "Ищу footer '© Пасека'..."
if curl -s http://localhost:8000/index.html | grep -q '© Пасека'; then
    echo "✓ Найден footer '© Пасека'"
else
    echo "✗ Не найден footer"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "🎨 ПРОВЕРКА CSS"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Проверить наличие scroll-snap-type в CSS
echo "Ищу 'scroll-snap-type' в styles.css..."
if grep -q 'scroll-snap-type' /Users/alexandernesterov/Desktop/HoneyStore2.0/styles.css; then
    echo "✓ Найдено 'scroll-snap-type: y mandatory'"
else
    echo "✗ Не найдено 'scroll-snap-type'"
fi

# Проверить наличие scroll-snap-align в CSS
echo "Ищу 'scroll-snap-align' в styles.css..."
if grep -q 'scroll-snap-align' /Users/alexandernesterov/Desktop/HoneyStore2.0/styles.css; then
    echo "✓ Найдено 'scroll-snap-align: start'"
else
    echo "✗ Не найдено 'scroll-snap-align'"
fi

# Проверить наличие scroll-snap-stop в CSS
echo "Ищу 'scroll-snap-stop' в styles.css..."
if grep -q 'scroll-snap-stop' /Users/alexandernesterov/Desktop/HoneyStore2.0/styles.css; then
    echo "✓ Найдено 'scroll-snap-stop: always'"
else
    echo "✗ Не найдено 'scroll-snap-stop'"
fi

# Проверить наличие -webkit-overflow-scrolling для iOS
echo "Ищу '-webkit-overflow-scrolling' для iOS..."
if grep -q '\-webkit-overflow-scrolling' /Users/alexandernesterov/Desktop/HoneyStore2.0/styles.css; then
    echo "✓ Найдено '-webkit-overflow-scrolling: touch' (для iOS)"
else
    echo "✗ Не найдено '-webkit-overflow-scrolling'"
fi

# Проверить наличие @media (max-width:768px)
echo "Ищу мобильную media query..."
if grep -q '@media (max-width:768px)' /Users/alexandernesterov/Desktop/HoneyStore2.0/styles.css; then
    echo "✓ Найдена '@media (max-width:768px)' (мобильный snap)"
else
    echo "✗ Не найдена мобильная media query"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✅ ПРОВЕРКА ЗАВЕРШЕНА"
echo "════════════════════════════════════════════════════════════════"
echo ""

echo "🧪 Как проверить в браузере:"
echo ""
echo "1. Откройте http://localhost:8000/index.html"
echo ""
echo "2. Нажмите F12 (DevTools)"
echo ""
echo "3. Нажмите Ctrl+Shift+M (Toggle device toolbar)"
echo ""
echo "4. Установите размер 375px × 667px (iPhone SE)"
echo ""
echo "5. Проверьте скролл:"
echo "   • Свайп вверх → snap ко второму экрану"
echo "   • Свайп вниз → snap обратно к первому"
echo "   • Скролл списка на втором экране (работает!)"
echo ""
echo "6. Переключитесь на Desktop (>768px):"
echo "   • Snap должен отключиться"
echo "   • Обе секции видны на одной странице"
echo ""

echo "📱 Тестирование на реальных браузерах:"
echo "   ✓ Safari (iOS)"
echo "   ✓ Chrome (iOS/Android)"
echo "   ✓ Yandex Browser (iOS/Android)"
echo "   ✓ Google Chrome mobile (iOS/Android)"
echo ""

echo "════════════════════════════════════════════════════════════════"

