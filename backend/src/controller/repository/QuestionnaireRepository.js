// backend/src/repository/QuestionnaireRepository.js
class QuestionnaireRepository {
  constructor(database) {
    this.collection = database.collection('questionnaires'); // Assumindo 'questionnaires' como o nome da sua coleção de questionários
  }

  // Encontra o último questionário criado/atualizado para uma empresa específica
  async findLastByCompanyId(companyId) {
    // Certifique-se de que companyId seja um tipo de dado compatível com seu DB (ex: ObjectId se for MongoDB)
    return this.collection.findOne(
      { company_id: companyId },
      { sort: { createdAt: -1 } } // Assumindo que você tem um campo 'createdAt' para ordenação. Se for 'updatedAt', use 'updatedAt: -1'.
    );
  }

  // --- Adicione outros métodos do seu repositório aqui se existirem ---
  // async findById(id) { ... }
  // async create(data) { ... }
}

module.exports = QuestionnaireRepository;