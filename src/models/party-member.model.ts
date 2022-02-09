/**
 * Single person who spent some money and has some share in party.
 */
export interface PartyMember {
  /**
   * Display name. E.g. 'Max'.
   */
  name: string;
  /**
   * Total money spent by member on its own purchases.
   */
  totalSpent: number;
  /**
   * Member shares in party. Bigger the share - bigger member would cashback to party.
   */
  shares: number;
}