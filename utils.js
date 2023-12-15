const questions = require('./questions.json');
const { Random } = require('random-js');

const getRandomQuestion = (topic) => {
    let questionTopic = topic.toLowerCase();
    const random = new Random();

    const randomQuestionIndex = random.integer(0, questions[questionTopic].length - 1);

    return {
        question: questions[questionTopic][randomQuestionIndex],
        questionTopic
    };
};

const getCorrectAnswer = () => {
    const question = questions[topic].find((question) => question.id === id);
    if (!question.hasOptions) {
        return question.answer;
    }
    return question.optioons.find((option) => option.isCorrect.text);
};

module.exports = { getRandomQuestion, getCorrectAnswer };
