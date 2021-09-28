function Section(question, options, correctAnswer, isActive, selectedAnswer) {
    this.question = question;
    this.options = options;
    this.correctAnswer = correctAnswer;
    this.isActive=ko.observable(isActive);
    this.selectedAnswer = ko.observable(selectedAnswer);
    return this;
}

function QuizInfo() {

    var self = this;

    self.difficulties = ko.observableArray([null,"easy", "medium", "hard"]);

    self.categories = ko.observableArray([null,
                                            "Any category",
                                            "General Knowledge",
                                            "Books",
                                            "Films",
                                            "Music",
                                            "Musicals & Theatres",
                                            "Television",
                                            "Video Games",
                                            "Board Games",
                                            "Science & Nature",
                                            "Computers",
                                            "Mathematics",
                                            "Mythology",
                                            "Sports",
                                            "Geography",
                                            "History",
                                            "Politics",
                                            "Art",
                                            "Celebrities",
                                            "Animals"
                                        ]);

    self.selectedCategory = ko.observable(null);

    self.selectedDifficulty = ko.observable(null);

    self.viewAnswers = ko.observable(false);

    self.url = ko.observable(" ");

    self.indexOfSection = ko.observable(0);

    self.score = ko.observable(0);

    self.isQuizStarted = ko.observable(false);

    self.endOfTest = ko.observable(false);

    self.finalCaption = ko.observable(" ");

    self.countingScore = function(question) {

        if (question.selectedAnswer() == question.correctAnswer) {
            self.score(self.score()+1);
        }
    }

    self.startQuiz = function (){

        async function extractQuestion() {  
        
            self.url("https://opentdb.com/api.php?amount=10");

            if (self.categories.indexOf(self.selectedCategory()) != 1) {
                self.url(self.url() + "&category=");
                self.url(self.url() + parseInt(self.categories.indexOf(self.selectedCategory()) + 7));
            }
            
            self.url(self.url()+"&difficulty=");
            self.url(self.url() + self.selectedDifficulty());
            self.url(self.url() + "&type=multiple");

            console.log(self.url());
    
            var promise = await fetch(self.url());
    
            const array = await promise.json();
    
            const questions = array.results;
    
            console.log(questions);
    
            return questions;
    }


    extractQuestion()
    .then(function(questions) {

        questions.forEach(function insert(section, index) {
    
            rearrangeOptions(questions[index].incorrect_answers, questions[index].correct_answer)
    
            self.layoutOfSections.push(new Section(
                                        questions[index].question, 
                                        questions[index].incorrect_answers,
                                        questions[index].correct_answer,
                                        false,
                                        null));
        })
    
        self.layoutOfSections()[0].isActive(true);
    })
    .catch(function(error) {
        alert("No available questions");
        console.log(error);
    });

    self.isQuizStarted(true);
    }


    

function rearrangeOptions(incorrectAnswers, correctAnswer) {
    incorrectAnswers.push(correctAnswer);

    let correctAnswerPosition = Math.floor(Math.random() * 4);

    let tempValue = incorrectAnswers[correctAnswerPosition];
    incorrectAnswers[correctAnswerPosition] = correctAnswer;
    incorrectAnswers[3] = tempValue;
}

    self.layoutOfSections = ko.observableArray([]);

    self.showNextQuestion = function() {

        self.countingScore(self.layoutOfSections()[self.indexOfSection()]);

        self.layoutOfSections()[self.indexOfSection()].isActive(false);
        self.indexOfSection(self.indexOfSection() + 1);

        if (self.indexOfSection() == self.layoutOfSections().length) {
            self.endOfTest(true);
            self.ratePerformance(self.score());
        }
        else {
        self.layoutOfSections()[self.indexOfSection()].isActive(true);
        }
    }

    self.ratePerformance = function(score) {
        if (score == 10) {
            self.finalCaption("Excellent work! You are a smarty.");
        }
        else if (score > 6 && score < 10) {
            self.finalCaption("Good job, buddy!");
        }
        else if (score > 4 && score < 7) {
            self.finalCaption("Nice try, keep practicing!");
        }
        else if (score > 3 && score < 5) {
            self.finalCaption("Not bad!");
        }
        else if (score > 0 && score < 4) {
            self.finalCaption("Auch, why so low?");
        }
        else if (score == 0) {
            self.finalCaption("Wow, now that's a talent!");
        }
    }

    self.viewTest = function() {
        self.viewAnswers(true);

    }
}

ko.applyBindings(new QuizInfo());