function v_abs(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}


function v_normalize(v) {
    const vabs = v_abs(v);
    return [v[0] / vabs, v[1] / vabs];
}


function v_dot_product(v1, v2) {
    return v1[0]*v2[0] + v1[1]*v2[1];
}


function v_obj_to_arr(v) {
    var r = [];
    for (const key of Object.keys(v)) {
       r.push(v[key]);
    }
    return r;
}

// Nur für 2-Dim-Vectors
function v_arr_to_obj(v) {
   return { 'x': v[0], 'y': v[1] };
}


export { v_abs, v_normalize, v_dot_product, v_obj_to_arr, v_arr_to_obj };
