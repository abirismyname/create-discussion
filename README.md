# Create-Discussion

Create a new GitHub Discussion with GitHub Actions

 ![](https://github.com/abirismyname/create-discussion/workflows/tests/badge.svg) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## About

This action allows you to create a new GitHub Discussion with GitHub Actions.

## Usage

In your workflow, to create a new discussion, include a step like this:

```yaml
    - name: Create a new GitHub Discussion
      id: create-discussion
      uses: abirismyname/create-discussion@main   
      with:
        title: Feelings
        body: |
          Let's talk!
        category-name: Your Category              #optional, defaults to "General"
        repository-name: owner/repo               #optional, defaults to the current repository
        github-token: ${{ secrets.GITHUB_TOKEN }} 
```

If you know the `repository-id` and `category-id`, you can use them directly to create a discussion, which will speed things up slightly:

```yaml
    - name: Create a new GitHub Discussion
      id: create-discussion
      uses: abirismyname/create-discussion@main   
      with:
        title: Feelings
        body: |
          Let's talk!
        repository-id: R_asdf1234
        category-id: DIC_asdf1234
        github-token: ${{ secrets.GITHUB_TOKEN }}
```

The Action returns the `discussion-id` and `discussion-url` as outputs, which you can use in subsequent steps. For example, to print the discussion URL and ID:

```yaml
    - name: Create a new GitHub Discussion
      id: create-discussion
      uses: abirismyname/create-discussion@main   
      with:
        title: Feelings
        body: |
          Let's talk!
        repository-id: R_asdf1234
        category-id: DAC_asdf1234
        github-token: ${{ secrets.GITHUB_TOKEN }}

    - name: Print discussion url and id
      run: |
        echo discussion-id: ${{steps.create-discussion.outputs.discussion-id}} 
        echo discussion-url: ${{steps.create-discussion.outputs.discussion-url}}
```

## Inputs

The Action accepts the following inputs:

- `title`: The title of the discussion (Required)
- `body`: The body of the discussion (Required, if `body-filepath` is not provided)
- `body-filepath`: The path to a file containing the body of the new discussion (Required, if `body` is not provided. Takes precedence over `body`).
- `repository-id`: The ID of the repository for the new discussion
- `category-id`: The ID of the category for the new discussion.
- `repository-name`: The name of the repository (owner/repo) for the new discussion (Optional, defaults to the current repository)
- `category-name`: The name of the category for the new discussion (Optional, defaults to "General" if the category-id is not provided)
- `github-token`: The GitHub token to use for authentication (Required, unless `GH_TOKEN` is passed as an `env` variable).

Note: If you are using `body-filepath` be sure to add a `actions/checkout` action before this action in the workflow to make sure the file exists in the action workspace.

### Obtaining the `repository-id` and `category-id`

You can find `repository-id` and `category-id` using [GitHub's GraphQL Explorer](https://docs.github.com/en/graphql/overview/explorer). Replace `<REPO_NAME>` and `<REPO_OWNER>` with the repo you want to update.

```graphql
query MyQuery {
  repository(name: "<REPO_NAME>", owner: "<REPO_OWNER>") {
    id
    discussionCategories(first: 10) {
      edges {
        node {
          id
          name
        }
        cursor
      }
    }
  }
}
```

## Outputs

This action provides the following outputs:

- `discussion-id`: ID of created discussion
- `discussion-url`: URL of created discussion

## Example

This repo contains an example [workflow](https://github.com/abirismyname/create-discussion/blob/main/.github/workflows/example.yml) that contains this action.

## Credits

- :bow: Based on [swinton/commit](https://github.com/swinton/commit).
- :bow: [@imjohnbo](github.com/imjohnbo) for the inspiration.
- :bow: [@benbalter](github.com/benbalter) for modernizing and adding much needed new features
