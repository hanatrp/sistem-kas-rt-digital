import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary via-primary-container to-secondary p-4 sm:p-6 font-sans">
            {/* Branding Header */}
            <div className="mb-8 text-center flex flex-col items-center gap-3">
                <Link href="/" className="inline-block p-3.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl-custom shadow-lg hover:scale-105 transition-transform duration-200">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </Link>
                <div>
                    <h1 className="text-white font-bold text-2xl tracking-wide">CivicTrust RT</h1>
                    <p className="text-slate-300 text-xs mt-1">Sistem Portal Keuangan & Informasi Kas RT Digital</p>
                </div>
            </div>

            {/* Login Card Form Container */}
            <div className="w-full sm:max-w-md overflow-hidden bg-white/95 dark:bg-slate-900/95 dark:border-slate-800 dark:text-slate-100 backdrop-blur-md px-8 py-8 shadow-2xl rounded-lg-custom border border-white/20" style={{ boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.15)' }}>
                {children}
            </div>

            {/* Footer metadata */}
            <div className="mt-8 text-center text-2xs text-slate-300">
                &copy; {new Date().getFullYear()} CivicTrust RT Digital. Semua Hak Dilindungi.
            </div>
        </div>
    );
}
