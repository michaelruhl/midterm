const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:url", (req, res) => {
    db.query(`
    SELECT name, attempts.user_id, attempts.quiz_id, COUNT(correct) as correct_answers, quizzes.title, date_attempted
FROM attempt_scores
JOIN questionsandanswer ON questionsandanswer_id = questionsandanswer.id
JOIN attempts ON attempts_id = attempts.id
JOIN users ON attempts.user_id = users.id
JOIN quizzes ON quizzes.user_id = users.id
WHERE attempts.quiz_id = (SELECT quiz_id FROM attempts WHERE url = '${req.params.url}')
AND attempts.user_id = (SELECT user_id FROM attempts WHERE url = '${req.params.url}')
AND correct = TRUE
GROUP BY name, attempts.user_id, attempts.quiz_id, quizzes.title, attempts.date_attempted;
`)
      .then(data => {
        const quizItems = data.rows[0];
        console.log(quizItems)
        res.render("quiz_score", { quizItems, user: req.session.userId, loggedInUser: req.session.userName});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:id/attempt", (req, res) => {
    console.log(req)
  });

  return router;

};
