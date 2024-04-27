export default function formStatResult(results) {
  return results.map((result) => {
    const { store_name, avg_price, std_price, max_price, min_price, total_count, prod_avg_price, prod_count } = result;
    const mapped_result = {
      store_name,
      avg_price: Math.round(avg_price * 100) / 100,
      std_price,
      max_price,
      min_price,
      total_count,
      prod_avg_price: Math.round(prod_avg_price * 100) / 100,
      prod_count,
      bucket_labels: [] as Array<string>,
      buckets: [] as Array<number>,
    };

    let bucket_start = -3;
    let bucket_end = -2;
    if (avg_price + bucket_start * std_price >= 0) {
      mapped_result.bucket_labels.push(`$0 - $${Math.round((avg_price + bucket_start * std_price) * 100) / 100}`);
      mapped_result.buckets.push(result[`(min)-(${bucket_start})`]);
    }

    for (; bucket_end <= 3; bucket_start = bucket_end++) {
      if (avg_price + bucket_end * std_price >= 0) {
        mapped_result.bucket_labels.push(
          `$${Math.max(0, Math.round((avg_price + bucket_start * std_price) * 100) / 100)} - $${
            Math.round((avg_price + bucket_end * std_price) * 100) / 100
          }`,
        );
        mapped_result.buckets.push(result[`(${bucket_start})-(${bucket_end})`]);
      }
    }
    if (avg_price + bucket_end * std_price >= 0) {
      mapped_result.bucket_labels.push(`$${Math.round((avg_price + bucket_end * std_price) * 100) / 100} -`);
      mapped_result.buckets.push(result[`(${bucket_start})-(max)`]);
    }
    return mapped_result;
  });
}
