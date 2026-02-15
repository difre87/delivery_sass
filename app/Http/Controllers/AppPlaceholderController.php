<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AppPlaceholderController extends Controller
{
    public function __invoke(Request $request, string $section): Response
    {
        return Inertia::render('App/Placeholder', [
            'section' => $section,
        ]);
    }
}
