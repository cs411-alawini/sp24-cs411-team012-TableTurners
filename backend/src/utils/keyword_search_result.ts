/**
 * keyword search()
 * Reformats the database results into api format
 * @param results database 
 * @returns 
 */
export default function keywordSearch(results) {
    return results.map((result) => {
      const { store_name, name, price } = result;
      const mapped_result = {
        store_name, 
        name,
        price,
      };

      return mapped_result;
    });
  }
  