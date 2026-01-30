# Показать все таблицы

php artisan db:schema

# Показать конкретную таблицу

php artisan db:schema --table=users

# Показать связи между таблицами

php artisan db:schema --relationships

# Экспорт в JSON

php artisan db:schema --export --format=json

# Экспорт в Markdown

php artisan db:schema --export --format=markdown

# Всё вместе

php artisan db:schema --table=users --relationships --export --format=markdown
