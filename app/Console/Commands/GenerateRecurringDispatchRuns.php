<?php

namespace App\Console\Commands;

use App\Models\RecurringDispatchRun;
use Illuminate\Console\Command;
use Carbon\Carbon;

class GenerateRecurringDispatchRuns extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dispatch:generate-recurring {--date=today : Date pour laquelle générer les tournées (format: Y-m-d ou "today")}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Génère automatiquement les tournées récurrentes pour la date spécifiée';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dateOption = $this->option('date');
        $date = $dateOption === 'today' ? Carbon::today() : Carbon::parse($dateOption);

        $this->info("🚚 Génération des tournées récurrentes pour le {$date->format('d/m/Y')}...");
        $this->newLine();

        $recurringRuns = RecurringDispatchRun::query()
            ->with(['driver', 'vehicle', 'branch'])
            ->dueForGeneration($date)
            ->get();

        if ($recurringRuns->isEmpty()) {
            $this->warn('⚠️  Aucune tournée récurrente à générer pour cette date.');
            return Command::SUCCESS;
        }

        $this->info("📋 {$recurringRuns->count()} tournée(s) récurrente(s) trouvée(s)");
        $this->newLine();

        $generated = 0;
        $skipped = 0;
        $errors = 0;

        foreach ($recurringRuns as $recurringRun) {
            try {
                if ($recurringRun->shouldGenerateForDate($date)) {
                    $dispatchRun = $recurringRun->generateDispatchRun($date);
                    
                    if ($dispatchRun) {
                        $generated++;
                        $driverName = $recurringRun->driver ? $recurringRun->driver->name : 'Non assigné';
                        $branchName = $recurringRun->branch ? $recurringRun->branch->name : 'Aucune agence';
                        
                        $this->line("✅ <info>{$recurringRun->name}</info>");
                        $this->line("   └─ Chauffeur: {$driverName} | Agence: {$branchName}");
                    } else {
                        $skipped++;
                        $this->line("⏭️  <comment>{$recurringRun->name}</comment> (déjà générée ou conditions non remplies)");
                    }
                } else {
                    $skipped++;
                }
            } catch (\Exception $e) {
                $errors++;
                $this->error("❌ Erreur pour {$recurringRun->name}: {$e->getMessage()}");
            }
        }

        $this->newLine();
        $this->info("📊 Résumé :");
        $this->line("   ✅ Générées : {$generated}");
        $this->line("   ⏭️  Ignorées  : {$skipped}");
        
        if ($errors > 0) {
            $this->line("   ❌ Erreurs   : {$errors}");
        }

        return Command::SUCCESS;
    }
}
