import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index(props) {
    const { pendingTransactions, allTransactions, myTransactions } = props;
    const { auth } = usePage().props;
    const user = auth.user;
    const isAdmin = user.role === 'admin';

    // State for viewing payment proof image in modal
    const [viewerImage, setViewerImage] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Form for Citizen: Lapor Pembayaran (within Transactions page)
    const {
        data: paymentData,
        setData: setPaymentData,
        post: postPayment,
        processing: paymentProcessing,
        errors: paymentErrors,
        reset: resetPayment,
    } = useForm({
        month: '2026-05',
        amount: 50000,
        type: 'iuran_wajib',
        payment_proof: null,
        description: '',
    });

    // Submit Payment Report
    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        postPayment(route('transactions.store'), {
            onSuccess: () => {
                setShowPaymentModal(false);
                resetPayment('payment_proof', 'description');
            },
        });
    };

    // Verify Action (Approve / Reject)
    const handleVerify = (transactionId, action) => {
        const confirmMsg = action === 'approve'
            ? 'Setujui pembayaran kas ini dan ubah status menjadi LUNAS?'
            : 'Tolak laporan pembayaran ini? File bukti transfer akan dihapus.';
        
        if (confirm(confirmMsg)) {
            router.post(route('transactions.verify', transactionId), {
                action: action,
            }, {
                preserveScroll: true,
            });
        }
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
                <h2 className="text-xl font-semibold leading-tight text-primary dark:text-slate-100">
                    {isAdmin ? 'Verifikasi & Laporan Kas RT' : 'Riwayat Iuran & Kas Warga'}
                </h2>
            }
        >
            <Head title="Kas & Transaksi" />

            <div className="space-y-8">
                {/* ADMIN VIEW */}
                {isAdmin && (
                    <div className="space-y-8">
                        {/* Pending Verifications Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-lg text-primary dark:text-slate-100 mb-4 flex items-center gap-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-status-warning inline-block"></span>
                                Antrean Verifikasi Pembayaran ({pendingTransactions.length})
                            </h3>

                            {pendingTransactions.length === 0 ? (
                                <div className="text-center py-8 text-neutral-text dark:text-slate-400 text-sm bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-800 rounded-md-custom">
                                    ☕ Bersih! Belum ada laporan pembayaran baru dari warga.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {pendingTransactions.map((tx) => (
                                        <div key={tx.id} className="p-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 rounded-md-custom flex gap-4 hover:shadow-sm transition-all">
                                            {/* Proof Thumbnail */}
                                            {tx.payment_proof && (
                                                <div
                                                    onClick={() => setViewerImage(`/storage/${tx.payment_proof}`)}
                                                    className="w-20 h-24 shrink-0 bg-slate-200 dark:bg-slate-800 rounded overflow-hidden cursor-zoom-in relative group border border-slate-200 dark:border-slate-700"
                                                >
                                                    <img
                                                        src={`/storage/${tx.payment_proof}`}
                                                        alt="Bukti Transfer"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-2xs font-semibold">
                                                        Zoom
                                                    </div>
                                                </div>
                                            )}

                                            {/* Transaction Details */}
                                            <div className="flex-1 flex flex-col justify-between min-w-0">
                                                <div>
                                                    <div className="flex justify-between items-start gap-1">
                                                        <h4 className="font-bold text-sm text-neutral-dark dark:text-slate-200 truncate">{tx.user?.name}</h4>
                                                        <span className="text-[10px] text-neutral-text dark:text-slate-300 font-medium bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full uppercase shrink-0">
                                                            No. {tx.user?.house_number}
                                                        </span>
                                                    </div>
                                                    <p className="text-2xs text-neutral-text dark:text-slate-400 mt-1">
                                                        Kategori: <strong className="text-neutral-dark dark:text-slate-200 uppercase">{tx.type.replace('iuran_', '')}</strong> ({tx.month})
                                                    </p>
                                                    <p className="text-xs font-bold text-primary dark:text-slate-100 mt-1">{formatRp(tx.amount)}</p>
                                                    {tx.description && (
                                                        <p className="text-2xs italic text-slate-500 dark:text-slate-450 mt-2 bg-white dark:bg-slate-900 p-1.5 rounded border border-slate-100 dark:border-slate-800 truncate">
                                                            "{tx.description}"
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex gap-2 mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                                                    <button
                                                        onClick={() => handleVerify(tx.id, 'approve')}
                                                        className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-md-custom text-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                                    >
                                                        <span>✓</span> Setujui
                                                    </button>
                                                    <button
                                                        onClick={() => handleVerify(tx.id, 'reject')}
                                                        className="py-1.5 px-3 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/20 text-status-error dark:text-red-450 font-semibold rounded-md-custom text-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                                                    >
                                                        <span>✗</span> Tolak
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* All Transactions History Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-lg text-primary dark:text-slate-100 mb-4">Riwayat Seluruh Transaksi RT</h3>

                            {allTransactions.length === 0 ? (
                                <div className="text-center py-8 text-neutral-text dark:text-slate-400 text-sm">
                                    Belum ada transaksi terdaftar.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[750px]">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-neutral-text dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
                                                <th className="p-4">Warga</th>
                                                <th className="p-4">Periode</th>
                                                <th className="p-4">Jumlah</th>
                                                <th className="p-4">Kategori</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Bukti</th>
                                                <th className="p-4">Diverifikasi Oleh</th>
                                                <th className="p-4">Tanggal Transaksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                            {allTransactions.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-semibold text-neutral-dark dark:text-slate-200">{tx.user?.name}</div>
                                                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Rumah No. {tx.user?.house_number}</div>
                                                    </td>
                                                    <td className="p-4 font-semibold text-neutral-dark dark:text-slate-200">
                                                        {new Date(tx.month + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                    </td>
                                                    <td className="p-4 font-bold text-primary dark:text-slate-100">
                                                        {formatRp(tx.amount)}
                                                    </td>
                                                    <td className="p-4 text-xs">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                            tx.type === 'iuran_wajib' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300' : tx.type === 'iuran_sosial' ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300' : 'bg-teal-50 dark:bg-teal-950/50 text-secondary dark:text-teal-300'
                                                        }`}>
                                                            {tx.type === 'iuran_wajib' ? 'Wajib' : tx.type === 'iuran_sosial' ? 'Sosial' : 'Sukarela'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                                                            tx.status === 'lunas'
                                                                ? 'bg-green-100 dark:bg-green-950/55 text-green-800 dark:text-green-300'
                                                                : tx.status === 'pending'
                                                                ? 'bg-orange-100 dark:bg-orange-950/55 text-orange-800 dark:text-orange-300'
                                                                : 'bg-red-100 dark:bg-red-950/55 text-red-800 dark:text-red-300'
                                                        }`}>
                                                            {tx.status === 'lunas' ? 'Lunas' : tx.status === 'pending' ? 'Pending' : 'Belum Bayar'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        {tx.payment_proof ? (
                                                            <button
                                                                onClick={() => setViewerImage(`/storage/${tx.payment_proof}`)}
                                                                className="text-xs font-semibold text-secondary dark:text-teal-400 hover:underline cursor-pointer flex items-center gap-1"
                                                            >
                                                                <span>🖼️</span> Lihat
                                                            </button>
                                                        ) : (
                                                            <span className="text-slate-400 dark:text-slate-500 text-xs">-</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-xs text-neutral-text dark:text-slate-400">
                                                        {tx.verified_by ? (
                                                            <div>
                                                                <span className="font-semibold">{tx.verified_by_user?.name || 'Ketua RT'}</span>
                                                                {tx.verified_at && <span className="block text-[10px] text-slate-400 dark:text-slate-500">{new Date(tx.verified_at).toLocaleDateString('id-ID', {day: '2-digit', month: '2-digit'})}</span>}
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-400 dark:text-slate-500">-</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-xs text-neutral-text dark:text-slate-400">
                                                        {new Date(tx.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* CITIZEN VIEW */}
                {!isAdmin && (
                    <div className="space-y-8">
                        {/* Summary Box & Action */}
                        <div className="bg-white dark:bg-slate-900 rounded-md-custom p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h3 className="font-bold text-lg text-primary dark:text-slate-100">Riwayat Kontribusi Bulanan Anda</h3>
                                <p className="text-xs text-neutral-text dark:text-slate-400 mt-1">Daftar iuran iuran wajib, iuran sosial, dan iuran sukarela yang telah Anda laporkan.</p>
                            </div>
                            <button
                                onClick={() => setShowPaymentModal(true)}
                                className="w-full sm:w-auto px-5 py-2.5 bg-primary hover:bg-primary-container text-white font-bold rounded-md-custom text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Lapor Pembayaran Baru</span>
                            </button>
                        </div>

                        {/* Citizen Transaction Table */}
                        <div className="bg-white dark:bg-slate-900 rounded-md-custom shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                            {myTransactions.length === 0 ? (
                                <div className="text-center py-12 text-neutral-text dark:text-slate-400 text-sm">
                                    Belum ada pencatatan transaksi untuk rumah Anda.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse min-w-[650px]">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-neutral-text dark:text-slate-350 uppercase text-[10px] tracking-wider font-bold">
                                                <th className="p-4">Periode</th>
                                                <th className="p-4">Jumlah Bayar</th>
                                                <th className="p-4">Kategori Iuran</th>
                                                <th className="p-4">Status Verifikasi</th>
                                                <th className="p-4">Bukti Upload</th>
                                                <th className="p-4">Keterangan</th>
                                                <th className="p-4">Tanggal Lapor</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                            {myTransactions.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="p-4 font-semibold text-neutral-dark dark:text-slate-200">
                                                        {new Date(tx.month + '-01').toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                                    </td>
                                                    <td className="p-4 font-bold text-primary dark:text-slate-100">
                                                        {formatRp(tx.amount)}
                                                    </td>
                                                    <td className="p-4 text-xs">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                            tx.type === 'iuran_wajib' ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300' : tx.type === 'iuran_sosial' ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300' : 'bg-teal-50 dark:bg-teal-950/50 text-secondary dark:text-teal-300'
                                                        }`}>
                                                            {tx.type === 'iuran_wajib' ? 'Wajib' : tx.type === 'iuran_sosial' ? 'Sosial' : 'Sukarela'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                                                            tx.status === 'lunas'
                                                                ? 'bg-green-100 dark:bg-green-950/55 text-green-800 dark:text-green-300'
                                                                : tx.status === 'pending'
                                                                ? 'bg-orange-100 dark:bg-orange-950/55 text-orange-800 dark:text-orange-300'
                                                                : 'bg-red-100 dark:bg-red-950/55 text-red-800 dark:text-red-300'
                                                        }`}>
                                                            {tx.status === 'lunas' ? 'Terverifikasi' : tx.status === 'pending' ? 'Diproses' : 'Belum Bayar'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        {tx.payment_proof ? (
                                                            <button
                                                                onClick={() => setViewerImage(`/storage/${tx.payment_proof}`)}
                                                                className="text-xs font-semibold text-secondary dark:text-teal-400 hover:underline cursor-pointer flex items-center gap-1"
                                                            >
                                                                <span>🖼️</span> Lihat Struk
                                                            </button>
                                                        ) : (
                                                            <span className="text-slate-400 dark:text-slate-500 text-xs">-</span>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-xs text-neutral-text dark:text-slate-400 max-w-xs truncate">
                                                        {tx.description || '-'}
                                                    </td>
                                                    <td className="p-4 text-xs text-neutral-text dark:text-slate-400">
                                                        {new Date(tx.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL: IMAGE VIEWER */}
            {viewerImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                    <button
                        onClick={() => setViewerImage(null)}
                        className="absolute top-6 right-6 text-white hover:text-slate-300 p-2 hover:bg-white/10 rounded-full focus:outline-none"
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <div className="max-w-3xl max-h-[85vh] w-full p-2 flex items-center justify-center animate-in zoom-in-95 duration-200">
                        <img
                            src={viewerImage}
                            alt="Bukti Transfer Fullscreen"
                            className="max-w-full max-h-full object-contain rounded-md-custom shadow-2xl border border-white/10"
                        />
                    </div>
                </div>
            )}

            {/* MODAL: REPORT PAYMENT (CITIZEN ONLY) */}
            {showPaymentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
                    <div className="bg-white dark:bg-slate-900 rounded-xl-custom shadow-2xl max-w-lg w-full overflow-hidden relative z-10 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-primary p-5 text-white flex items-center justify-between">
                            <h3 className="font-bold text-lg">Laporkan Pembayaran Kas</h3>
                            <button onClick={() => setShowPaymentModal(false)} className="text-slate-300 hover:text-white p-1 hover:bg-white/10 rounded-full">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Bulan */}
                                <div>
                                    <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Periode Bulan *</label>
                                    <input
                                        type="month"
                                        value={paymentData.month}
                                        onChange={e => setPaymentData('month', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                        required
                                    />
                                    {paymentErrors.month && <p className="text-2xs text-status-error mt-1">{paymentErrors.month}</p>}
                                </div>

                                {/* Jumlah */}
                                <div>
                                    <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Jumlah Bayar (Rp) *</label>
                                    <input
                                        type="number"
                                        value={paymentData.amount}
                                        onChange={e => setPaymentData('amount', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                        required
                                    />
                                    {paymentErrors.amount && <p className="text-2xs text-status-error mt-1">{paymentErrors.amount}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Jenis Iuran */}
                                <div>
                                    <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Jenis Iuran *</label>
                                    <select
                                        value={paymentData.type}
                                        onChange={e => setPaymentData('type', e.target.value)}
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                        required
                                    >
                                        <option value="iuran_wajib">Iuran Wajib (Rp 50.000)</option>
                                        <option value="iuran_sosial">Iuran Sosial</option>
                                        <option value="iuran_sukarela">Iuran Sukarela</option>
                                    </select>
                                    {paymentErrors.type && <p className="text-2xs text-status-error mt-1">{paymentErrors.type}</p>}
                                </div>

                                {/* Bukti Transaksi */}
                                <div>
                                    <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Unggah Struk/Bukti Transfer *</label>
                                    <input
                                        type="file"
                                        onChange={e => setPaymentData('payment_proof', e.target.files[0])}
                                        accept="image/*"
                                        className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-secondary hover:file:bg-teal-100 dark:file:bg-teal-950/40 dark:file:text-teal-300"
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
                                    placeholder="Contoh: Bukti transfer iuran wajib bulan Mei."
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                    rows="3"
                                ></textarea>
                                {paymentErrors.description && <p className="text-2xs text-status-error mt-1">{paymentErrors.description}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="px-4 py-2 border border-slate-200 dark:border-slate-750 text-neutral-text dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-md-custom text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={paymentProcessing}
                                    className="px-5 py-2 bg-primary hover:bg-primary-container text-white font-bold rounded-md-custom text-sm shadow-sm disabled:opacity-50"
                                >
                                    {paymentProcessing ? 'Mengirim...' : 'Kirim Laporan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
