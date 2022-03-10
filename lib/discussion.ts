import * as core from "@actions/core";
import Resource from "./resource";

export class Discussion extends Resource {
  url: string;
  id: string;
  constructor(
    readonly repositoryId: string,
    readonly categoryId: string,
    readonly title: string,
    readonly body: string
  ) {
    super();
  }

  async load(): Promise<void> {
    throw new Error("Not implemented");
  }

  async update(): Promise<void> {
    throw new Error("Not implemented");
  }

  async save(): Promise<void> {
    type ResponseShape = {
      data: {
        createDiscussion: {
          discussion: {
            id: string;
            url: string;
          };
        };
      };
    };

    const response = await this.graphql(
      `mutation CreateDiscussion(
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
      }
      `,
      {
        body: this.body,
        title: this.title,
        repositoryId: this.repositoryId,
        categoryId: this.categoryId,
      }
    );
    this.id = (response.data as ResponseShape).data.createDiscussion.discussion.id;
    this.url = (response.data as ResponseShape).data.createDiscussion.discussion.url;

    this.debug(`Discussion Created id: ${this.id}, url: ${this.url}`);
  }
}
