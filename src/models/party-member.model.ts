import {JsonStorage} from './json-storage.model';

/**
 * Single person who spent some money and has some share in party.
 */
export interface PartyMember {
  /**
   * Username to call user by. E.g. '@max_dov'.
   */
  username: string;
  /**
   * Total money spent by member.
   */
  totalSpent: {
    [currencyName in JsonStorage['supportedCurrencies'][number]]: number
  };
  /**
   * Total money member ows to company.
   */
  totalOwed: {
    [currencyName in JsonStorage['supportedCurrencies'][number]]: number
  };
  /**
   * Member shares in party. Bigger the share - bigger member would cashback to party.
   */
  shares: number;
}