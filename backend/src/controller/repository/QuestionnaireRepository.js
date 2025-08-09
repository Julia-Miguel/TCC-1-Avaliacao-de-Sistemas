// backend/src/repository/QuestionnaireRepository.js
class QuestionnaireRepository {
  constructor(database) {
    this.collection = database.collection('questionnaires'); 
  }
  async findLastByCompanyId(companyId) {
    return this.collection.findOne(
      { company_id: companyId },
      { sort: { createdAt: -1 } }
    );
  }
}

module.exports = QuestionnaireRepository;