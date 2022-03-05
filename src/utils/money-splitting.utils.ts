import {MemberCashback} from '../models/member-cashback.model';
import {PartyMember} from '../models/party-member.model';

/**
 * Resolve how much of cashback and cashin every party member has.
 */
export const resolvePartyCashback = (members: PartyMember[]): MemberCashback[] => {
    const [
        partyTotalSpent,
        partyTotalShares,
    ] = members.reduce((
            [spent, shares],
            member,
        ) => [spent + member.totalSpent, shares + member.shares],
        [0, 0],
    );
    return members.map(({
        name,
        totalSpent: memberTotalSpent,
        shares,
        loanToParty,
        totalLoaned,
    }) => {
        const memberToPartySharesRatio = shares / partyTotalShares;
        const cashback = memberTotalSpent * (1 - memberToPartySharesRatio) + (totalLoaned || 0);
        const cashin = (partyTotalSpent - memberTotalSpent) * memberToPartySharesRatio + (loanToParty || 0);
        return {name, cashback, cashin};
    });
};
