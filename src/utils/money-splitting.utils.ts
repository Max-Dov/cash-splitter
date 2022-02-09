import {MemberCashback} from '../models/member-cashback.model';
import {Party} from '../models/party.model';

/**
 * Resolve how much of cashback and cashin every party member has.
 */
export const resolvePartyCashback = ({
    members,
    totalSpent,
    totalShares,
}: Party): MemberCashback[] =>
    members.map(({
        name,
        totalSpent: memberTotalSpent,
        shares,
    }) => {
        const memberToPartySharesRatio = shares / totalShares;
        const cashback = memberTotalSpent * (1 - memberToPartySharesRatio);
        const cashin = totalSpent * memberToPartySharesRatio;
        return {name, cashback, cashin};
    });