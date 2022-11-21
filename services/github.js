import axios from "axios";
import tar from "tar";


const GitHubClient = axios.create({
  baseURL: "https://api.github.com/",
  timeout: 1000,
  headers: {
    Accept: "application/vnd.GitHub.v3+json",
    //'Authorization': 'token <your-token-here> -- https://docs.github.com/pt/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
  },
});
const outputPath = process.cwd()

function typeDir(value) {
  return value.type === "dir";
}

export async function getTemplates() {
  //ref: https://docs.github.com/pt/rest/repos/contents
  const response = await GitHubClient.get(
    "repos/nasph-io/sharkdoc-site-templates/contents/",
    { timeout: 1500 }
  );
  return response.data.filter(typeDir);
}

export async function downloadTemplates(choice) {
  GitHubClient.get(
    "/repos/nasph-io/sharkdoc-site-templates/tags?per_page=1"
  ).then((res) => {
    const hash = res.data[0].commit.sha.slice(0, 7);
    GitHubClient.get("repos/nasph-io/sharkdoc-site-templates/releases/latest")
      .then((res) => {
        const sourceTemplates = res.data.tarball_url;
        axios
          .get(sourceTemplates, { responseType: "stream"})
          .then(({ data }) => {
            data
              .pipe(
                tar.x({strip: 1, C: outputPath}, 
                  [
                  `nasph-io-sharkdoc-site-templates-${hash}/${choice}`,
                  ]
                )
              )
              .on("entry", (entry) => {
              })
              .on("end", function () {
                console.log("All extracted files.");
              })
              .on("close", function (err) {
                console.log("All done!");
              });
          });
      })
      .catch((error) => {
        console.log("Error listing templates:" + error);
      });
  });
}
