import { PartyMember } from "./party-member.model";

/**
 * Party containing all it's members who split money.
 */
export interface Party {
  /**
   * Party members involved.
   */
  members: PartyMember[];
  /**
   * Sum of totalSpent field from all party members. 
   */
  totalSpent: PartyMember['totalSpent'];
  /**
   * Sum of shares field from all party members. 
   */
  totalShares: PartyMember['share'];
}