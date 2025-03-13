export const formatUnitNames = (configurations: { unit_name: string  |undefined |null}[] | undefined) => {
    const uniqueUnits = new Set<string>();
    let rkUnit = "";
    const bhkUnits: string[] = [];

    configurations?.forEach(({ unit_name }) => {
        if (!uniqueUnits.has(unit_name? unit_name :'')) {
            uniqueUnits.add(unit_name? unit_name :'');
            if (unit_name === "1 RK") {
                rkUnit = unit_name;
            } else {
                const match = unit_name?.match(/^(\d+\+?)\sBHK$/);
                if (match) {
                    bhkUnits.push(match[1]);
                }
            }
        }
    });

    // Sort BHK units numerically
    bhkUnits.sort((a, b) => parseInt(a) - parseInt(b));

    return rkUnit
        ? `${rkUnit}, ${bhkUnits.join(", ")} BHK`
        : `${bhkUnits.join(", ")} BHK`;
};

// Example usage:
// const configuration = [
//     { unit_name: "5+ BHK" },
//     { unit_name: "3 BHK" },
//     { unit_name: "2 BHK" },
//     { unit_name: "3 BHK" },
//     { unit_name: "4 BHK" },
//     { unit_name: "1 RK" },
// ];

// console.log(formatUnitNames(configuration)); 
// Output: "1 RK, 2, 3, 4, 5+ BHK"
