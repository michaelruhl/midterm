const express = require("express");
const router = express.Router();

const generateRandomString = function () {
  result = [];
  for (i = 0; i < 6; i++) {
    result.push(Math.ceil(Math.random() * 6));
  }
  let randomString = `${result[0]}${result[1]}${result[2]}${result[3]}${result[4]}${result[5]}`;

  return randomString;
};

module.exports = (db) => {
  router.post("/create", (req, res) => {
    // console.log("req.body.params", req.body);
    let {
      quiz_title,
      Question_1,
      Question_2,
      Question_3,
      Question_4,
      Question_5,
      Answer_1,
      Answer_2,
      Answer_3,
      Answer_4,
      Answer_5,
      privateCheck = false,
    } = req.body;

    // console.log(privateCheck);
    const fakeUserID = 1;
    
       
    db.query(
      `INSERT INTO quizzes (user_id, title, private, url)
              values ($1, $2, $3, $4) RETURNING *`,

      [
        req.session.userId || fakeUserID,
        quiz_title,
        privateCheck,
        generateRandomString(),
      ]
    )

      .then((data) => {
        // console.log("******This is the data", data.rows);
        const quiz_id = data.rows[0].id;
        const quiz_url = data.rows[0].url;
        db.query(
          `INSERT INTO questionsAndAnswer (quiz_id, question, answer)
                    values (${quiz_id}, $1, $2), (${quiz_id}, $3, $4), (${quiz_id}, $5, $6), (${quiz_id}, $7, $8), (${quiz_id}, $9, $10)  RETURNING *`,
          [
            Question_1,
            Answer_1,
            Question_2,
            Answer_2,
            Question_3,
            Answer_3,
            Question_4,
            Answer_4,
            Question_5,
            Answer_5,
          ]
        ).then((data) => {
          res.redirect(`/api/quiz_show/${quiz_url}`);
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/", (req, res) => {
  
    res.render("createQuiz", {user: req.session.userId, loggedInUser: req.session.userName})
  })


  return router;
};
