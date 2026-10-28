export function GetPDNF(raw: Array<number>): string {
        if (!raw.includes(1)) {
        return("Косяк")
    }
    const minterms: string[] = []

    for (let i = 0; i < 8; i++) {
        if (raw[i] !== 1) continue;

        const x = (i >> 2) & 1
        const y = (i >> 1) & 1
        const z = i & 1

        const term = [
            x ? "x" : "¬x",
            y ? "y" : "¬y",
            z ? "z" : "¬z"
        ].join("∧")

        minterms.push("(" + term + ")")
    }

    return minterms.length ? minterms.join(" ∨ ") : "0";
}

export function GetPCNF(raw: Array<number>): string {
    if (!raw.includes(0)) {
        return("Косяк")
    }
    const maxterms: string[] = []

    for (let i = 0; i < 8; i++) {
        if (raw[i] !== 0) continue;

        const x = (i >> 2) & 1
        const y = (i >> 1) & 1
        const z = i & 1;

        const term = [
            x ? "¬x" : "x",
            y ? "¬y" : "y",
            z ? "¬z" : "z"
        ].join("∨");

        maxterms.push("(" + term + ")")
    }

    return maxterms.length ? maxterms.join(" ∧ ") : "1";
}