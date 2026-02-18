/**
 * Get currency symbol based on currency code
 */
export const getCurrencySymbol = (currencyCode) => {
    const symbols = {
        'EUR': '€',
        'USD': '$',
        'GBP': '£',
        'MAD': 'DH',
        'CHF': 'CHF',
        'CAD': '$',
        'XOF': 'FCFA',
    };
    
    return symbols[currencyCode] || currencyCode;
};

/**
 * Format amount with currency
 */
export const formatCurrency = (amount, currencyCode = 'EUR', options = {}) => {
    const {
        decimals = 2,
        spaceBetween = true,
        symbolFirst = false,
        fromCents = false, // If true, divide by 100
    } = options;
    
    const symbol = getCurrencySymbol(currencyCode);
    const actualAmount = fromCents ? (amount ?? 0) / 100 : amount;
    
    // Format avec séparateurs de milliers
    const formattedAmount = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(actualAmount);
    
    const space = spaceBetween ? ' ' : '';
    
    // For XOF (FCFA), USD, CAD - symbol after the amount
    // For EUR, GBP, CHF - symbol can be before or after (we'll use after for consistency)
    // MAD (DH) - symbol after
    
    if (symbolFirst) {
        return `${symbol}${space}${formattedAmount}`;
    }
    
    return `${formattedAmount}${space}${symbol}`;
};

/**
 * Get currency label for form dropdown
 */
export const getCurrencyLabel = (currencyCode) => {
    const labels = {
        'EUR': 'Euro (€) - EUR',
        'USD': 'Dollar américain ($) - USD',
        'GBP': 'Livre sterling (£) - GBP',
        'MAD': 'Dirham marocain (DH) - MAD',
        'CHF': 'Franc suisse (CHF) - CHF',
        'CAD': 'Dollar canadien ($) - CAD',
        'XOF': 'Franc CFA (FCFA) - XOF',
    };
    
    return labels[currencyCode] || currencyCode;
};
