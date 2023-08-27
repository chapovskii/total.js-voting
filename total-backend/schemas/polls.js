const pg = require("pg");

NEWSCHEMA("Polls", function (schema) {
  schema.define("question", "String(500)", true);
  schema.define("options", "JSON", true);

  const pool = new pg.Pool({
    user: "main",
    host: "dpg-cj4hicdgkuvsl0cd5bog-a.frankfurt-postgres.render.com",
    database: "easyvotes",
    password: "O48h7DzohJtNNZyAmSbgWuCPhXjfXDSf",
    port: 5432,
    ssl: true,
  });

  schema.setInsert(async function ($) {
    const model = $.model;

    const options = JSON.parse(model.options);
    await pool.query("INSERT INTO polls (question, options) VALUES ($1, $2)", [
      model.question,
      options,
    ]);

    $.success();
  });

  schema.setQuery(async function ($) {
    const result = await pool.query("SELECT id, question, options FROM polls");
    $.callback(result.rows);
  });

  schema.setRead(async function ($) {
    const params = $.params;

    const result = await pool.query(
      "SELECT id, question, options FROM polls WHERE id = $1",
      [params.id]
    );

    if (result.rows.length === 0) {
      return $.error(404);
    }

    $.callback(result.rows[0]);
  });

  schema.action("vote", async function ($) {
    const params = $.params;
    const { optionIndex, optionText } = $.body;

    await pool.query(
      "INSERT INTO results (poll_id, option, votes) VALUES ($1, $2, 1) ON CONFLICT (poll_id, option) DO UPDATE SET votes = results.votes + 1",
      [params.id, optionText]
    );
    $.success();
  });
});
