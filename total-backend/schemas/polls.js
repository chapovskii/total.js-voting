const pg = require("pg");

NEWSCHEMA("Polls", function (schema) {
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
      "SELECT option_index, votes FROM results WHERE poll_id = $1",
      [params.id]
    );

    $.callback(result.rows);
  });

  schema.addWorkflow("vote", async function ($) {
    const params = $.params;
    const { options } = $.params;

    const optionIndex = parseInt(options);

    await pool.query(
      "INSERT INTO results (poll_id, option_index, votes) VALUES ($1, $2, 1) ON CONFLICT (poll_id, option_index) DO UPDATE SET votes = results.votes + 1",
      [parseInt(params.id), optionIndex]
    );
    $.success();
  });
});
