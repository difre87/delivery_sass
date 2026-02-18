<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    /**
     * Log an activity.
     */
    public static function logActivity(
        string $action,
        string $module,
        ?string $description = null,
        $subject = null,
        ?array $properties = null
    ): void {
        $user = Auth::user();
        
        if (!$user || !$user->current_company_id) {
            return;
        }

        ActivityLog::create([
            'user_id' => $user->id,
            'company_id' => $user->current_company_id,
            'branch_id' => $user->current_branch_id,
            'action' => $action,
            'module' => $module,
            'subject_type' => $subject ? get_class($subject) : null,
            'subject_id' => $subject?->id,
            'description' => $description,
            'properties' => $properties,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Log creation.
     */
    public static function logCreated(string $module, $subject, ?string $description = null): void
    {
        static::logActivity(
            'created',
            $module,
            $description ?? "Création d'un(e) {$module}",
            $subject,
            ['attributes' => $subject->getAttributes()]
        );
    }

    /**
     * Log update.
     */
    public static function logUpdated(string $module, $subject, array $oldValues, array $newValues, ?string $description = null): void
    {
        static::logActivity(
            'updated',
            $module,
            $description ?? "Modification d'un(e) {$module}",
            $subject,
            [
                'old' => $oldValues,
                'new' => $newValues,
            ]
        );
    }

    /**
     * Log deletion.
     */
    public static function logDeleted(string $module, $subject, ?string $description = null): void
    {
        static::logActivity(
            'deleted',
            $module,
            $description ?? "Suppression d'un(e) {$module}",
            $subject,
            ['attributes' => $subject->getAttributes()]
        );
    }

    /**
     * Log view/access.
     */
    public static function logViewed(string $module, $subject = null, ?string $description = null): void
    {
        static::logActivity(
            'viewed',
            $module,
            $description ?? "Consultation {$module}",
            $subject
        );
    }

    /**
     * Log export.
     */
    public static function logExported(string $module, ?string $description = null, ?array $properties = null): void
    {
        static::logActivity(
            'exported',
            $module,
            $description ?? "Export {$module}",
            null,
            $properties
        );
    }

    /**
     * Log custom action.
     */
    public static function logCustomAction(string $action, string $module, string $description, $subject = null, ?array $properties = null): void
    {
        static::logActivity(
            $action,
            $module,
            $description,
            $subject,
            $properties
        );
    }
}
