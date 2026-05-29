<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        Announcement::create([
            'title' => $request->input('title'),
            'content' => $request->input('content'),
            'author_id' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Pengumuman berhasil diterbitkan.');
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        if (!Auth::user()->isAdmin()) {
            abort(403);
        }

        $announcement->delete(Auth::id());

        return redirect()->back()->with('success', 'Pengumuman berhasil dihapus.');
    }
}
