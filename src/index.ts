import writeBanner from "./write-banner";
import defineProgram from "./define-program";
import program from "commander";
import { launch } from "puppeteer";
import Config from "./config";
import fetch from "node-fetch";

writeBanner();
defineProgram();

if(program.debug) {
    console.log(program.opts());
}

run();

async function run() {
    try {
        const config = program.opts() as Config;
        const token = await getAccessToken(config);
        const response = await fetch(
            `https://portalsitewide-${config.geocode}.portal-infra.dynamics.com/api/v1/powerportal/ClearCache?portalId=${config.portalId}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        const result = await response.text();
        if(result === "true") {
            console.log("Successfully cleared the portal cache.");
        } else {
            throw new Error(`Unexpected result: ${result}`);
        }
        process.exit(0);
    } catch(error) {
        console.error(error);
    }
}

async function getAccessToken(config: Config) {
    const loginUrl = "https://login.microsoftonline.com/common/oauth2/authorize?response_type=token&client_id=a8f7a65c-f5ba-4859-b2d6-df772c264e9d&resource=https%3A%2F%2Fportal.dynamics.com&redirect_uri=https%3A%2F%2Fmake.powerapps.com%2Fauth&response_mode=fragment";

    const browser = await launch();
    const page = (await browser.pages())[0];
    await page.goto(loginUrl);
    const username = await page.waitForSelector("input[type=email][name=loginfmt]");
    await username.type(config.username);
    const nextButton = await page.waitForSelector("input[type=submit][value=Next]");
    await nextButton.click();
    const password = await page.waitForSelector("input[type=password][name=passwd]");
    await password.type(config.password);
    const submitButon = await page.waitForSelector("input[type=submit][value='Sign in']");
    await submitButon.click();
    const staySignedInButton = await page.waitForSelector("input[type=submit][value='Yes']");
    await staySignedInButton.click();
    const response = await page.goto(loginUrl);
    if(response !== null) {
        const referer = response.request().headers()["referer"];
        const accessToken = referer.replace(/.*access_token=([^&]*).*/g, "$1");
        return accessToken;
    } else {
        throw new Error(`${loginUrl} did not return a response`);
    }
}