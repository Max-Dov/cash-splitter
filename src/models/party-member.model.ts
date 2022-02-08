/**
 * Single person who spent some money and has some share in party.
 */
export interface PartyMember {
  /**
   * Display name. E.g. 'Max'.
   */
  name: string;
  /**
   * Total money spent by member on it's own purchases.
   */
  totalSpent: number;
  /**
   * Member share in party. Bigger the share - bigger member would cashback to party.
   */
  share: number;
}