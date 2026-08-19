// Thin generic repository. Feature repositories extend this for the common
// 80% (find/findOne/create/update/delete) and add feature-specific queries
// on top. Pagination itself is NOT reimplemented here — repositories return
// raw Mongoose queries/models, and controllers call res.paginateQuery(Model,
// {...}) directly, via express-unified-response.
export class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  findById(id, options = {}) {
    return this.model.findById(id).select(options.select).lean(options.lean ?? true);
  }

  findOne(filter, options = {}) {
    return this.model.findOne(filter).select(options.select).lean(options.lean ?? true);
  }

  find(filter = {}, options = {}) {
    return this.model
      .find(filter)
      .select(options.select)
      .sort(options.sort)
      .lean(options.lean ?? true);
  }

  create(data) {
    return this.model.create(data);
  }

  updateById(id, data, options = {}) {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true, ...options });
  }

  deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }
}
