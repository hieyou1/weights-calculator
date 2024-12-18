import { readdir, writeFile, readFile } from "fs/promises";

for (let i of await readdir(".")) {
    if (i.endsWith(".csv")) {
        let json = {};
        let csv = (await readFile(i, "utf-8")).split("\n");
        csv.shift();
        for (let row of csv) {
            let [date, schedule] = row.split(",");
            switch (schedule) {
                case "LS": {
                    json[date] = ["EB"];
                    break;
                }
                case "100": {
                    json[date] = [];
                    break;
                }
                case "78": {
                    json[date] = ["7", "8"];
                    break;
                }
                case "56": {
                    json[date] = ["5", "6"];
                    break;
                }
                case "34": {
                    json[date] = ["3", "4"];
                    break;
                }
                case "12": {
                    json[date] = ["1", "2"];
                    break;
                }
                default: {
                    console.log("Unparsable:", date);
                    break;
                }
            }
        }
        await writeFile(i.replace("csv", "json"), JSON.stringify(json));
    }
}