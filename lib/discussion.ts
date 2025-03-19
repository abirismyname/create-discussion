import { getInput, info } from "@actions/core";
import { getOctokit } from "@actions/github";
import type { GraphQlQueryResponseData } from "@octokit/graphql";

const createDiscussionMutation = `
  mutation CreateDiscussion(
    $body: String!
    $title: String!
    $repositoryId: ID!
    $categoryId: ID!
  ) {
    # input type: CreateDiscussionInput
    createDiscussion(
      input: {
        repositoryId: $repositoryId
        categoryId: $categoryId
        body: $body
        title: $title
      }
    ) {
      # response type: CreateDiscussionPayload
      discussion {
        id
        url
      }
    }
  }`;

export class Discussion {
  repositoryId: string;
  categoryId: string;
  title: string;
  body: string;
  id: string;
  url: string;
  octokit = getOctokit(getInput("github-token") || process.env.GH_TOKEN);

  constructor(
    repositoryId: string,
    categoryId: string,
    title: string,
    body: string,
  ) {
    this.repositoryId = repositoryId;
    this.categoryId = categoryId;
    this.title = title;
    this.body = body;
  }

  async save(): Promise<void> {
    const response: GraphQlQueryResponseData = await this.octokit.graphql(
      createDiscussionMutation,
      {
        repositoryId: this.repositoryId,
        categoryId: this.categoryId,
        title: this.title,
        body: this.body,
      },
    );

    if (
      !response ||
      !response.createDiscussion ||
      !response.createDiscussion.discussion
    ) {
      throw new Error(
        `Failed to create discussion. Response: ${JSON.stringify(response)}`,
      );
    }

    this.id = response.createDiscussion.discussion.id;
    this.url = response.createDiscussion.discussion.url;

    info(`Discussion Created id: ${this.id}, url: ${this.url}`);
  }
}
