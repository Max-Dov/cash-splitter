import {PartyMember} from './party-member.model';

/**
 * Party info.
 */
export interface Party {
    /**
     * Party members who participated at least in one transaction.
     */
    partyMembers: PartyMember[];
}