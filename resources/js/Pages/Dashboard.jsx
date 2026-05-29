import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard(props) {
    const { role, stats, transactions, cashFlowData, announcements, userBills, votes } = props;
    const { auth } = usePage().props;

    // Modals visibility state
    const [showAnnModal, setShowAnnModal] = useState(false);
    const [showVoteModal, setShowVoteModal] = useState(false);

    // Form for Citizen: Lapor Pembayaran
    const {
        data: paymentData,
        setData: setPaymentData,
        post: postPayment,
        processing: paymentProcessing,
        errors: paymentErrors,
        reset: resetPayment,
    } = useForm({
        month: userBills?.monthCode || '2026-05',
        amount: userBills?.amount || 50000,
        type: 'iuran_wajib',
        payment_proof: null,
        description: '',
    });

    // Form for Admin: Terbitkan Pengumuman
    const {
        data: annData,
        setData: setAnnData,
        post: postAnn,
        processing: annProcessing,
        errors: annErrors,
        reset: resetAnn,
    } = useForm({
        title: '',
        content: '',
    });

    // Form for Admin: Buat Topik Votasi
    const {
        data: voteData,
        setData: setVoteData,
        post: postVote,
        processing: voteProcessing,
        errors: voteErrors,
        reset: resetVote,
    } = useForm({
        title: '',
        description: '',
        ends_at: '',
    });

    // Handle Payment Submit
    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        postPayment(route('transactions.store'), {
            onSuccess: () => resetPayment('payment_proof', 'description'),
        });
    };

    // Handle Announcement Submit
    const handleAnnSubmit = (e) => {
        e.preventDefault();
        postAnn(route('announcements.store'), {
            onSuccess: () => {
                setShowAnnModal(false);
                resetAnn();
            },
        });
    };

    // Handle Vote Submit
    const handleVoteSubmit = (e) => {
        e.preventDefault();
        postVote(route('votes.store'), {
            onSuccess: () => {
                setShowVoteModal(false);
                resetVote();
            },
        });
    };

    // Handle Casting a Vote (Warga)
    const handleCastVote = (voteId, option) => {
        useForm().post(route('votes.cast', voteId), {
            data: { option },
            preserveScroll: true,
        });
    };

    // Handle Toggle Vote Status (Admin)
    const handleToggleVote = (voteId) => {
        useForm().post(route('votes.toggle', voteId), {
            preserveScroll: true,
        });
    };

    // Helper: format money
    const formatRp = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-primary">
                    {role === 'admin' ? 'Dashboard Pengurus RT' : 'Portal Warga Digital'}
                </h2>
            }
        >
            <Head title="Dashboard" />

            {/* ADMIN VIEW */}
            {role === 'admin' && (
                <div className="space-y-8">
                    {/* Metrics Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Total Kas */}
                        <div className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                            <div>
                                <span className="text-xs font-semibold text-neutral-text dark:text-slate-400 uppercase tracking-wider">Total Kas RT (Lunas)</span>
                                <h3 className="text-2xl font-bold text-primary dark:text-slate-100 mt-1">{formatRp(stats.totalBalance)}</h3>
                                <span className="text-2xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 mt-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                                    Kas Aktif & Terverifikasi
                                </span>
                            </div>
                            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-full text-emerald-600 dark:text-emerald-450">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Antrean Verifikasi */}
                        <Link
                            href={route('transactions.index')}
                            className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group text-left"
                        >
                            <div>
                                <span className="text-xs font-semibold text-neutral-text dark:text-slate-400 uppercase tracking-wider">Antrean Verifikasi</span>
                                <h3 className="text-2xl font-bold text-primary dark:text-slate-100 mt-1">{stats.pendingCount} Laporan</h3>
                                <span className="text-2xs text-status-warning dark:text-amber-500 font-medium flex items-center gap-1 mt-2 group-hover:underline">
                                    Lihat antrean persetujuan &rarr;
                                </span>
                            </div>
                            <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-full text-status-warning dark:text-amber-500 group-hover:bg-orange-100 group-hover:dark:bg-orange-900/40 transition-colors">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                        </Link>

                        {/* Total Warga */}
                        <Link
                            href={route('citizens.index')}
                            className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group text-left"
                        >
                            <div>
                                <span className="text-xs font-semibold text-neutral-text dark:text-slate-400 uppercase tracking-wider">Warga Terdaftar</span>
                                <h3 className="text-2xl font-bold text-primary dark:text-slate-100 mt-1">{stats.residentCount} KK / Jiwa</h3>
                                <span className="text-2xs text-secondary dark:text-teal-400 font-medium flex items-center gap-1 mt-2 group-hover:underline">
                                    Kelola database warga &rarr;
                                </span>
                            </div>
                            <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-full text-secondary dark:text-teal-400 group-hover:bg-teal-100 group-hover:dark:bg-teal-900/40 transition-colors">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </Link>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Side: Cashflow and Transactions */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Monthly Cash Flow Overview */}
                            <div className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                                <h4 className="font-bold text-lg text-primary dark:text-slate-100 mb-4">Arus Kas Masuk Bulanan</h4>
                                {cashFlowData.length === 0 ? (
                                    <div className="text-center py-6 text-neutral-text dark:text-slate-400 text-sm">Belum ada pencatatan arus kas bulanan.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-slate-50 dark:bg-slate-800 text-neutral-text dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
                                                    <th className="p-3 rounded-l-md-custom">Bulan</th>
                                                    <th className="p-3 rounded-r-md-custom text-right">Total Terkumpul</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                                {cashFlowData.map((flow) => (
                                                    <tr key={flow.month_label} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                                        <td className="p-3 font-semibold text-neutral-dark dark:text-slate-200">
                                                            {new Date(flow.month_label + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                        </td>
                                                        <td className="p-3 text-right font-bold text-secondary dark:text-teal-400">
                                                            {formatRp(flow.total)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>

                            {/* Recent Cash Activity */}
                            <div className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="font-bold text-lg text-primary dark:text-slate-100">Aktivitas Transaksi Terbaru</h4>
                                    <Link href={route('transactions.index')} className="text-xs font-semibold text-secondary dark:text-teal-400 hover:underline">
                                        Semua Transaksi &rarr;
                                    </Link>
                                </div>
                                {transactions.length === 0 ? (
                                    <div className="text-center py-8 text-neutral-text dark:text-slate-400 text-sm">Belum ada riwayat transaksi warga.</div>
                                ) : (
                                    <div className="space-y-3">
                                        {transactions.slice(0, 5).map((tx) => (
                                            <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md-custom border border-slate-50 dark:border-slate-800/40 transition-colors">
                                                <div>
                                                    <h5 className="font-semibold text-sm text-neutral-dark dark:text-slate-200">{tx.user?.name}</h5>
                                                    <p className="text-2xs text-neutral-text dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                        <span>No. {tx.user?.house_number}</span>
                                                        <span>•</span>
                                                        <span>{tx.type === 'iuran_wajib' ? 'Iuran Wajib' : tx.type === 'iuran_sosial' ? 'Iuran Sosial' : 'Iuran Sukarela'} ({tx.month})</span>
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold text-sm text-primary dark:text-slate-100 block">{formatRp(tx.amount)}</span>
                                                    <span className={`inline-block px-2 py-0.5 text-[9px] font-bold uppercase rounded-full mt-1 ${
                                                        tx.status === 'lunas'
                                                            ? 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400'
                                                            : tx.status === 'pending'
                                                            ? 'bg-orange-100 dark:bg-orange-950/40 text-orange-850 dark:text-amber-500'
                                                            : 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400'
                                                    }`}>
                                                        {tx.status === 'lunas' ? 'Lunas' : tx.status === 'pending' ? 'Pending' : 'Belum Bayar'}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Announcements & Admin Panel Actions */}
                        <div className="space-y-8">
                            {/* Admin Controls */}
                            <div className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                                <h4 className="font-bold text-base text-primary dark:text-slate-100 mb-4">Aksi Pengurus RT</h4>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => setShowAnnModal(true)}
                                        className="w-full py-3 px-4 bg-primary hover:bg-primary-container text-white font-bold rounded-md-custom text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v12a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <span>Tulis Pengumuman</span>
                                    </button>
                                    <button
                                        onClick={() => setShowVoteModal(true)}
                                        className="w-full py-3 px-4 bg-secondary hover:bg-teal-700 text-white font-bold rounded-md-custom text-sm shadow-sm transition-all flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        <span>Buka Polling Suara</span>
                                    </button>
                                </div>
                            </div>

                            {/* Announcements Feed */}
                            <div className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                                <h4 className="font-bold text-lg text-primary dark:text-slate-100 mb-4">Informasi & Pengumuman</h4>
                                {announcements.length === 0 ? (
                                    <div className="text-center py-6 text-neutral-text dark:text-slate-400 text-sm">Belum ada pengumuman terbit.</div>
                                ) : (
                                    <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                                        {announcements.map((ann) => (
                                            <div key={ann.id} className="p-4 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60 rounded-md-custom relative group">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h5 className="font-bold text-sm text-neutral-dark dark:text-slate-200 group-hover:text-primary dark:group-hover:text-slate-100 transition-colors">{ann.title}</h5>
                                                    <span className="text-[10px] text-neutral-text dark:text-slate-400">
                                                        {new Date(ann.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-neutral-text dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                                                <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center text-[10px] text-neutral-text dark:text-slate-400">
                                                    <span>Oleh: <strong className="text-neutral-dark dark:text-slate-200">{ann.author?.name}</strong></span>
                                                    <button
                                                        onClick={() => {
                                                            if(confirm("Hapus pengumuman ini?")) {
                                                                useForm().delete(route('announcements.destroy', ann.id), { preserveScroll: true });
                                                            }
                                                        }}
                                                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* WARGA VIEW */}
            {role === 'warga' && (
                <div className="space-y-8">
                    {/* Top Bills Overview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {/* Status Tagihan Bulan Ini */}
                        <div className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between col-span-1 sm:col-span-2">
                            <div>
                                <span className="text-xs font-semibold text-neutral-text dark:text-slate-400 uppercase tracking-wider">Tagihan Dues Bulan Ini ({userBills.month})</span>
                                <div className="flex items-baseline gap-3 mt-1 flex-wrap">
                                    <h3 className="text-2xl font-bold text-primary dark:text-slate-100">{formatRp(userBills.amount)}</h3>
                                    <span className={`inline-block px-3 py-1 text-2xs font-bold uppercase rounded-full ${
                                        userBills.status === 'lunas'
                                            ? 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400'
                                            : userBills.status === 'pending'
                                            ? 'bg-orange-100 dark:bg-orange-950/40 text-orange-850 dark:text-amber-500'
                                            : 'bg-red-100 dark:bg-red-950/40 text-red-800 dark:text-red-400'
                                    }`}>
                                        {userBills.status === 'lunas' ? 'Lunas' : userBills.status === 'pending' ? 'Menunggu Verifikasi' : 'Belum Bayar'}
                                    </span>
                                </div>
                                <p className="text-2xs text-neutral-text dark:text-slate-400 mt-2 leading-relaxed">
                                    {userBills.status === 'belum_bayar' && '⚠️ Harap segera melapor pembayaran dengan mengunggah struk transfer.'}
                                    {userBills.status === 'pending' && '⏳ Bukti pembayaran Anda sedang diproses oleh pengurus RT.'}
                                    {userBills.status === 'lunas' && '✨ Terima kasih! Kontribusi Anda mendukung stabilitas & kenyamanan RT.'}
                                </p>
                            </div>
                            <div className={`p-4 rounded-full ${
                                userBills.status === 'lunas' ? 'bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-950/30 text-status-warning dark:text-amber-500'
                            }`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                        </div>

                        {/* Riwayat Ledger Count Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold text-neutral-text dark:text-slate-400 uppercase tracking-wider">Total Lunas Anda</span>
                                <h3 className="text-2xl font-bold text-secondary dark:text-teal-400 mt-1">
                                    {formatRp(transactions.filter(t => t.status === 'lunas').reduce((sum, t) => sum + t.amount, 0))}
                                </h3>
                                <p className="text-2xs text-neutral-text dark:text-slate-400 mt-2">
                                    Berdasarkan data kas terverifikasi.
                                </p>
                            </div>
                            <div className="p-4 bg-teal-50 dark:bg-teal-950/30 rounded-full text-secondary dark:text-teal-400">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Warga Dashboard Workspace */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left/Middle Space: Billing & Polls */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Lapor Pembayaran Box */}
                            {userBills.status !== 'lunas' && (
                                <div className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                                    <h4 className="font-bold text-lg text-primary dark:text-slate-100 mb-4 flex items-center gap-2">
                                        <span>📝</span> Lapor Pembayaran Kas
                                    </h4>
                                    <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Bulan */}
                                            <div>
                                                <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Periode Bulan</label>
                                                <input
                                                    type="month"
                                                    value={paymentData.month}
                                                    onChange={e => setPaymentData('month', e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                                    required
                                                />
                                                {paymentErrors.month && <p className="text-2xs text-status-error mt-1">{paymentErrors.month}</p>}
                                            </div>

                                            {/* Jumlah */}
                                            <div>
                                                <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Jumlah Bayar (Rp)</label>
                                                <input
                                                    type="number"
                                                    value={paymentData.amount}
                                                    onChange={e => setPaymentData('amount', e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                                    required
                                                />
                                                {paymentErrors.amount && <p className="text-2xs text-status-error mt-1">{paymentErrors.amount}</p>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {/* Jenis Iuran */}
                                            <div>
                                                <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Jenis Iuran</label>
                                                <select
                                                    value={paymentData.type}
                                                    onChange={e => setPaymentData('type', e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm bg-white dark:bg-slate-850"
                                                    required
                                                >
                                                    <option value="iuran_wajib" className="dark:bg-slate-800">Iuran Wajib bulanan (Rp 50.000)</option>
                                                    <option value="iuran_sosial" className="dark:bg-slate-800">Iuran Sosial RT</option>
                                                    <option value="iuran_sukarela" className="dark:bg-slate-800">Iuran Sukarela</option>
                                                </select>
                                                {paymentErrors.type && <p className="text-2xs text-status-error mt-1">{paymentErrors.type}</p>}
                                            </div>

                                            {/* Bukti Transaksi */}
                                            <div>
                                                <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Unggah Bukti Bayar (Max 2MB)</label>
                                                <input
                                                    type="file"
                                                    onChange={e => setPaymentData('payment_proof', e.target.files[0])}
                                                    accept="image/*"
                                                    className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 dark:file:bg-teal-950/30 file:text-secondary dark:file:text-teal-400 hover:file:bg-teal-100 dark:hover:file:bg-teal-900/40"
                                                    required
                                                />
                                                {paymentErrors.payment_proof && <p className="text-2xs text-status-error mt-1">{paymentErrors.payment_proof}</p>}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Catatan Tambahan (Opsional)</label>
                                            <textarea
                                                value={paymentData.description}
                                                onChange={e => setPaymentData('description', e.target.value)}
                                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-850 dark:text-slate-100 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                                rows="2"
                                                placeholder="Contoh: Pembayaran iuran bulan Mei lunas."
                                            ></textarea>
                                            {paymentErrors.description && <p className="text-2xs text-status-error mt-1">{paymentErrors.description}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={paymentProcessing}
                                            className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-md-custom text-sm shadow-sm transition-all disabled:opacity-50"
                                        >
                                            {paymentProcessing ? 'Mengirim...' : 'Kirim Laporan Pembayaran'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Active & Past Citizen Polls */}
                            <div className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                                <h4 className="font-bold text-lg text-primary dark:text-slate-100 mb-4 flex items-center gap-2">
                                    <span>🗳️</span> Suara & Votasi Warga
                                </h4>
                                {votes.length === 0 ? (
                                    <div className="text-center py-6 text-neutral-text dark:text-slate-400 text-sm">Belum ada topik pemungutan suara aktif saat ini.</div>
                                ) : (
                                    <div className="space-y-6">
                                        {votes.map((vote) => {
                                            const totalVotes = vote.stats.total;
                                            const setujuPct = totalVotes > 0 ? Math.round((vote.stats.setuju / totalVotes) * 100) : 0;
                                            const tidakSetujuPct = totalVotes > 0 ? Math.round((vote.stats.tidak_setuju / totalVotes) * 100) : 0;
                                            const abstainPct = totalVotes > 0 ? Math.round((vote.stats.abstain / totalVotes) * 100) : 0;

                                            return (
                                                <div key={vote.id} className="p-5 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 rounded-md-custom space-y-4">
                                                    <div className="flex justify-between items-start gap-2">
                                                        <div>
                                                            <h5 className="font-bold text-base text-neutral-dark dark:text-slate-200">{vote.title}</h5>
                                                            <p className="text-xs text-neutral-text dark:text-slate-400 leading-relaxed mt-1">{vote.description}</p>
                                                        </div>
                                                        <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded-full shrink-0 ${
                                                            vote.status === 'active'
                                                                ? 'bg-green-100 dark:bg-green-950/40 text-green-800 dark:text-green-400 animate-pulse'
                                                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-350'
                                                        }`}>
                                                            {vote.status === 'active' ? 'Aktif' : 'Ditutup'}
                                                        </span>
                                                    </div>

                                                    {/* Voting Form / Selection display */}
                                                    {vote.status === 'active' && !vote.voted_option ? (
                                                        <div className="space-y-2">
                                                            <span className="text-2xs font-bold text-neutral-text dark:text-slate-400 block mb-1">Berikan Suara Anda:</span>
                                                            <div className="flex flex-wrap gap-2.5">
                                                                <button
                                                                    onClick={() => handleCastVote(vote.id, 'setuju')}
                                                                    className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/50 font-bold rounded-md-custom text-xs transition-colors flex items-center gap-1.5"
                                                                >
                                                                    <span>✓</span> Setuju
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCastVote(vote.id, 'tidak_setuju')}
                                                                    className="px-4 py-2 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-900/50 font-bold rounded-md-custom text-xs transition-colors flex items-center gap-1.5"
                                                                >
                                                                    <span>✗</span> Tidak Setuju
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCastVote(vote.id, 'abstain')}
                                                                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-bold rounded-md-custom text-xs transition-colors flex items-center gap-1.5"
                                                                >
                                                                    <span>○</span> Abstain
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            {vote.voted_option && (
                                                                <div className="flex items-center gap-2 text-xs font-semibold text-secondary dark:text-teal-400">
                                                                    <svg className="w-4 h-4 text-secondary dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    <span>Pilihan Anda: <strong className="uppercase bg-secondary-container dark:bg-teal-950/30 px-2 py-0.5 rounded text-primary dark:text-teal-400">{vote.voted_option}</strong></span>
                                                                </div>
                                                            )}

                                                            {/* Results Progress Bars */}
                                                            <div className="space-y-2">
                                                                <span className="text-2xs font-bold text-neutral-text dark:text-slate-400 block">Hasil Sementara ({totalVotes} Suara):</span>
                                                                
                                                                {/* Setuju */}
                                                                <div className="space-y-1">
                                                                    <div className="flex justify-between text-2xs font-medium">
                                                                        <span className="text-neutral-dark dark:text-slate-200">Setuju ({vote.stats.setuju})</span>
                                                                        <span className="text-neutral-dark dark:text-slate-300">{setujuPct}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-slate-200 dark:bg-slate-850 h-2.5 rounded-full overflow-hidden">
                                                                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${setujuPct}%` }}></div>
                                                                    </div>
                                                                </div>

                                                                {/* Tidak Setuju */}
                                                                <div className="space-y-1">
                                                                    <div className="flex justify-between text-2xs font-medium">
                                                                        <span className="text-neutral-dark dark:text-slate-200">Tidak Setuju ({vote.stats.tidak_setuju})</span>
                                                                        <span className="text-neutral-dark dark:text-slate-300">{tidakSetujuPct}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-slate-200 dark:bg-slate-850 h-2.5 rounded-full overflow-hidden">
                                                                        <div className="bg-status-error h-full rounded-full transition-all duration-500" style={{ width: `${tidakSetujuPct}%` }}></div>
                                                                    </div>
                                                                </div>

                                                                {/* Abstain */}
                                                                <div className="space-y-1">
                                                                    <div className="flex justify-between text-2xs font-medium">
                                                                        <span className="text-neutral-dark dark:text-slate-200">Abstain ({vote.stats.abstain})</span>
                                                                        <span className="text-neutral-dark dark:text-slate-300">{abstainPct}%</span>
                                                                    </div>
                                                                    <div className="w-full bg-slate-200 dark:bg-slate-850 h-2.5 rounded-full overflow-hidden">
                                                                        <div className="bg-slate-400 h-full rounded-full transition-all duration-500" style={{ width: `${abstainPct}%` }}></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Space: Announcements Board */}
                        <div className="space-y-8">
                            <div className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                                <h4 className="font-bold text-lg text-primary dark:text-slate-100 mb-4 flex items-center gap-2">
                                    <span>📢</span> Papan Pengumuman RT
                                </h4>
                                {announcements.length === 0 ? (
                                    <div className="text-center py-6 text-neutral-text dark:text-slate-400 text-sm">Belum ada pengumuman warga.</div>
                                ) : (
                                    <div className="space-y-4 max-h-[450px] overflow-y-auto pr-1">
                                        {announcements.map((ann) => (
                                            <div key={ann.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/65 rounded-md-custom">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h5 className="font-bold text-sm text-neutral-dark dark:text-slate-200">{ann.title}</h5>
                                                    <span className="text-[10px] text-neutral-text dark:text-slate-400">
                                                        {new Date(ann.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-neutral-text dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                                                <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50 flex justify-between items-center text-[10px] text-neutral-text dark:text-slate-400">
                                                    <span>Oleh: <strong className="text-neutral-dark dark:text-slate-200">{ann.author?.name}</strong></span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: ADMIN WRITE ANNOUNCEMENT */}
            {showAnnModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAnnModal(false)} />
                    <div className="bg-white dark:bg-slate-900 rounded-xl-custom shadow-2xl max-w-lg w-full overflow-hidden relative z-10 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-primary p-5 text-white flex items-center justify-between">
                            <h3 className="font-bold text-lg">Terbitkan Pengumuman Baru</h3>
                            <button onClick={() => setShowAnnModal(false)} className="text-slate-300 hover:text-white p-1 hover:bg-white/10 rounded-full">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAnnSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Judul Pengumuman</label>
                                <input
                                    type="text"
                                    value={annData.title}
                                    onChange={e => setAnnData('title', e.target.value)}
                                    placeholder="Contoh: Kerja Bakti Hari Minggu"
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                    required
                                />
                                {annErrors.title && <p className="text-2xs text-status-error mt-1">{annErrors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Isi Detail Pengumuman</label>
                                <textarea
                                    value={annData.content}
                                    onChange={e => setAnnData('content', e.target.value)}
                                    placeholder="Tulis rincian informasi di sini..."
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                    rows="5"
                                    required
                                ></textarea>
                                {annErrors.content && <p className="text-2xs text-status-error mt-1">{annErrors.content}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAnnModal(false)}
                                    className="px-4 py-2 border border-slate-200 dark:border-slate-750 text-neutral-text dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-md-custom text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={annProcessing}
                                    className="px-5 py-2 bg-primary hover:bg-primary-container text-white font-bold rounded-md-custom text-sm shadow-sm disabled:opacity-50"
                                >
                                    {annProcessing ? 'Menerbitkan...' : 'Terbitkan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: ADMIN LAUNCH VOTE */}
            {showVoteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowVoteModal(false)} />
                    <div className="bg-white dark:bg-slate-900 rounded-xl-custom shadow-2xl max-w-lg w-full overflow-hidden relative z-10 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-secondary p-5 text-white flex items-center justify-between">
                            <h3 className="font-bold text-lg">Buka Topik Pemungutan Suara</h3>
                            <button onClick={() => setShowVoteModal(false)} className="text-slate-300 hover:text-white p-1 hover:bg-white/10 rounded-full">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleVoteSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Pertanyaan / Topik Votasi</label>
                                <input
                                    type="text"
                                    value={voteData.title}
                                    onChange={e => setVoteData('title', e.target.value)}
                                    placeholder="Contoh: Pengadaan Portal Otomatis di Gerbang Masuk"
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                    required
                                />
                                {voteErrors.title && <p className="text-2xs text-status-error mt-1">{voteErrors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Deskripsi & Pilihan</label>
                                <textarea
                                    value={voteData.description}
                                    onChange={e => setVoteData('description', e.target.value)}
                                    placeholder="Tulis deskripsi detail, dampak biaya, atau informasi pendukung lainnya..."
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                    rows="4"
                                    required
                                ></textarea>
                                {voteErrors.description && <p className="text-2xs text-status-error mt-1">{voteErrors.description}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Tanggal Berakhir (Opsional)</label>
                                <input
                                    type="date"
                                    value={voteData.ends_at}
                                    onChange={e => setVoteData('ends_at', e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                />
                                {voteErrors.ends_at && <p className="text-2xs text-status-error mt-1">{voteErrors.ends_at}</p>}
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowVoteModal(false)}
                                    className="px-4 py-2 border border-slate-200 dark:border-slate-750 text-neutral-text dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-md-custom text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={voteProcessing}
                                    className="px-5 py-2 bg-secondary hover:bg-teal-700 text-white font-bold rounded-md-custom text-sm shadow-sm disabled:opacity-50"
                                >
                                    {voteProcessing ? 'Memulai...' : 'Buka Votasi'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
