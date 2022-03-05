/**
 * Prepares human-readable money representation.
 * @param moneyAmount - money to display
 * @param decimalNumbers - amount of decimal numbers
 */
export const formatCurrency = (moneyAmount: number | string, decimalNumbers: number = 2) => {
    const currencyLabel = process.env.MONEY_CURRENCY_LABEL as string;
    const shouldLabelPrependMoney = process.env.MONEY_CURRENCY_LABEL_PREPENDS_AMOUNT;
    return shouldLabelPrependMoney
        ? currencyLabel + truncateNumber(Number(moneyAmount), decimalNumbers)
        : truncateNumber(Number(moneyAmount), decimalNumbers) + currencyLabel;
};

const truncateNumber = (number: number, decimalNumbers: number) => {
    const multiplayer = 10**decimalNumbers;
    return Math.trunc(number * multiplayer) / multiplayer;
}