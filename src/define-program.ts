import program from "commander";

function defineProgram() {
    program
        .version("0.0.1")
        .description("Command-line application to clear Dynamics Portals cache.")
        .option("-d, --debug", "Output debugging information.")
        .requiredOption("-u, --username <username>", "Username to use for authentication.")
        .requiredOption("-p, --password <password>", "Password to use for authentication.")
        .requiredOption("-i, --portal-id <portalId>", "Clear the cache of the portal with this ID.")
        .requiredOption("-g, --geocode <geocode>", "Geocode of the infrastructure API the Portal exists in.");

    program.parse(process.argv);
}

export default defineProgram;