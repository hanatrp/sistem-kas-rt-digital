<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\KasTransaction;
use App\Models\Announcement;
use App\Models\Vote;
use App\Models\VoteResponse;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Users (Admin & Warga)
        $admin = User::create([
            'name' => 'Pak RT (Admin)',
            'email' => 'admin@rt.local',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'phone' => '081234567890',
            'address' => 'Jl. Melati No. 5',
            'house_number' => 'A5',
        ]);

        $warga1 = User::create([
            'name' => 'Budi Warga',
            'email' => 'warga@rt.local',
            'password' => Hash::make('password'),
            'role' => 'warga',
            'phone' => '082345678901',
            'address' => 'Jl. Melati No. 6',
            'house_number' => 'A6',
        ]);

        $warga2 = User::create([
            'name' => 'Ani Setiawati',
            'email' => 'ani@rt.local',
            'password' => Hash::make('password'),
            'role' => 'warga',
            'phone' => '083456789012',
            'address' => 'Jl. Melati No. 7',
            'house_number' => 'A7',
        ]);

        $warga3 = User::create([
            'name' => 'Dedi Kurniawan',
            'email' => 'dedi@rt.local',
            'password' => Hash::make('password'),
            'role' => 'warga',
            'phone' => '084567890123',
            'address' => 'Jl. Melati No. 8',
            'house_number' => 'A8',
        ]);

        // 2. Seed Announcements
        Announcement::create([
            'title' => 'Kerja Bakti Bulanan Bersama',
            'content' => 'Diberitahukan kepada seluruh warga RT 02 untuk mengikuti kegiatan Kerja Bakti Bulanan yang akan dilaksanakan pada hari Minggu besok pukul 07.00 WIB. Titik kumpul berada di depan Pos Satpam. Mohon membawa peralatan kerja masing-masing.',
            'author_id' => $admin->id,
        ]);

        Announcement::create([
            'title' => 'Iuran Kas RT Periode Mei 2026',
            'content' => 'Iuran wajib Kas RT untuk bulan Mei 2026 sebesar Rp 50.000,- sudah bisa dibayarkan melalui transfer bank atau dompet digital, kemudian harap melampirkan bukti pembayaran melalui portal web Kas RT ini. Terima kasih atas partisipasi warga sekalian.',
            'author_id' => $admin->id,
        ]);

        Announcement::create([
            'title' => 'Pengamanan Pos Rondam Malam',
            'content' => 'Guna meningkatkan keamanan dan ketertiban lingkungan RT, mulai tanggal 1 Juni akan diberlakukan siskamling rutin. Jadwal ronda malam dapat dilihat di papan pengumuman fisik pos keamanan atau diunduh dari admin.',
            'author_id' => $admin->id,
        ]);

        // 3. Seed Kas Transactions (Dues)
        // April 2026 - Wajib (Lunas semua)
        KasTransaction::create([
            'user_id' => $warga1->id,
            'amount' => 50000,
            'month' => '2026-04',
            'type' => 'iuran_wajib',
            'status' => 'lunas',
            'payment_proof' => 'sample_proof.png',
            'verified_at' => Carbon::now()->subDays(15),
            'verified_by' => $admin->id,
            'description' => 'Iuran Wajib April 2026',
        ]);

        KasTransaction::create([
            'user_id' => $warga2->id,
            'amount' => 50000,
            'month' => '2026-04',
            'type' => 'iuran_wajib',
            'status' => 'lunas',
            'payment_proof' => 'sample_proof.png',
            'verified_at' => Carbon::now()->subDays(14),
            'verified_by' => $admin->id,
            'description' => 'Iuran Wajib April 2026',
        ]);

        KasTransaction::create([
            'user_id' => $warga3->id,
            'amount' => 50000,
            'month' => '2026-04',
            'type' => 'iuran_wajib',
            'status' => 'lunas',
            'payment_proof' => 'sample_proof.png',
            'verified_at' => Carbon::now()->subDays(13),
            'verified_by' => $admin->id,
            'description' => 'Iuran Wajib April 2026',
        ]);

        // May 2026 - Wajib (Mixed status)
        // Warga 1: Pending verification
        KasTransaction::create([
            'user_id' => $warga1->id,
            'amount' => 50000,
            'month' => '2026-05',
            'type' => 'iuran_wajib',
            'status' => 'pending',
            'payment_proof' => 'proof_budi_may.png',
            'description' => 'Transfer bank Mandiri iuran Mei - Budi A6',
        ]);

        // Warga 2: Lunas
        KasTransaction::create([
            'user_id' => $warga2->id,
            'amount' => 50000,
            'month' => '2026-05',
            'type' => 'iuran_wajib',
            'status' => 'lunas',
            'payment_proof' => 'proof_ani_may.png',
            'verified_at' => Carbon::now()->subDays(2),
            'verified_by' => $admin->id,
            'description' => 'Iuran Wajib Mei 2026',
        ]);

        // Warga 3: Belum Bayar
        KasTransaction::create([
            'user_id' => $warga3->id,
            'amount' => 50000,
            'month' => '2026-05',
            'type' => 'iuran_wajib',
            'status' => 'belum_bayar',
        ]);

        // Sukarela / Sosial iuran
        KasTransaction::create([
            'user_id' => $warga2->id,
            'amount' => 100000,
            'month' => '2026-05',
            'type' => 'iuran_sukarela',
            'status' => 'lunas',
            'payment_proof' => 'proof_donasi.png',
            'verified_at' => Carbon::now()->subDays(1),
            'verified_by' => $admin->id,
            'description' => 'Donasi Sukarela Pembangunan Masjid',
        ]);

        // 4. Seed Votes
        $vote1 = Vote::create([
            'title' => 'Pengadaan CCTV RT 02',
            'description' => 'Usulan pemasangan 4 titik kamera CCTV di lingkungan RT 02 (Gerbang Masuk, Gang A, Gang B, dan Pos Satpam) untuk memperketat keamanan. Anggaran diambil dari alokasi kas sosial RT sebesar Rp 2.500.000,-',
            'status' => 'active',
            'ends_at' => Carbon::now()->addDays(7),
        ]);

        $vote2 = Vote::create([
            'title' => 'Warna Cat Gapura Utama',
            'description' => 'Pemilihan warna untuk pengecatan ulang Gapura Utama RT 02 dalam rangka menyambut HUT RI.',
            'status' => 'closed',
            'ends_at' => Carbon::now()->subDays(1),
        ]);

        // 5. Seed Vote Responses
        // For Active Vote 1 (Pengadaan CCTV)
        VoteResponse::create([
            'user_id' => $warga1->id,
            'vote_id' => $vote1->id,
            'option' => 'setuju',
        ]);

        VoteResponse::create([
            'user_id' => $warga2->id,
            'vote_id' => $vote1->id,
            'option' => 'setuju',
        ]);

        // For Closed Vote 2
        VoteResponse::create([
            'user_id' => $warga1->id,
            'vote_id' => $vote2->id,
            'option' => 'setuju',
        ]);

        VoteResponse::create([
            'user_id' => $warga2->id,
            'vote_id' => $vote2->id,
            'option' => 'tidak_setuju',
        ]);

        VoteResponse::create([
            'user_id' => $warga3->id,
            'vote_id' => $vote2->id,
            'option' => 'abstain',
        ]);
    }
}
