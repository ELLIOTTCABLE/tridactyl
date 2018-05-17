import * as config from "./config"

/**
 * Expands the alias in the provided exstr recursively. Does nothing if
 * the command is not aliased, including when the command is invalid.
 * Returns another string.
 *
 * @param exstr :exstr typed by the user on the command line
 */
export function expandExstr(
    exstr: string,
    aliases = config.get("exaliases"),
    prevExpansions: string[] = [],
): string {
    // Split on whitespace
    let [command, ...args] = exstr.trim().split(/ +/)

    // Handle initial (extra) colon
    if (command[0] === ":") {
        command = command.substring(1)
    }

    return expandExarr([command, ...args]).join(" ")
}

/**
 * Expands the alias in the provided exstr recursively. Does nothing if
 * the command is not aliased, including when the command is invalid.
 * Expects, and returns, an array of `command, ...args`.
 *
 * @param exarr :exstr typed by the user on the command line
 */
export function expandExarr(
    exarr: string[],
    aliases = config.get("exaliases"),
    prevExpansions: string[] = [],
): string[] {
    const command = exarr[0]

    // Base case: alias not found; return original command
    if (aliases[command] === undefined) {
        return exarr
    }

    // Infinite loop detected
    if (prevExpansions.includes(command)) {
        throw `Infinite loop detected while expanding aliases. Stack: ${prevExpansions}.`
    }

    // Add command to expansions used so far
    prevExpansions.push(command)

    exarr[0] = aliases[command]

    // Alias exists; expand it recursively
    return expandExarr(exarr, aliases, prevExpansions)
}
