export function TruthTable({ raw }) {
    const rows = Array.from({ length: 8 }, (_, i) => {
        const x = (i >> 2) & 1;
        const y = (i >> 1) & 1;
        const z = i & 1;
        return { i, x, y, z, f: raw[i] };
    });
    return (<table style={{ borderCollapse: "collapse", textAlign: "center" }}>
            <thead>
                <tr>
                    <th style={{ border: "1px solid black", padding: "4px 8px" }}>x</th>
                    <th style={{ border: "1px solid black", padding: "4px 8px" }}>y</th>
                    <th style={{ border: "1px solid black", padding: "4px 8px" }}>z</th>
                    <th style={{ border: "1px solid black", padding: "4px 8px" }}>f</th>
                </tr>
            </thead>
            <tbody>
                {rows.map(({ i, x, y, z, f }) => (<tr key={i}>
                        <td style={{ border: "1px solid black", padding: "4px 8px" }}>{x}</td>
                        <td style={{ border: "1px solid black", padding: "4px 8px" }}>{y}</td>
                        <td style={{ border: "1px solid black", padding: "4px 8px" }}>{z}</td>
                        <td style={{ border: "1px solid black", padding: "4px 8px" }}>{f}</td>
                    </tr>))}
            </tbody>
        </table>);
}
