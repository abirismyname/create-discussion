import * as core from "@actions/core";

import getInput from "./lib/input";
import { Discussion } from "./lib/discussion";

export default async function run(): Promise<void> {
  try {
    const repositoryId = getInput("repository-id");
    const categoryId = getInput("category-id");
    const title = getInput("title");
    const body = getInput("body");
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
