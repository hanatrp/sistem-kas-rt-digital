<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CitizenController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\VoteController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('login'); // Redirect home directly to login for the portal
});

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Citizens (Admin only)
    Route::get('/citizens', [CitizenController::class, 'index'])->name('citizens.index');
    Route::post('/citizens', [CitizenController::class, 'store'])->name('citizens.store');
    Route::patch('/citizens/{citizen}', [CitizenController::class, 'update'])->name('citizens.update');
    Route::delete('/citizens/{citizen}', [CitizenController::class, 'destroy'])->name('citizens.destroy');

    // Transactions (Ledger & Verifications)
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    Route::post('/transactions/{transaction}/verify', [TransactionController::class, 'verify'])->name('transactions.verify');

    // Announcements
    Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
    Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');

    // Votes
    Route::post('/votes', [VoteController::class, 'store'])->name('votes.store');
    Route::post('/votes/{vote}/cast', [VoteController::class, 'castVote'])->name('votes.cast');
    Route::post('/votes/{vote}/toggle', [VoteController::class, 'toggleStatus'])->name('votes.toggle');
});

require __DIR__.'/auth.php';

