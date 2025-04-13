import _ from 'lodash'

export const formatCurrencyConvert = (num) => {
    if (_.isNil(num)) return '0';
    if (num >= 1e7) return (num / 1e7).toFixed(1) + 'Cr';
    if (num >= 1e5) return (num / 1e5).toFixed(1) + 'L'; 
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
}