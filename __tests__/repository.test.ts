import { Repository } from "../lib/repository";
import { octokit } from "../lib/octokit";

jest.mock("../lib/octokit", () => ({
  octokit: {
    graphql: jest.fn(),
  },
}));

describe("Repository", () => {
  const mockOwner = "test-owner";
  const mockName = "test-repo";
  const mockRepoId = "repo-id-123";
  const mockCategories = [
    { id: "cat-1", name: "General" },
    { id: "cat-2", name: "Announcements" },
  ];

  let repository: Repository;

  beforeEach(() => {
    repository = new Repository(`${mockOwner}/${mockName}`);
    jest.clearAllMocks();
  });

  test("getId retrieves and sets the repository ID", async () => {
    (octokit.graphql as unknown as jest.Mock).mockResolvedValue({
      repository: { id: mockRepoId },
    });

    const id = await repository.getId();

    expect(id).toBe(mockRepoId);
    expect(repository.id).toBe(mockRepoId);
    expect(octokit.graphql).toHaveBeenCalledWith(
      expect.stringContaining("query RepositoryId"),
      { owner: mockOwner, name: mockName },
    );
  });

  test("getCategories retrieves and sets discussion categories", async () => {
    (octokit.graphql as unknown as jest.Mock).mockResolvedValue({
      repository: { discussionCategories: { nodes: mockCategories } },
    });

    const categories = await repository.getCategories();

    expect(categories).toEqual(mockCategories);
    expect(repository.categories).toEqual(mockCategories);
    expect(octokit.graphql).toHaveBeenCalledWith(
      expect.stringContaining("query RepositoryCategories"),
      { name: mockName, owner: mockOwner },
    );
  });

  test("getCategoryId retrieves the ID of a specific category", async () => {
    repository.categories = mockCategories;

    const categoryId = await repository.getCategoryId("General");

    expect(categoryId).toBe("cat-1");
  });

  test("getCategoryId throws an error if the category is not found", async () => {
    repository.categories = mockCategories;

    await expect(repository.getCategoryId("Nonexistent")).rejects.toThrow(
      'Category "Nonexistent" not found',
    );
  });

  test("getCategoryId fetches categories if not already loaded", async () => {
    (octokit.graphql as unknown as jest.Mock).mockResolvedValue({
      repository: { discussionCategories: { nodes: mockCategories } },
    });

    const categoryId = await repository.getCategoryId("General");

    expect(categoryId).toBe("cat-1");
    expect(octokit.graphql).toHaveBeenCalledWith(
      expect.stringContaining("query RepositoryCategories"),
      { name: mockName, owner: mockOwner },
    );
  });
});
