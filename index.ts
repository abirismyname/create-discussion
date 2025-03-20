import * as core from "@actions/core";
import { getInput } from "@actions/core";
import fs from "fs";
import { Discussion } from "./lib/discussion";
import { Repository } from "./lib/repository";

function getRepo(): Repository {
  const repository = getInput("repository-name", { required: true });
  return new Repository(repository);
}

async function getRepositoryId(): Promise<string> {
  const repositoryId = getInput("repository-id", { required: false });
  if (repositoryId !== "") {
    return repositoryId;
  }

  const repo = getRepo();
  return await repo.getId();
}

async function getCategoryId(): Promise<string> {
  const categoryId = getInput("category-id", { required: false });
  if (categoryId !== "") {
    return categoryId;
  }

  const categoryName = getInput("category-name", { required: false });
  if (categoryName === "") {
    throw new Error("Either category-id or category-name must be set");
  }

  const repo = getRepo();
  const categories = await repo.getCategories();
  return repo.getCategoryId(categoryName);
}

export default async function run(): Promise<void> {
  const repositoryId = await getRepositoryId();
  const categoryId = await getCategoryId();
  const title = getInput("title", { required: true });
  let body = getInput("body");
  const body_filepath = getInput("body-filepath");

  //if body-filepath is set, use it instead of body
  if (body_filepath) {
    try {
      body = fs.readFileSync(body_filepath, "utf8");
    } catch (e) {
      core.setFailed(`Failed to read body-filepath: ${e.message}`);
      return;
    }
  }

  if (body == "") {
    core.setFailed("Either body or body-filepath must be set");
    return;
  }

  // Load Discussion details
  const discussion = new Discussion(repositoryId, categoryId, title, body);
  await discussion.save();

  // Set discussion ID and URL output
  core.setOutput("discussion-id", discussion.id);
  core.setOutput("discussion-url", discussion.url);
}

try {
  run();
} catch (e) {
  core.debug(e.stack);
  core.setFailed(e);
}
