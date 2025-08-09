// backend/src/repository/AnswerRepository.js
class AnswerRepository {
  constructor(database) {
    this.collection = database.collection('answers');
  }

  async countUniqueUsersByQuestionnaireId(questionnaireId) {
    const result = await this.collection.aggregate([
      { $match: { questionnaire_id: questionnaireId } },
      { $group: { _id: '$user_id' } },
      { $count: 'uniqueUsers' } 
    ]).toArray();

    return result.length > 0 ? result[0].uniqueUsers : 0;
  }
}

module.exports = AnswerRepository;