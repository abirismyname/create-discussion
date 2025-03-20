import { info } from "@actions/core";
import { octokit } from "./octokit";
import type { GraphQlQueryResponseData } from "@octokit/graphql";

export type Category = {
  id: string;
  name: string;
};

export class Repository {
  owner: string;
  name: string;
  id: string;
  categories: Category[];

  constructor(nwo: string) {
    const [owner, name] = nwo.split("/");
    if (!owner || !name) {
      throw new Error(`Invalid repository name: ${nwo}`);
    }

    this.owner = owner;
    this.name = name;
    this.id = "";
    this.categories = [];
  }

  async getId(): Promise<string> {
    info(`Fetching repository ID for ${this.owner}/${this.name}`);
    const response: GraphQlQueryResponseData = await octokit.graphql(
      `query RepositoryId($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          id
        }
      }`,
      {
        owner: this.owner,
        name: this.name,
      },
    );

    this.id = response.repository.id;
    info(`Repository ID retrieved: ${this.id}`);
    return this.id;
  }

  async getCategories(): Promise<Category[]> {
    info(
      `Fetching discussion categories for repository: ${this.owner}/${this.name}`,
    );
    const response: GraphQlQueryResponseData = await octokit.graphql(
      `query RepositoryCategories($name: String!, $owner: String!) {
        repository(owner: $owner, name: $name) {
          discussionCategories(first: 100) {
            nodes {
              id
              name
            }
          }
        }
      }`,
      {
        owner: this.owner,
        name: this.name,
      },
    );

    this.categories = response.repository.discussionCategories.nodes;
    return this.categories;
  }

  async getCategoryId(categoryName: string): Promise<string> {
    if (this.categories.length === 0) {
      await this.getCategories();
    }

    const category = this.categories.find((cat) => cat.name === categoryName);
    if (!category) {
      info(
        `Available categories: ${this.categories.map((cat) => cat.name).join(", ")}`,
      );
      throw new Error(`Category "${categoryName}" not found`);
    }

    info(`Category "${categoryName}" found with ID: ${category.id}`);
    return category.id;
  }
}
