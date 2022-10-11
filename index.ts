import * as core from "@actions/core";

import getInput from "./lib/input";
import { Discussion } from "./lib/discussion";
const fs = require('fs')

export default async function run(): Promise<void> {
  try {
    const repositoryId = getInput("repository-id");
    const categoryId = getInput("category-id");
    const title = getInput("title");
    var body = getInput("body");
    const body_filepath = getInput("body-filepath");
    //if body-filepath is set, use it instead of body
    if (body_filepath) {
      body = fs.readFileSync(body_filepath, "utf8");
    }
    // Load Discussion details
    const discussion = new Discussion(repositoryId, categoryId, title, body);
    await discussion.save();

    // Set commit sha output
    core.setOutput("discussion-id", discussion.id);
    core.setOutput("discussion-url", discussion.url);
  } catch (e) {
    core.debug(e.stack);
    core.setFailed(e);
  }
}

run();
