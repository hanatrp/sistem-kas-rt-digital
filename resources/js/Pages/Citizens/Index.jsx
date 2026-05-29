import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ citizens }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCitizen, setSelectedCitizen] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);

    // Form for Adding Citizen
    const {
        data: addData,
        setData: setAddData,
        post: postAdd,
        processing: addProcessing,
        errors: addErrors,
        reset: resetAdd,
    } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        house_number: '',
    });

    // Form for Editing Citizen
    const {
        data: editData,
        setData: setEditData,
        patch: patchEdit,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        house_number: '',
    });

    // Handle Add Submit
    const handleAddSubmit = (e) => {
        e.preventDefault();
        postAdd(route('citizens.store'), {
            onSuccess: () => {
                setShowAddModal(false);
                resetAdd();
            },
        });
    };

    // Open Edit Modal & Populate Form
    const openEditModal = (citizen) => {
        setSelectedCitizen(citizen);
        setEditData({
            name: citizen.name,
            email: citizen.email,
            phone: citizen.phone || '',
            address: citizen.address || '',
            house_number: citizen.house_number || '',
        });
        setShowEditModal(true);
    };

    // Handle Edit Submit
    const handleEditSubmit = (e) => {
        e.preventDefault();
        patchEdit(route('citizens.update', selectedCitizen.id), {
            onSuccess: () => {
                setShowEditModal(false);
                setSelectedCitizen(null);
                resetEdit();
            },
        });
    };

    // Handle Delete Citizen
    const handleDeleteCitizen = (citizenId) => {
        if (confirm('Apakah Anda yakin ingin menghapus data warga ini? Seluruh riwayat transaksi terkait juga akan dihapus.')) {
            useForm().delete(route('citizens.destroy', citizenId));
        }
    };

    // Client-side search filtering
    const filteredCitizens = citizens.filter((citizen) => {
        const query = searchQuery.toLowerCase();
        return (
            citizen.name.toLowerCase().includes(query) ||
            citizen.email.toLowerCase().includes(query) ||
            (citizen.house_number && citizen.house_number.toLowerCase().includes(query))
        );
    });

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-primary dark:text-slate-100">
                    Manajemen Data Warga RT
                </h2>
            }
        >
            <Head title="Data Warga" />

            <div className="space-y-6">
                {/* Header Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-md-custom shadow-sm border border-slate-100 dark:border-slate-800">
                    {/* Search Field */}
                    <div className="relative w-full sm:w-80">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Cari nama, email, no. rumah..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                        />
                    </div>

                    {/* Add Resident Button */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="w-full sm:w-auto px-5 py-2 bg-primary hover:bg-primary-container text-white font-bold rounded-md-custom text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Tambah Warga Baru</span>
                    </button>
                </div>

                {/* Citizens Table Card */}
                <div className="bg-white dark:bg-slate-900 rounded-md-custom shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                    {filteredCitizens.length === 0 ? (
                        <div className="text-center py-12 text-neutral-text dark:text-slate-400 text-sm">
                            Tidak ditemukan data warga yang sesuai dengan pencarian.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800 text-neutral-text dark:text-slate-300 uppercase text-[10px] tracking-wider font-bold">
                                        <th className="p-4 w-12">Avatar</th>
                                        <th className="p-4">Nama Lengkap</th>
                                        <th className="p-4">No. Rumah</th>
                                        <th className="p-4">Kontak & Email</th>
                                        <th className="p-4">Alamat</th>
                                        <th className="p-4">Status Mei 2026</th>
                                        <th className="p-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                                    {filteredCitizens.map((citizen) => (
                                        <tr key={citizen.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4">
                                                <div className="w-9 h-9 rounded-full bg-secondary-container dark:bg-slate-800 text-primary dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                                                    {citizen.name.charAt(0).toUpperCase()}
                                                </div>
                                            </td>
                                            <td className="p-4 font-semibold text-neutral-dark dark:text-slate-200">
                                                {citizen.name}
                                            </td>
                                            <td className="p-4 font-medium text-neutral-dark dark:text-slate-300">
                                                Rumah No. {citizen.house_number || '-'}
                                            </td>
                                            <td className="p-4 text-xs text-neutral-text dark:text-slate-400">
                                                <span className="block font-semibold text-neutral-dark dark:text-slate-200">{citizen.phone || '-'}</span>
                                                <span className="block text-slate-400 dark:text-slate-500 mt-0.5">{citizen.email}</span>
                                            </td>
                                            <td className="p-4 text-xs text-neutral-text dark:text-slate-400 max-w-xs truncate">
                                                {citizen.address || '-'}
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full ${
                                                    citizen.may_status === 'lunas'
                                                        ? 'bg-green-100 dark:bg-green-950/55 text-green-800 dark:text-green-300'
                                                        : citizen.may_status === 'pending'
                                                        ? 'bg-orange-100 dark:bg-orange-950/55 text-orange-800 dark:text-orange-300'
                                                        : 'bg-red-100 dark:bg-red-950/55 text-red-800 dark:text-red-300'
                                                }`}>
                                                    {citizen.may_status === 'lunas' ? 'Lunas' : citizen.may_status === 'pending' ? 'Pending' : 'Belum Bayar'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(citizen)}
                                                        className="p-1 text-slate-500 dark:text-slate-400 hover:text-primary dark:hover:text-slate-200 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                                                        title="Edit Data"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCitizen(citizen.id)}
                                                        className="p-1 text-red-400 dark:text-red-450 hover:text-red-700 dark:hover:text-red-300 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30 rounded"
                                                        title="Hapus Warga"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* MODAL: ADD CITIZEN */}
            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
                    <div className="bg-white dark:bg-slate-900 rounded-xl-custom shadow-2xl max-w-lg w-full overflow-hidden relative z-10 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-primary p-5 text-white flex items-center justify-between">
                            <h3 className="font-bold text-lg">Tambah Warga RT Baru</h3>
                            <button onClick={() => setShowAddModal(false)} className="text-slate-300 hover:text-white p-1 hover:bg-white/10 rounded-full">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Nama Lengkap *</label>
                                    <input
                                        type="text"
                                        value={addData.name}
                                        onChange={e => setAddData('name', e.target.value)}
                                        placeholder="Nama Lengkap Warga"
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                        required
                                    />
                                    {addErrors.name && <p className="text-2xs text-status-error mt-1">{addErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Email Portal *</label>
                                    <input
                                        type="email"
                                        value={addData.email}
                                        onChange={e => setAddData('email', e.target.value)}
                                        placeholder="email@rt.local"
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                        required
                                    />
                                    {addErrors.email && <p className="text-2xs text-status-error mt-1">{addErrors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Nomor Telepon</label>
                                    <input
                                        type="text"
                                        value={addData.phone}
                                        onChange={e => setAddData('phone', e.target.value)}
                                        placeholder="Contoh: 0812-xxxx-xxxx"
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                    />
                                    {addErrors.phone && <p className="text-2xs text-status-error mt-1">{addErrors.phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Nomor Rumah</label>
                                    <input
                                        type="text"
                                        value={addData.house_number}
                                        onChange={e => setAddData('house_number', e.target.value)}
                                        placeholder="Contoh: A-12"
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                    />
                                    {addErrors.house_number && <p className="text-2xs text-status-error mt-1">{addErrors.house_number}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Alamat Lengkap</label>
                                <textarea
                                    value={addData.address}
                                    onChange={e => setAddData('address', e.target.value)}
                                    placeholder="Alamat Detail Rumah Warga"
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                    rows="3"
                                ></textarea>
                                {addErrors.address && <p className="text-2xs text-status-error mt-1">{addErrors.address}</p>}
                            </div>

                            <p className="text-2xs text-neutral-text dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded border border-slate-100 dark:border-slate-800">
                                ℹ️ Warga baru akan didaftarkan dengan password bawaan: <strong className="text-neutral-dark dark:text-slate-200">password</strong>. Mereka dapat merubah sandi setelah login pertama kali.
                            </p>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-slate-200 dark:border-slate-750 text-neutral-text dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-md-custom text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={addProcessing}
                                    className="px-5 py-2 bg-primary hover:bg-primary-container text-white font-bold rounded-md-custom text-sm shadow-sm disabled:opacity-50"
                                >
                                    {addProcessing ? 'Menyimpan...' : 'Simpan Warga'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: EDIT CITIZEN */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setShowEditModal(false); setSelectedCitizen(null); }} />
                    <div className="bg-white dark:bg-slate-900 rounded-xl-custom shadow-2xl max-w-lg w-full overflow-hidden relative z-10 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-secondary p-5 text-white flex items-center justify-between">
                            <h3 className="font-bold text-lg">Perbarui Data Warga</h3>
                            <button onClick={() => { setShowEditModal(false); setSelectedCitizen(null); }} className="text-slate-300 hover:text-white p-1 hover:bg-white/10 rounded-full">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Nama Lengkap *</label>
                                    <input
                                        type="text"
                                        value={editData.name}
                                        onChange={e => setEditData('name', e.target.value)}
                                        placeholder="Nama Lengkap Warga"
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                        required
                                    />
                                    {editErrors.name && <p className="text-2xs text-status-error mt-1">{editErrors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Email Portal *</label>
                                    <input
                                        type="email"
                                        value={editData.email}
                                        onChange={e => setEditData('email', e.target.value)}
                                        placeholder="email@rt.local"
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                        required
                                    />
                                    {editErrors.email && <p className="text-2xs text-status-error mt-1">{editErrors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Nomor Telepon</label>
                                    <input
                                        type="text"
                                        value={editData.phone}
                                        onChange={e => setEditData('phone', e.target.value)}
                                        placeholder="Contoh: 0812-xxxx-xxxx"
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                    />
                                    {editErrors.phone && <p className="text-2xs text-status-error mt-1">{editErrors.phone}</p>}
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Nomor Rumah</label>
                                    <input
                                        type="text"
                                        value={editData.house_number}
                                        onChange={e => setEditData('house_number', e.target.value)}
                                        placeholder="Contoh: A-12"
                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                    />
                                    {editErrors.house_number && <p className="text-2xs text-status-error mt-1">{editErrors.house_number}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-neutral-dark dark:text-slate-300 mb-1">Alamat Lengkap</label>
                                <textarea
                                    value={editData.address}
                                    onChange={e => setEditData('address', e.target.value)}
                                    placeholder="Alamat Detail Rumah Warga"
                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder-slate-400 rounded-md focus:border-secondary focus:ring-1 focus:ring-secondary text-sm"
                                    rows="3"
                                ></textarea>
                                {editErrors.address && <p className="text-2xs text-status-error mt-1">{editErrors.address}</p>}
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowEditModal(false); setSelectedCitizen(null); }}
                                    className="px-4 py-2 border border-slate-200 dark:border-slate-750 text-neutral-text dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold rounded-md-custom text-sm"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="px-5 py-2 bg-secondary hover:bg-teal-700 text-white font-bold rounded-md-custom text-sm shadow-sm disabled:opacity-50"
                                >
                                    {editProcessing ? 'Menyimpan...' : 'Perbarui Warga'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
