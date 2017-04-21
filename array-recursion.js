function recursion(arr = null) {
    var curr = arr;
    var prev = arr;
    (function iterator(i = 0) {
        if( i >= curr.length) {
            return;
        }
        var isArray = Array.isArray(curr[i]);
        if(!isArray) {
            console.log(curr[i]);
            iterator(++i);
        } else {
            prev = curr;
            curr = curr[i];
            iterator();
        }
    })();
    if(prev[i + ])
    iterator();
}

var myArr = [10, 12, [14, [16, 18, 20, [30, 40], 10, 12], 14, 15], 16, 17,18];

recursion(myArr);