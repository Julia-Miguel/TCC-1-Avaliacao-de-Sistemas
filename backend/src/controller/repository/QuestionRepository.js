// backend/src/repository/QuestionRepository.js
class QuestionRepository {
  constructor(database) {
    this.collection = database.collection('questions');
  }
  async countByQuestionnaireId(questionnaireId) {
    return this.collection.countDocuments({ questionnaire_id: questionnaireId });
  }
}

module.exports = QuestionRepository;