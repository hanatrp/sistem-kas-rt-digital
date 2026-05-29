<?php

namespace App\Http\Controllers;

use App\Models\KasTransaction;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    public function index(): Response
    {
        // Admin gets all pending/unverified payments and full list
        // Warga gets their own transaction ledger
        $user = Auth::user();

        if ($user->isAdmin()) {
            $pendingTransactions = KasTransaction::with('user')
                ->where('status', 'pending')
                ->orderBy('created_at', 'asc')
                ->get();

            $allTransactions = KasTransaction::with(['user', 'verifiedBy'])
                ->orderBy('created_at', 'desc')
                ->get();

            return Inertia::render('Transactions/Index', [
                'pendingTransactions' => $pendingTransactions,
                'allTransactions' => $allTransactions,
            ]);
        }

        $myTransactions = KasTransaction::where('user_id', $user->id)
            ->orderBy('month', 'desc')
            ->get();

        return Inertia::render('Transactions/Index', [
            'myTransactions' => $myTransactions
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'month' => 'required|string|max:7', // YYYY-MM
            'amount' => 'required|integer|min:1',
            'type' => 'required|string|in:iuran_wajib,iuran_sosial,iuran_sukarela',
            'payment_proof' => 'required|image|max:2048', // 2MB max
            'description' => 'nullable|string|max:500',
        ]);

        $user = Auth::user();

        // Handle payment proof upload
        $path = null;
        if ($request->hasFile('payment_proof')) {
            $path = $request->file('payment_proof')->store('proofs', 'public');
        }

        // Check if there is an existing transaction for this month and update it, or create a new one
        $transaction = KasTransaction::where('user_id', $user->id)
            ->where('month', $request->month)
            ->where('type', $request->type)
            ->first();

        if ($transaction) {
            $transaction->update([
                'amount' => $request->amount,
                'status' => 'pending',
                'payment_proof' => $path,
                'description' => $request->description,
            ]);
        } else {
            KasTransaction::create([
                'user_id' => $user->id,
                'amount' => $request->amount,
                'month' => $request->month,
                'type' => $request->type,
                'status' => 'pending',
                'payment_proof' => $path,
                'description' => $request->description,
            ]);
        }

        return redirect()->back()->with('success', 'Bukti pembayaran berhasil dikirim. Menunggu verifikasi admin.');
    }

    public function verify(Request $request, KasTransaction $transaction): RedirectResponse
    {
        $request->validate([
            'action' => 'required|string|in:approve,reject',
        ]);

        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        if ($request->action === 'approve') {
            $transaction->update([
                'status' => 'lunas',
                'verified_at' => now(),
                'verified_by' => Auth::id(),
            ]);
            $msg = 'Pembayaran berhasil disetujui.';
        } else {
            // Delete file if exists
            if ($transaction->payment_proof) {
                Storage::disk('public')->delete($transaction->payment_proof);
            }
            $transaction->update([
                'status' => 'belum_bayar',
                'payment_proof' => null,
                'verified_at' => null,
                'verified_by' => null,
            ]);
            $msg = 'Pembayaran ditolak.';
        }

        return redirect()->back()->with('success', $msg);
    }
}
