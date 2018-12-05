import { LengthAwarePaginator } from './LengthAwarePaginator';
import { Exception } from '@nsilly/exceptions';

export class ApiResponse {
  /**
   * Bind an item to a transformer and start building a response
   *
   * @param {*} Object
   * @param {*} Transformer
   *
   * @return Object
   */
  static item(obj, transformer) {
    return { data: transformer.get(obj) };
  }

  /**
   * Bind a collection to a transformer and start building a response
   *
   * @param {*} collection
   * @param {*} transformer
   *
   * @return Object
   */
  static collection(collection, transformer) {
    const data = collection.map(i => {
      return transformer.get(i);
    });
    return { data: data };
  }

  /**
   * Build response object for array
   *
   * @param {*} array
   *
   * @return Object
   */
  static array(array) {
    if (!Array.isArray(array)) {
      throw new Exception('ApiResponse.array expect an array', 2001);
    }
    return { data: array };
  }

  /**
   * Bind a paginator to a transformer and start building a response
   *
   * @param {*} LengthAwarePaginator
   * @param {*} Transformer
   *
   * @return Object
   */
  static paginate(paginator, transformer) {
    if (!(paginator instanceof LengthAwarePaginator)) {
      throw new Exception(`ApiResponse.paginate expect a LengthAwarePaginator instead a ${typeof paginator}`, 2001);
    }
    const items = paginator.getItems().map(i => {
      return transformer.get(i);
    });
    paginator.setItems(items);
    return {
      data: paginator.getItems(),
      meta: {
        pagination: {
          total: paginator.getTotal(),
          per_page: paginator.getPerPage(),
          current_page: paginator.getCurrentPage(),
          last_page: paginator.getLastPage(),
          total_pages: paginator.getTotalPages()
        }
      }
    };
  }

  /**
   * Build a sucess response
   *
   * @return Object
   */
  static success() {
    return { data: { success: true } };
  }
}
