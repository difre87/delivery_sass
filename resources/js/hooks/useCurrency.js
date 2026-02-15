import { usePage } from '@inertiajs/react';
import { formatCurrency, getCurrencySymbol } from '@/Utils/currency';

/**
 * Hook to get company currency and formatting utilities
 */
export const useCurrency = () => {
    const { auth } = usePage().props;
    const currencyCode = auth?.currentCompany?.currency || 'EUR';
    
    return {
        currencyCode,
        symbol: getCurrencySymbol(currencyCode),
        format: (amount, options = {}) => formatCurrency(amount, currencyCode, options),
        formatCents: (cents, options = {}) => formatCurrency(cents, currencyCode, { ...options, fromCents: true, decimals: 0 }),
    };
};
