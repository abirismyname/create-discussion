import { getInput } from "@actions/core";
import { getOctokit } from "@actions/github";

const token = getInput("github-token") || process.env.GH_TOKEN;

if (token == "") {
  throw new Error("Either github-token (with) or GH_TOKEN (env) must be set");
}

export const octokit = getOctokit(token);
