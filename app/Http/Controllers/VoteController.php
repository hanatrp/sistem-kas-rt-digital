<?php

namespace App\Http\Controllers;

use App\Models\Vote;
use App\Models\VoteResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VoteController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'ends_at' => 'nullable|date',
        ]);

        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        Vote::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => 'active',
            'ends_at' => $request->ends_at,
        ]);

        return redirect()->back()->with('success', 'Topik pemungutan suara berhasil dibuat.');
    }

    public function castVote(Request $request, Vote $vote): RedirectResponse
    {
        $request->validate([
            'option' => 'required|string|in:setuju,tidak_setuju,abstain',
        ]);

        if ($vote->status !== 'active') {
            return redirect()->back()->with('error', 'Pemungutan suara ini telah ditutup.');
        }

        // Create or update response
        VoteResponse::updateOrCreate(
            [
                'user_id' => Auth::id(),
                'vote_id' => $vote->id,
            ],
            [
                'option' => $request->option,
            ]
        );

        return redirect()->back()->with('success', 'Pilihan Anda berhasil disimpan.');
    }

    public function toggleStatus(Request $request, Vote $vote): RedirectResponse
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        $vote->update([
            'status' => $vote->status === 'active' ? 'closed' : 'active',
        ]);

        return redirect()->back()->with('success', 'Status pemungutan suara berhasil diubah.');
    }
}
