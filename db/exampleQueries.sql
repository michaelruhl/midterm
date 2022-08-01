-- to run this example query from vagrant:
-- psql
-- \c midterm
-- \i midterm/db/exampleQueries.sql

-- ////////////////////////////////////////////////////////////////////////////////////////////
-- The Query below should return:
--  user_id |   date_attempted    |      question      | user_guess | correct
-- ---------+---------------------+--------------------+------------+---------
--        4 | 2022-02-17 08:45:00 | 2 + 2 =            | 5          | f
--        4 | 2022-02-17 08:45:00 | 20 + 20 =          | 40         | t
--        4 | 2022-02-17 08:45:00 | 200 + 200 =        | 400        | t
--        4 | 2022-02-17 08:45:00 | 6 * 7 =            | 42         | t
--        4 | 2022-02-17 08:45:00 | Stretch: sin 90 =  | potato     | f
-- (5 rows)

-- SELECT user_id, date_attempted, question, user_guess, correct
-- FROM attempt_scores
-- JOIN questionsandanswer ON questionsandanswer_id = questionsandanswer.id
-- JOIN attempts ON attempts_id = attempts.id
-- WHERE attempts_id = 4;

-- ////////////////////////////////////////////////////////////////////////////////////////////
-- The Query below should return:
--  name  | user_id | quiz_id | number of correct answers
-- -------+---------+---------+---------------------------
--  Yaboi |       4 |       4 |                         3
-- (1 row)

SELECT name, user_id, attempts.quiz_id, COUNT(correct) as "number of correct answers"
FROM attempt_scores
JOIN questionsandanswer ON questionsandanswer_id = questionsandanswer.id
JOIN attempts ON attempts_id = attempts.id
JOIN users on user_id = users.id
WHERE attempts_id = 4
AND correct = TRUE
GROUP BY name, user_id, attempts.quiz_id;

-- ////////////////////////////////////////////////////////////////////////////////////////////