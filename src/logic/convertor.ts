// import { ValidationError } from "./error";

// export function convertor(raw: string) {
//     const match = raw.trimStart().match(/^([01]{8}|([01] ){7}[01])/);

//     if (!match) {
//         throw new ValidationError("Incorrect format", 500);
//     }

//     const vector: number[] = Array.from(match[0].replace(/ /g, ""), char => +char);
//     return vector;
// }
     
import { ValidationError } from "./error";

export function convertor(raw: string) {
    const match = raw.match(/[01]{8}/);

    if (!match) {
        throw new ValidationError("Incorrect format", 500);
    }

    const vector: number[] = Array.from(match[0], char => +char);
    return vector;
}