import typesense from "@/utils/typesenseClient";

const QUERY_FIELDS: Record<string, string> = {
  posts: "title,body",
  blogs: "title,body",
  events: "title,location",
  people: "name,email,bio",
};

// Collections that have a `tags` field
const HAS_TAGS_FIELD = ["posts", "blogs", "events"];

export async function searchAllContent(
  query: string,
  collections: string[],
  tags: string[] = []
) {
  const grouped: Record<string, string[]> = {};

  await Promise.all(
    collections.map(async (collection) => {
      try {
        const queryBy = QUERY_FIELDS[collection] || "title";

        // Only apply filter_by if the collection supports tags
        const filterBy =
          tags.length && HAS_TAGS_FIELD.includes(collection)
            ? `tags:=[${tags.map((t) => `"${t}"`).join(",")}]`
            : undefined;

        const res = await typesense
          .collections(collection)
          .documents()
          .search({
            q: query || "*", // fallback if query is empty
            query_by: queryBy,
            filter_by: filterBy,
            per_page: 5,
          });

          
        grouped[collection] = res.hits?.map((hit: any) => hit.document) || [];
      } catch (err) {
        console.error(`❌ Failed to search in '${collection}':`, err);
        grouped[collection] = [];
      }
    })
  );

  return { grouped };
}
