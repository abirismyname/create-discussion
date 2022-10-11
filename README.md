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
      uses: abirismyname/create-discussion@v1.x
      env:
        GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}      
      with:
        title: Feelings
        body: |
          Let's talk!
        repository-id: ${{ secrets.REPO_ID }}
        category-id: ${{ secrets.CAT_ID }}  
    - name: Print discussion url and id
      run: |
        echo discussion-id: ${{steps.create-discussion.outputs.discussion-id}} 
        echo discussion-url: ${{steps.create-discussion.outputs.discussion-url}}             
```

## Inputs

The following inputs are _required_:

- `title`: The title of the discussion
- `body`: The body of the discussion
- `body-filepath`: The path to a file containing the body of the new discussion (takes precedence over `body`).
- `repository-id`: The ID of the repository for the new discussion
- `category-id`: The ID of the category for the new discussion

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
- :bow: [@imjohnbo](imjohnbo) for the inspiration.
