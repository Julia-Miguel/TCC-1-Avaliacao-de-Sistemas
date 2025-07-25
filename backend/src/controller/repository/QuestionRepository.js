// backend/src/repository/QuestionRepository.js
class QuestionRepository {
  constructor(database) {
    this.collection = database.collection('questions'); // Assumindo 'questions' como o nome da sua coleção de questões
  }

  // Conta o número de questões para um dado ID de questionário
  async countByQuestionnaireId(questionnaireId) {
    // Certifique-se de que questionnaireId seja um tipo de dado compatível com seu DB (ex: ObjectId se for MongoDB)
    return this.collection.countDocuments({ questionnaire_id: questionnaireId });
  }

  // --- Adicione outros métodos do seu repositório aqui se existirem ---
  // async findById(id) { ... }
  // async create(data) { ... }
}

module.exports = QuestionRepository;