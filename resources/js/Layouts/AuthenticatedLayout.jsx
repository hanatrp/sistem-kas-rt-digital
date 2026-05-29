import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth, flash } = usePage().props;
    const user = auth.user;

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [toast, setToast] = useState(null);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    const toggleDarkMode = () => {
        const nextMode = !isDarkMode;
        setIsDarkMode(nextMode);
        if (nextMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Watch for flash messages
    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    const triggerPanicSimulation = () => {
        alert("🚨 SOS! Sinyal darurat telah disimulasikan. Keamanan RT dan warga sekitar menerima notifikasi bahaya dari Rumah No. " + (user.house_number || "-") + ".");
        setShowEmergencyModal(false);
    };

    const navLinks = [
        {
            name: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            ),
        },
        {
            name: 'Kas & Transaksi',
            href: route('transactions.index'),
            active: route().current('transactions.index') || route().current('transactions.*'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
    ];

    if (user.role === 'admin') {
        navLinks.push({
            name: 'Data Warga',
            href: route('citizens.index'),
            active: route().current('citizens.index') || route().current('citizens.*'),
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ),
        });
    }

    return (
        <div className="min-h-screen bg-surface dark:bg-slate-950 font-sans flex text-neutral-dark dark:text-slate-100 transition-colors duration-200">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-primary text-white h-screen sticky top-0 shrink-0 shadow-lg">
                {/* Logo & Brand Header */}
                <div className="p-6 border-b border-primary-container flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-md-custom">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight tracking-wide">CivicTrust RT</h1>
                        <span className="text-xs text-secondary-container">Sistem Kas Digital</span>
                    </div>
                </div>

                {/* Logged in User Card */}
                <div className="mx-4 my-6 p-4 bg-primary-container rounded-md-custom flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-white text-base">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                            <h4 className="font-semibold text-sm truncate">{user.name}</h4>
                            <p className="text-xs text-slate-300 truncate">{user.email}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-700">
                        <span className="text-2xs text-slate-400">No. Rumah: <strong className="text-white">{user.house_number || '-'}</strong></span>
                        <span className={`px-2 py-0.5 text-2xs font-semibold rounded-full uppercase ${
                            user.role === 'admin' ? 'bg-status-error text-white' : 'bg-secondary text-white'
                        }`}>
                            {user.role === 'admin' ? 'Ketua RT' : 'Warga'}
                        </span>
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-md-custom ${
                                link.active
                                    ? 'bg-secondary text-white shadow-sm'
                                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {link.icon}
                            <span>{link.name}</span>
                        </Link>
                    ))}
                </nav>

                {/* Sidebar Footer / Profile & Log Out */}
                <div className="p-4 border-t border-primary-container space-y-2">
                    <Link
                        href={route('profile.edit')}
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md-custom transition-all duration-200 ${
                            route().current('profile.edit')
                                ? 'bg-secondary text-white'
                                : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Pengaturan Akun</span>
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-300 hover:text-white hover:bg-status-error/20 rounded-md-custom transition-all duration-200 text-left"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Keluar Portal</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Navigation Drawer */}
            <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                {/* Backdrop */}
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
                {/* Drawer Menu */}
                <aside className={`absolute left-0 top-0 bottom-0 w-72 bg-primary text-white flex flex-col transform transition-transform duration-300 ease-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <div className="p-6 border-b border-primary-container flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary rounded-md-custom">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="font-bold text-base leading-tight tracking-wide">CivicTrust RT</h1>
                                <span className="text-2xs text-secondary-container">Sistem Kas Digital</span>
                            </div>
                        </div>
                        <button onClick={() => setIsMobileOpen(false)} className="p-1 rounded-full hover:bg-white/10 text-slate-300 hover:text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="mx-4 my-4 p-4 bg-primary-container rounded-md-custom flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center font-bold text-white text-base">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="font-semibold text-sm truncate">{user.name}</h4>
                                <p className="text-2xs text-slate-300 truncate">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-700">
                            <span className="text-2xs text-slate-400">No. Rumah: <strong className="text-white">{user.house_number || '-'}</strong></span>
                            <span className={`px-2 py-0.5 text-2xs font-semibold rounded-full uppercase ${
                                user.role === 'admin' ? 'bg-status-error text-white' : 'bg-secondary text-white'
                            }`}>
                                {user.role === 'admin' ? 'Ketua RT' : 'Warga'}
                            </span>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMobileOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md-custom transition-all duration-200 ${
                                    link.active
                                        ? 'bg-secondary text-white'
                                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                {link.icon}
                                <span>{link.name}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-primary-container space-y-2">
                        <Link
                            href={route('profile.edit')}
                            onClick={() => setIsMobileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-md-custom"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Pengaturan Akun</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-300 hover:text-white hover:bg-status-error/20 rounded-md-custom text-left"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Keluar Portal</span>
                        </button>
                    </div>
                </aside>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 min-h-screen">
                {/* Mobile Top Bar */}
                <header className="md:hidden bg-primary text-white h-16 flex items-center justify-between px-4 sticky top-0 z-40 shadow-md">
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-2 rounded-md-custom hover:bg-primary-container text-white focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h2 className="font-bold text-base tracking-wide">CivicTrust RT</h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleDarkMode}
                            className="p-2 rounded-md-custom hover:bg-white/10 text-white focus:outline-none transition-colors"
                            title={isDarkMode ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-slate-300 hover:text-white" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                </svg>
                            )}
                        </button>
                        <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center font-bold text-white text-sm">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Desktop Page Title Header */}
                {header && (
                    <header className="bg-white dark:bg-slate-900 border-b border-surface-variant/80 dark:border-slate-800 hidden md:block">
                        <div className="mx-auto max-w-7xl px-8 py-5 flex justify-between items-center">
                            {header}
                            <div className="flex items-center gap-4 text-xs text-neutral-text dark:text-slate-400">
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 rounded-md-custom hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 focus:outline-none transition-colors"
                                    title={isDarkMode ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
                                >
                                    {isDarkMode ? (
                                        <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 text-slate-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                                        </svg>
                                    )}
                                </button>
                                <span className="h-4 w-px bg-slate-200 dark:bg-slate-700"></span>
                                <div>
                                    Hari ini: <span className="font-semibold text-neutral-dark dark:text-slate-200">{new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>
                    </header>
                )}

                {/* Main View Panel */}
                <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto relative pb-24">
                    {/* Toast Notification */}
                    {toast && (
                        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-md-custom shadow-lg border animate-bounce ${
                            toast.type === 'success'
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                                : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                            {toast.type === 'success' ? (
                                <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            )}
                            <span className="text-sm font-medium">{toast.message}</span>
                            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 ml-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {children}
                </main>
            </div>

            {/* Emergency Panic Button */}
            <button
                onClick={() => setShowEmergencyModal(true)}
                className="fixed bottom-6 right-6 z-40 bg-status-error hover:bg-red-700 text-white rounded-full flex items-center justify-center gap-2 px-5 py-4 shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 font-bold tracking-wider text-sm md:text-base cursor-pointer animate-pulse select-none min-h-[56px] min-w-[140px]"
                style={{ boxShadow: '0px 8px 24px rgba(186, 26, 26, 0.4)' }}
            >
                <span className="text-xl animate-bounce">🚨</span>
                <span>DARURAT RT</span>
            </button>

            {/* Emergency Contacts Modal */}
            {showEmergencyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowEmergencyModal(false)} />
                    <div className="bg-white dark:bg-slate-900 rounded-xl-custom shadow-2xl max-w-md w-full overflow-hidden relative z-10 border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-status-error p-6 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">🚨</span>
                                <div>
                                    <h3 className="font-bold text-lg">Pusat Darurat CivicTrust</h3>
                                    <p className="text-2xs text-red-100">Hubungi atau kirimkan sinyal darurat segera</p>
                                </div>
                            </div>
                            <button onClick={() => setShowEmergencyModal(false)} className="text-white/80 hover:text-white p-1 hover:bg-white/10 rounded-full">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            <p className="text-sm text-neutral-text dark:text-slate-300">
                                Jika terjadi masalah mendesak di lingkungan RT (Keamanan, Kebakaran, Kesehatan), silakan gunakan kontak di bawah ini atau picu tombol alarm simulasi.
                            </p>

                            <div className="space-y-3">
                                {/* Ketua RT */}
                                <div className="flex items-center justify-between p-3 bg-surface dark:bg-slate-800/60 rounded-md-custom border border-surface-variant dark:border-slate-700/60">
                                    <div>
                                        <h5 className="font-semibold text-sm text-neutral-dark dark:text-slate-200">Ketua RT (Admin)</h5>
                                        <p className="text-xs text-neutral-text dark:text-slate-400">Pak RT - 0812-3456-7890</p>
                                    </div>
                                    <a href="tel:081234567890" className="p-2 bg-secondary text-white rounded-full hover:bg-secondary-container hover:text-primary dark:hover:bg-teal-500/20 dark:hover:text-secondary-container transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </a>
                                </div>

                                {/* Pos Satpam */}
                                <div className="flex items-center justify-between p-3 bg-surface dark:bg-slate-800/60 rounded-md-custom border border-surface-variant dark:border-slate-700/60">
                                    <div>
                                        <h5 className="font-semibold text-sm text-neutral-dark dark:text-slate-200">Pos Satpam & Keamanan</h5>
                                        <p className="text-xs text-neutral-text dark:text-slate-400">Jaga Malam - 0812-9988-7766</p>
                                    </div>
                                    <a href="tel:081299887766" className="p-2 bg-secondary text-white rounded-full hover:bg-secondary-container hover:text-primary dark:hover:bg-teal-500/20 dark:hover:text-secondary-container transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </a>
                                </div>

                                {/* Damkar */}
                                <div className="flex items-center justify-between p-3 bg-surface dark:bg-slate-800/60 rounded-md-custom border border-surface-variant dark:border-slate-700/60">
                                    <div>
                                        <h5 className="font-semibold text-sm text-neutral-dark dark:text-slate-200">Pemadam Kebakaran</h5>
                                        <p className="text-xs text-neutral-text dark:text-slate-400">Emergency Call - 113</p>
                                    </div>
                                    <a href="tel:113" className="p-2 bg-secondary text-white rounded-full hover:bg-secondary-container hover:text-primary dark:hover:bg-teal-500/20 dark:hover:text-secondary-container transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>

                            {/* Panic Button Simulation Action */}
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={triggerPanicSimulation}
                                    className="w-full bg-status-error hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md-custom shadow-md hover:scale-102 transition-all flex items-center justify-center gap-2"
                                >
                                    <span>📢</span>
                                    <span>SIMULASIKAN ALARM SOS</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
