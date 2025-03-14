process.env.GH_TOKEN = "123";

import { Discussion } from "../lib/discussion";

describe("Discussion", () => {
  describe("create", () => {
    it("creates a discussion", async () => {
      const discussion = new Discussion(
        "repositoryId",
        "categoryId",
        "Discussion Title",
        "Discussion body text",
      );
      discussion.octokit.graphql = jest.fn().mockResolvedValue({
        data: {
          createDiscussion: {
            discussion: {
              id: "123",
              url: "https://example.com/discussion/123",
            },
          },
        },
      }) as unknown as typeof discussion.octokit.graphql;
      await discussion.save();

      expect(discussion.id).toEqual("123");
      expect(discussion.url).toEqual("https://example.com/discussion/123");
    });
  });
});
