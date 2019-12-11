function get_delta(a) {
    // a is an array
    // Return the delta (absolute) of last two numbers
    let l = a.length;
    return abs(a[l - 1] - a[l - 2]);
}

function get_delta12(a) {
    // a is an array
    // Return the delta (absolute) of the last number and the number 12 index ahead
    let l = a.length;
    return abs(a[l - 1] - a[l - 13]);
}

function get_sd(a, len) {
    // Return the standard deviation of last ten numbers
    let arr = a.slice(-len,);
    let average = arr.reduce((sum, x) => x + sum, 0) / arr.length;
    let sq_total = 0; // Total of sum of (each - average)**2
    for (let sqc = 0; sqc < len; sqc++) {
        sq_total += sq(arr[sqc] - average);
    }
    return sqrt(sq_total / len - 1);
}