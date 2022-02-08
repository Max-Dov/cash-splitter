import { PartyMember } from "./party-member.model";

/**
 * Single party member cashback. Also contains cashin (money member has to give to group). 
 * Trivia: If cashback is smaller than cashin, that means no moneys for member :(
 */
export interface MemberCashback {
  /**
   * Display name. E.g. 'Max'.
   */
  name: PartyMember['name'];
  /**
   * Cashback amount for member.
   */
  cashback: PartyMember['totalSpent'];
  /**
   * Payout amount from a member to a party.
   */
  cashin: PartyMember['totalSpent'];
}