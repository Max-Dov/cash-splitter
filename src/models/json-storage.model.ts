/**
 * Storage structure.
 * Note: it IS mutated during application use.
 */
import {PartyMember} from './party-member.model';

export interface JsonStorage {
    partyMembers: PartyMember[]
}