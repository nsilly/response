import { LengthAwarePaginator } from './LengthAwarePaginator';
import { Exception } from '@nsilly/exceptions';

export class ApiResponse {
  static item(obj, transformer) {
    return { data: transformer.get(obj) };
  }

  static collection(collection, transformer) {
    const data = collection.map(i => {
      return transformer.get(i);
    });
    return { data: data };
  }

  static array(array) {
    if (!Array.isArray(array)) {
      throw new Exception('ApiResponse.array expect an array', 2001);
    }
    return { data: array };
  }

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

  static success() {
    return { data: { success: true } };
  }
}
