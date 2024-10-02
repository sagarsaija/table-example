import client from "../lib/typesense";
import pagesData from "../data/pages.json";

async function indexData() {
  const schema = {
    name: "pages",
    fields: [
      { name: "url", type: "string" },
      { name: "totalPageviewCount", type: "int32" },
    ],
  };

  try {
    await client.collections("pages").delete();
  } catch (err) {
    console.log("Collection doesn't exist, creating...");
  }

  await client.collections().create(schema);

  const pages = pagesData.map((page, id) => ({ id: id.toString(), ...page }));
  await client.collections("pages").documents().import(pages);

  console.log("Indexing complete");
}

indexData().catch(console.error);
