<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\KasTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class CitizenController extends Controller
{
    public function index(): Response
    {
        // Admin-only view to see all warga and their latest billing status
        $citizens = User::query()->where('role', 'warga')
            ->orderBy('name', 'asc')
            ->get()
            ->map(function ($citizen) {
                // Get payment status for May 2026 iuran_wajib
                $transaction = KasTransaction::query()->where('user_id', $citizen->id)
                    ->where('month', '2026-05')
                    ->where('type', 'iuran_wajib')
                    ->first();

                return [
                    'id' => $citizen->id,
                    'name' => $citizen->name,
                    'email' => $citizen->email,
                    'phone' => $citizen->phone,
                    'address' => $citizen->address,
                    'house_number' => $citizen->house_number,
                    'may_status' => $transaction ? $transaction->status : 'belum_bayar',
                ];
            });

        return Inertia::render('Citizens/Index', [
            'citizens' => $citizens
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'house_number' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make('password'), // default password for new residents
            'role' => 'warga',
            'phone' => $request->phone,
            'address' => $request->address,
            'house_number' => $request->house_number,
        ]);

        // Create default bill for May 2026
        KasTransaction::create([
            'user_id' => $user->id,
            'amount' => 50000,
            'month' => '2026-05',
            'type' => 'iuran_wajib',
            'status' => 'belum_bayar',
        ]);

        return redirect()->back()->with('success', 'Warga berhasil ditambahkan.');
    }

    public function update(Request $request, User $citizen): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $citizen->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'house_number' => 'nullable|string|max:20',
        ]);

        $citizen->update($request->only(['name', 'email', 'phone', 'address', 'house_number']));

        return redirect()->back()->with('success', 'Data warga berhasil diperbarui.');
    }

    public function destroy(User $citizen): RedirectResponse
    {
        $citizen->delete(Auth::id() .''. $citizen->id);
        return redirect()->back()->with('success', 'Warga berhasil dihapus.');
    }
}
