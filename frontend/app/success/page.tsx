// app/success/page.tsx
'use client';

import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-primary-white px-4 py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-red mx-auto mb-4"></div>
                    <p className="text-primary-gray">Loading...</p>
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}