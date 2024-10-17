import requests
import os
from slugify import slugify
import json
from markdownify import markdownify as md
from urllib.parse import urlparse

# WordPress GraphQL API endpoint
GRAPHQL_ENDPOINT = os.getenv("API_URL")


# Directory where MDX files will be saved
MDX_OUTPUT_DIR = "./content/direction"
# Directory where images will be saved
IMAGE_OUTPUT_DIR = "./public/img"

# GraphQL query to fetch WordPress posts
QUERY = """
query datazz {
  direction {
    edges {
      node {
        id
        slug
        uri
        title
        excerpt
        content
        date
        featuredImage {
          node {
            altText
            sourceUrl
          }
        }
      }
    }
  }
}
"""


def fetch_posts():
    """Fetch posts from the WordPress GraphQL API."""
    response = requests.post(GRAPHQL_ENDPOINT, json={"query": QUERY})
    response.raise_for_status()
    data = response.json()
    return data["data"]["direction"]["edges"]


def download_image(image_url):
    """Download an image and save it to the public/img directory."""
    parsed_url = urlparse(image_url)
    image_name = os.path.basename(parsed_url.path)
    image_path = os.path.join(IMAGE_OUTPUT_DIR, image_name)

    # Download the image
    response = requests.get(image_url)
    response.raise_for_status()

    # Save the image to the specified path
    with open(image_path, "wb") as f:
        f.write(response.content)
    print(f"Downloaded image: {image_name}")

    # Return the path relative to the public directory
    return f"/img/{image_name}"


def convert_html_to_mdx(html_content):
    """Convert HTML content to MDX (Markdown)."""
    # Convert HTML to Markdown using markdownify
    markdown_content = md(html_content, heading_style="ATX")
    return markdown_content


def create_mdx_file(post):
    """Create an MDX file from the post data."""
    # Display raw post data for confirmation
    print("\nRaw Post Data:")
    print(json.dumps(post, indent=2))

    # Ask for confirmation before processing
    confirmation = input("Does this data look good? (y/n): ").strip().lower()
    if confirmation != "y":
        print("Skipping this post...")
        return

    # Convert the HTML content to MDX
    mdx_content = convert_html_to_mdx(post["content"])

    # Prepare featured image if available
    featured_image = (
        post["featuredImage"]["node"] if post.get("featuredImage") else None
    )
    featured_image_alt = featured_image["altText"] if featured_image else ""
    featured_image_url = featured_image["sourceUrl"] if featured_image else ""
    image_path = ""

    # Download the featured image if it exists
    if featured_image_url:
        image_path = download_image(featured_image_url)

    # Create the front matter for the MDX file
    front_matter = {
        "title": post["title"],
        "date": post["date"],
        "excerpt": post["excerpt"],
        "slug": post["slug"],
        "uri": post["uri"],
        "featuredImage": (
            {"altText": featured_image_alt, "sourceUrl": image_path}
            if featured_image
            else None
        ),
    }

    # Display front matter to the console for confirmation
    print("\nFront Matter Preview:")
    print(json.dumps(front_matter, indent=2))

    # Ask for confirmation before saving the file
    confirmation = input("Do you want to save this file? (y/n): ").strip().lower()
    if confirmation != "y":
        print("Skipping this file...")
        return

    # Slugify the file name
    file_name = f"{slugify(post['slug'])}.mdx"

    # The full path for the MDX file
    file_path = os.path.join(MDX_OUTPUT_DIR, file_name)

    # MDX content with front matter
    front_matter_str = json.dumps(front_matter, indent=2)
    mdx_file_content = f"---\n{front_matter_str}\n---\n\n{mdx_content}"

    # Save the MDX file
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(mdx_file_content)
    print(f"Saved {file_name}")


def main():
    # Ensure the output directories exist
    if not os.path.exists(MDX_OUTPUT_DIR):
        os.makedirs(MDX_OUTPUT_DIR)
    if not os.path.exists(IMAGE_OUTPUT_DIR):
        os.makedirs(IMAGE_OUTPUT_DIR)

    # Fetch posts from WordPress
    posts = fetch_posts()

    # Iterate through each post and create MDX files
    for post_data in posts:
        post = post_data["node"]
        create_mdx_file(post)


if __name__ == "__main__":
    main()
