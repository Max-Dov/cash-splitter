/**
 * Single person who spent some money and has some share in party.
 */
export interface PartyMember {
  /**
   * Display name. E.g. 'Max'.
   */
  name: string;
  /**
   * Username to call user by. E.g. 'max_dov'.
   * TODO implement linking user to it's username
   */
  username: string;
  /**
   * Total money spent by member on its own purchases.
   */
  totalSpent: number;
  /**
   * Member shares in party. Bigger the share - bigger member would cashback to party.
   */
  shares: number;
  /**
   * Total money loaned to party members.
   */
  loanToParty?: number;
  /**
   * Total money loaned from party members.
   */
  totalLoaned?: number;
}