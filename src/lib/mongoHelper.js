
const serviceLocator = require('../config/di');

const logger = serviceLocator.get('logger');

class MongoDBHelper {
  /**
   * The constructor
   *
   * @param mongodbClient - MongoDB client
   * @param mongodbModel - the model you wish to operate on
   */
  constructor(mongodbClient, mongodbModel) {
    this.mongodbClient = mongodbClient;
    this.mongodbModel = mongodbModel;
  }

  /**
   * Fetches a single record from the connected MongoDB instance.
   *
   * @param params
   * @returns {Promise}
   */
  get(params) {
    return new Promise((resolve, reject) => {
      const param = params.query || params;
      const query = this.mongodbModel.findOne(param);

      if (params.fields) { query.select(params.fields); }

      return query.exec((err, modelData) => {
        if (err) {
          return reject(MongoDBHelper.handleError(err));
        }
        return resolve(modelData);
      });
    });
  }

  /**
     * Fetches a single record from the connected MongoDB instance.
     *
     * @param params
     * @returns {Promise}
     */
  getSorted(param) {
    return new Promise((resolve, reject) => {
      const query = this.mongodbModel.find({ $query: param, $orderby: { createdAt: -1 } });

      return query.exec((err, modelData) => {
        if (err) {
          return reject(MongoDBHelper.handleError(err));
        }
        return resolve(modelData);
      });
    });
  }

  /**
     * Fetches bulk records with pagination from the connected MongoDB instance.
     *
     * @param params
     * @returns {Promise}
     */
  getBulkPaginated(params) {
    try {
      if (params !== undefined) {
        const {
          page = 1, sort, limit = 15, query, select = '',
        } = params;

        return this.mongodbModel
          .paginate(query, {
            select: `${select}`, sort, page, limit: Number(limit),
          });
      }
      return this.mongodbModel.find();
    } catch (e) {
      return logger.info('error', e);
    }
  }

  getSkillsBulkPaginated(params) {
    try {
      if (params !== undefined) {
        const {
          page = 1, sort, limit = 15, query, select = '',
        } = params;

        return this.mongodbModel
          .paginate(query, {
            select: `${select}`,
            sort,
            page,
            limit: Number(limit),
            populate: [
              {
                path: 'freelancer',
                select: 'firstname initial location profilePic acoountVerified',
              },
            ],
          });
      }
      return this.mongodbModel.find();
    } catch (e) {
      return logger.info('error', e);
    }
  }

  getBulkPaginatedData(params) {
    try {
      if (params !== undefined) {
        const {
          page = 1, sort = {
            createdAt: -1,
          }, limit = 15, query,
          select = '',
          populate,
        } = params;

        return this.mongodbModel
          .paginate(query, {
            select: `${select}`,
            sort,
            page,
            limit: Number(limit),
            populate,
          });
      }
      return this.mongodbModel.find();
    } catch (e) {
      return logger.info('error', e);
    }
  }

  /**
     * Fetches bulk records from the connected MongoDB instance.
     *
     * @param params
     * @returns {Promise}
     */
  getBulk(params) {
    return new Promise((resolve, reject) => {
      const parameter = params;

      const query = params === undefined ? this.mongodbModel.find()
        : this.mongodbModel.find(parameter.conditions);

      if (params && parameter.fields) {
        query.select(params.fields);
      }

      if (params && parameter.sort) {
        query.sort(parameter.sort);
      }

      return query.exec((error, modelData) => {
        if (error) {
          return reject(MongoDBHelper.handleError(error));
        }
        return resolve(modelData);
      });
    });
  }

  /**
     * Saves data into the MongoDB instance
     *
     * @param data
     * @returns {Promise}
     */
  save(data) {
    return new Promise((resolve, reject) => {
      const mongodbSaveSchema = this.mongodbModel(data);
      return mongodbSaveSchema.save((error, result) => {
        if (error != null) {
          return reject(MongoDBHelper.handleError(error));
        }
        return resolve(result);
      });
    });
  }

  /**
     * Saves bulk data into the MongoDB instance
     *
     * @param data of Array
     * @returns {Promise}
     */
  saveBulk(data) {
    return new Promise((resolve, reject) => this.mongodbModel.insertMany(data, (error, result) => {
      if (error != null) {
        return reject(MongoDBHelper.handleError(error));
      }
      return resolve(result);
    }));
  }

  /**
     * Updates a SINGLE RECORD in the MongoDB instance's DB based on some conditional criteria
     *
     * @param params - the parameters
     * @returns {Promise}
     */
  search(params) {
    return new Promise((resolve, reject) => {
      const query = this.mongodbModel.find(params.q);
      const parameter = params;

      if (params && parameter.fields) {
        query.select(params.fields);
      }

      if (params && parameter.populate) {
        query.populate(parameter.populate.path, parameter.populate.field);
      }

      if (params.fields) { query.select(params.fields); }

      return query.exec((err, modelData) => {
        if (err) {
          return reject(MongoDBHelper.handleError(err));
        }
        return resolve(modelData);
      });
    });
  }

  update(params, data) {
    return new Promise((resolve, reject) => this.mongodbModel.findOneAndUpdate(
      params,
      { $set: data },
      { new: true },
      (error, response) => {
        if (error) {
          return reject(MongoDBHelper.handleError(error));
        }
        if (error == null && response == null) {
          return reject(MongoDBHelper.handleError('Record Not Found In DB'));
        }
        return resolve(response);
      },
    ));
  }

  pullOrPush(params, data) {
    return new Promise((resolve, reject) => this.mongodbModel.updateOne(
      params,
      data,
      { safe: true },
      (error, response) => {
        if (error) {
          return reject(MongoDBHelper.handleError(error));
        }
        if (error == null && response == null) {
          return reject(MongoDBHelper.handleError('Record Not Found In DB'));
        }
        return resolve(response);
      },
    ));
  }

  updateManyDoc(params, data) {
    return new Promise((resolve, reject) => this.mongodbModel.updateMany(
      params,
      data,
      (error, response) => {
        if (error) {
          return reject(MongoDBHelper.handleError(error));
        }
        if (error == null && response == null) {
          return reject(MongoDBHelper.handleError('Record Not Found In DB'));
        }
        return resolve(response);
      },
    ));
  }

  updateOrCreate(params, data) {
    return new Promise((resolve, reject) => this.mongodbModel.findOneAndUpdate(
      params,
      { $set: data },
      { upsert: true },
      (error, response) => {
        if (error) {
          return reject(MongoDBHelper.handleError(error));
        }
        return resolve(response);
      },
    ));
  }

  increment(params, data) {
    return new Promise((resolve, reject) => this.mongodbModel.findOneAndUpdate(
      params,
      { $inc: data },
      { new: true },
      (error, response) => {
        if (error) {
          return reject(MongoDBHelper.handleError(error));
        }
        if (error == null && response == null) {
          return reject(MongoDBHelper.handleError('Record Not Found In DB'));
        }
        return resolve(response);
      },
    ));
  }

  /**
     * Delete MULTIPLE RECORDS from the MongoDB instance's DB based on some conditional criteria
     *
     * @param params - the conditional parameters
     * @returns {Promise}
     */
  deleteBulk(params) {
    return new Promise((resolve, reject) => this.mongodbModel.remove(params.conditions,
      (error, response) => {
        if (error) {
          return reject(MongoDBHelper.handleError(error));
        }
        return resolve(response);
      }));
  }

  deleteOne(params) {
    return new Promise((resolve, reject) => this.mongodbModel.deleteOne(params,
      (error, response) => {
        if (error) {
          return reject(MongoDBHelper.handleError(error));
        }
        return resolve(response);
      }));
  }

  deleteManyDoc(params) {
    return new Promise((resolve, reject) => this.mongodbModel.deleteMany(params,
      (error, response) => {
        if (error) {
          return reject(MongoDBHelper.handleError(error));
        }
        return resolve(response);
      }));
  }

  /**
   * This closes the connection from this client to the running MongoDB database
   *
   * @returns {Promise}
   */
  close() {
    return new Promise((resolve, reject) => {
      this.mongodbClient.close();
      return resolve({
        error: false,
        msg: 'connection was successfully closed. Why So Curious, I am gone for a vacation!',
      });
    });
  }

  /**
   * Used to format the error messages returned from the MongoDB server during CRUD operations
   *
   * @param report
   * @returns {{error: boolean, message: *}}
   */
  static handleError(report) {
    return { error: true, msg: report };
  }
}

module.exports = MongoDBHelper;
