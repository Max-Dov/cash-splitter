/**
 * RegExps used in application.
 */
export class RegExps {
    /**
     * Never matches anything.
     */
    static readonly NEVER_MATCH_REGEXP = /^\b$/;
    /**
     * Matches to number at start.
     */
    static readonly NUMBER_AT_START = /^[0-9]+/;
    /**
     * Matches to number or number separated with anything by space. E.g. ('100', '100 pizza').
     */
    static readonly NUMBER_WITH_OPTIONAL_WORDS = /^[0-9]+( .*)*$/;
    /**
     * Matches default command to set share. E.g. '10 is my share'
     */
    static readonly SET_MY_SHARE_COMMAND_DEFAULT = /^[0-9]+( is my share).*$/i
    /**
     * Matches default command to count money. E.g. 'Count our money!'
     */
    static readonly COUNT_MONEY_COMMAND_DEFAULT = /Count our money!/i

}