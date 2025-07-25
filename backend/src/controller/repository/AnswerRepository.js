// backend/src/repository/AnswerRepository.js
class AnswerRepository {
  constructor(database) {
    this.collection = database.collection('answers'); // Assumindo 'answers' como o nome da sua coleção de respostas
  }

  // Conta o número de usuários únicos que responderam a um questionário
  async countUniqueUsersByQuestionnaireId(questionnaireId) {
    // Certifique-se de que questionnaireId seja um tipo de dado compatível com seu DB (ex: ObjectId se for MongoDB)
    const result = await this.collection.aggregate([
      { $match: { questionnaire_id: questionnaireId } },
      { $group: { _id: '$user_id' } }, // Agrupa por user_id para obter IDs únicos de usuários
      { $count: 'uniqueUsers' } // Conta os grupos
    ]).toArray();

    return result.length > 0 ? result[0].uniqueUsers : 0;
  }

  // --- Adicione outros métodos do seu repositório aqui se existirem ---
  // async findById(id) { ... }
  // async create(data) { ... }
}

module.exports = AnswerRepository;