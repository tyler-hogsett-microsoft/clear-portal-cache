import clear from "clear";
import chalk from "chalk";
import figlet from "figlet";

function writeBanner() {
    clear();
    console.log(
        chalk.magentaBright(
            figlet.textSync("clear-portal-cache")
        )
    );
}

export default writeBanner;