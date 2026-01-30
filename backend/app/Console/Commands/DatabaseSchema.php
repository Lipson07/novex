<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DatabaseSchema extends Command {
    protected $signature = 'db:schema 
                            {--table= : Show specific table}
                            {--relationships : Show foreign key relationships}
                            {--export : Export to file}
                            {--format=text : Export format (text, json, markdown)}';

    protected $description = 'Show database schema and relationships';

    public function handle() {
        $this->showDatabaseInfo();

        if ($table = $this->option('table')) {
            $this->showTableSchema($table);
        } else {
            $this->showAllTables();
        }

        if ($this->option('relationships')) {
            $this->showRelationships();
        }

        if ($this->option('export')) {
            $this->exportSchema();
        }
    }

    private function showDatabaseInfo() {
        $dbName = config('database.connections.pgsql.database');
        $tables = DB::select("
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
        ");

        $this->info("📊 Database: <comment>{$dbName}</comment>");
        $this->info("📁 Tables: <comment>" . count($tables) . "</comment>");
        $this->line('');
    }

    private function showAllTables() {
        $tables = DB::select("
            SELECT 
                table_name as name,
                obj_description(('public.' || table_name)::regclass, 'pg_class') as comment
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        ");

        $this->info("=== All Tables ===");

        $tableData = [];
        foreach ($tables as $table) {
            $rowCount = DB::table($table->name)->count();
            $columnsCount = DB::select("
                SELECT COUNT(*) as count 
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = '{$table->name}'
            ")[0]->count;

            $tableData[] = [
                'Table' => $table->name,
                'Columns' => $columnsCount,
                'Rows' => $rowCount,
                'Comment' => $table->comment ?? '',
            ];
        }

        $this->table(['Table', 'Columns', 'Rows', 'Comment'], $tableData);
    }

    private function showTableSchema($tableName) {
        if (!Schema::hasTable($tableName)) {
            $this->error("Table '{$tableName}' does not exist!");
            return;
        }

        // Получаем колонки для PostgreSQL
        $columns = DB::select("
            SELECT 
                column_name as field,
                udt_name as type,
                is_nullable,
                column_default,
                character_maximum_length as length
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = '{$tableName}'
            ORDER BY ordinal_position
        ");

        $this->info("=== Table: <comment>{$tableName}</comment> ===");

        $columnData = [];
        foreach ($columns as $col) {
            $key = $this->getColumnKeyInfo($tableName, $col->field);

            $columnData[] = [
                'Field' => $col->field,
                'Type' => $col->type . ($col->length ? "({$col->length})" : ''),
                'Null' => $col->is_nullable == 'YES' ? 'YES' : 'NO',
                'Key' => $key,
                'Default' => $col->column_default ?? 'NULL',
            ];
        }

        $this->table(['Field', 'Type', 'Null', 'Key', 'Default'], $columnData);

        // Показать индексы для PostgreSQL
        $indexes = DB::select("
            SELECT 
                indexname,
                indexdef
            FROM pg_indexes 
            WHERE tablename = '{$tableName}'
            AND schemaname = 'public'
        ");

        if (!empty($indexes)) {
            $this->info("\n📈 Indexes:");
            $indexData = [];
            foreach ($indexes as $index) {
                $indexData[] = [
                    'Index' => $index->indexname,
                    'Definition' => $index->indexdef,
                ];
            }
            $this->table(['Index', 'Definition'], $indexData);
        }
    }

    private function getColumnKeyInfo($tableName, $columnName) {
        $keys = DB::select("
            SELECT
                tc.constraint_type
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
            WHERE tc.table_schema = 'public'
            AND tc.table_name = '{$tableName}'
            AND kcu.column_name = '{$columnName}'
            AND tc.constraint_type IN ('PRIMARY KEY', 'FOREIGN KEY', 'UNIQUE')
        ");

        $result = [];
        foreach ($keys as $key) {
            $result[] = str_replace(
                ' PRIMARY KEY',
                'PRI',
                str_replace(
                    ' FOREIGN KEY',
                    'FK',
                    str_replace(' UNIQUE', 'UNI', $key->constraint_type)
                )
            );
        }

        return implode(', ', $result);
    }

    private function showRelationships() {
        $this->info("\n🔗 Foreign Key Relationships:");

        $relationships = DB::select("
            SELECT
                tc.table_name as from_table,
                kcu.column_name as from_column,
                ccu.table_name as to_table,
                ccu.column_name as to_column,
                tc.constraint_name
            FROM information_schema.table_constraints tc
            JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage ccu
                ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY'
            AND tc.table_schema = 'public'
            ORDER BY tc.table_name, kcu.column_name
        ");

        if (empty($relationships)) {
            $this->warn('No foreign key relationships found.');
            return;
        }

        $this->table(
            ['From Table', 'From Column', '→', 'To Table', 'To Column', 'Constraint'],
            array_map(function ($rel) {
                return [
                    $rel->from_table,
                    $rel->from_column,
                    '→',
                    $rel->to_table,
                    $rel->to_column,
                    $rel->constraint_name
                ];
            }, $relationships)
        );
    }

    private function exportSchema() {
        $format = $this->option('format');
        $filename = "database_schema_" . date('Y-m-d_H-i-s') . ".{$format}";

        $tables = DB::select("
            SELECT table_name as name
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_type = 'BASE TABLE'
            ORDER BY table_name
        ");

        $schema = [
            'database' => config('database.connections.pgsql.database'),
            'exported_at' => now()->toDateTimeString(),
            'driver' => 'pgsql',
            'tables' => []
        ];

        foreach ($tables as $table) {
            $tableName = $table->name;

            $columns = DB::select("
                SELECT 
                    column_name as field,
                    udt_name as type,
                    is_nullable,
                    column_default,
                    character_maximum_length as length,
                    ordinal_position
                FROM information_schema.columns 
                WHERE table_schema = 'public' 
                AND table_name = '{$tableName}'
                ORDER BY ordinal_position
            ");

            $foreignKeys = DB::select("
                SELECT
                    kcu.column_name,
                    ccu.table_name as referenced_table,
                    ccu.column_name as referenced_column,
                    tc.constraint_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                    ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_column_usage ccu
                    ON ccu.constraint_name = tc.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY'
                AND tc.table_schema = 'public'
                AND tc.table_name = '{$tableName}'
            ");

            $schema['tables'][$tableName] = [
                'columns' => $columns,
                'foreign_keys' => $foreignKeys,
            ];
        }

        $content = match ($format) {
            'json' => json_encode($schema, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE),
            'markdown' => $this->generateMarkdown($schema),
            default => $this->generateText($schema),
        };

        file_put_contents(storage_path("app/{$filename}"), $content);
        $this->info("✅ Schema exported to: storage/app/{$filename}");
    }

    private function generateMarkdown($schema): string {
        $md = "# Database Schema: {$schema['database']}\n\n";
        $md .= "**Driver**: {$schema['driver']}\n\n";
        $md .= "**Exported**: {$schema['exported_at']}\n\n";

        foreach ($schema['tables'] as $tableName => $data) {
            $md .= "## Table: `{$tableName}`\n\n";

            $md .= "### Columns:\n";
            $md .= "| Field | Type | Null | Default |\n";
            $md .= "|-------|------|------|---------|\n";

            foreach ($data['columns'] as $col) {
                $type = $col->type . ($col->length ? "({$col->length})" : '');
                $null = $col->is_nullable == 'YES' ? 'YES' : 'NO';
                $default = $col->column_default ?? '';

                $md .= "| `{$col->field}` | `{$type}` | {$null} | {$default} |\n";
            }
            $md .= "\n";

            if (!empty($data['foreign_keys'])) {
                $md .= "### Foreign Keys:\n";
                foreach ($data['foreign_keys'] as $fk) {
                    $md .= "- `{$fk->column_name}` → `{$fk->referenced_table}`.`{$fk->referenced_column}` (`{$fk->constraint_name}`)\n";
                }
                $md .= "\n";
            }
        }

        return $md;
    }

    private function generateText($schema): string {
        $text = "DATABASE SCHEMA: {$schema['database']}\n";
        $text .= "Driver: {$schema['driver']}\n";
        $text .= "Exported: {$schema['exported_at']}\n\n";
        $text .= str_repeat("=", 60) . "\n\n";

        foreach ($schema['tables'] as $tableName => $data) {
            $text .= "TABLE: {$tableName}\n";
            $text .= str_repeat("-", 60) . "\n";

            foreach ($data['columns'] as $col) {
                $type = $col->type . ($col->length ? "({$col->length})" : '');
                $null = $col->is_nullable == 'YES' ? 'NULL' : 'NOT NULL';
                $default = $col->column_default ? " DEFAULT: {$col->column_default}" : '';

                $text .= "  {$col->field}: {$type} {$null}{$default}\n";
            }

            if (!empty($data['foreign_keys'])) {
                $text .= "\n  Foreign Keys:\n";
                foreach ($data['foreign_keys'] as $fk) {
                    $text .= "    {$fk->column_name} → {$fk->referenced_table}.{$fk->referenced_column} ({$fk->constraint_name})\n";
                }
            }

            $text .= "\n" . str_repeat("=", 60) . "\n\n";
        }

        return $text;
    }
}
