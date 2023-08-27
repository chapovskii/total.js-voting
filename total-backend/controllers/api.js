exports.install = function () {
  CORS();

  ROUTE("POST /polls/create/ *Polls --> insert");
  ROUTE("GET /polls/list/ *Polls --> query");
  ROUTE("GET /polls/read/{id}/ *Polls --> read");
  ROUTE("POST /polls/vote/{id}/ *Polls --> vote");
};
