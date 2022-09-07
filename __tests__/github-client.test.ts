import github from "../lib/github-client";

describe("github-client", () => {
  test("user-agent", () => {
    const ua = github.defaults.headers["user-agent"];
    expect(ua).toMatch(/^@abirismyname\/create-discussion\/\d+\.\d+\.\d+$/);
  });
});
