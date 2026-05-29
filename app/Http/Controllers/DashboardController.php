<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\KasTransaction;
use App\Models\Announcement;
use App\Models\Vote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $user = Auth::user();

        if ($user->isAdmin()) {
            return $this->adminDashboard();
        }

        return $this->wargaDashboard($user);
    }

    private function adminDashboard(): Response
    {
        // Total Treasury (only verified/lunas transactions)
        $totalBalance = KasTransaction::query()->where('status', 'lunas')->sum('amount');

        // Verification Queue Count
        $pendingCount = KasTransaction::query()->where('status', 'pending')->count();

        // Total Citizens
        $residentCount = User::query()->where('role', 'warga')->count();

        // Recent transactions
        $transactions = KasTransaction::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        // Monthly Cash Flow Aggregation
        $cashFlowData = KasTransaction::query()->where('status', 'lunas')
            ->selectRaw("strftime('%Y-%m', created_at) as month_label, SUM(amount) as total")
            ->groupBy('month_label')
            ->orderBy('month_label', 'desc')
            ->get();

        // Announcements
        $announcements = Announcement::with('author')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Dashboard', [
            'role' => 'admin',
            'stats' => [
                'totalBalance' => $totalBalance,
                'pendingCount' => $pendingCount,
                'residentCount' => $residentCount,
            ],
            'transactions' => $transactions,
            'cashFlowData' => $cashFlowData,
            'announcements' => $announcements,
        ]);
    }

    private function wargaDashboard($user): Response
    {
        // Warga's own transactions
        $transactions = KasTransaction::query()->where('user_id', $user->id)
            ->orderBy('month', 'desc')
            ->get();

        // Determine bills / payments due
        // For simplicity: check status for standard monthly dues (e.g. May 2026 iuran_wajib)
        $mayBill = KasTransaction::query()->where('user_id', $user->id)
            ->where('month', '2026-05')
            ->where('type', 'iuran_wajib')
            ->first();

        $mayStatus = $mayBill ? $mayBill->status : 'belum_bayar';
        $mayAmount = 50000;

        // Announcements
        $announcements = Announcement::with('author')
            ->orderBy('created_at', 'desc')
            ->get();

        // Active Votes with Resident's selection
        $votes = Vote::with(['responses' => function ($query) use ($user) {
            $query->where('user_id', $user->id);
        }])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($vote) {
            $userResponse = $vote->responses->first();
            
            // Calculate totals for active or closed vote charts
            $allResponses = \App\Models\VoteResponse::query()->where('vote_id', $vote->id)->get();
            $setuju = $allResponses->where('option', 'setuju')->count();
            $tidakSetuju = $allResponses->where('option', 'tidak_setuju')->count();
            $abstain = $allResponses->where('option', 'abstain')->count();

            return [
                'id' => $vote->id,
                'title' => $vote->title,
                'description' => $vote->description,
                'status' => $vote->status,
                'ends_at' => $vote->ends_at,
                'voted_option' => $userResponse ? $userResponse->option : null,
                'stats' => [
                    'setuju' => $setuju,
                    'tidak_setuju' => $tidakSetuju,
                    'abstain' => $abstain,
                    'total' => $allResponses->count()
                ]
            ];
        });

        return Inertia::render('Dashboard', [
            'role' => 'warga',
            'userBills' => [
                'month' => 'Mei 2026',
                'monthCode' => '2026-05',
                'amount' => $mayAmount,
                'status' => $mayStatus,
            ],
            'transactions' => $transactions,
            'announcements' => $announcements,
            'votes' => $votes,
        ]);
    }
}
