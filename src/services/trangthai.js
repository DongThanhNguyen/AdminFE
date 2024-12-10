async function getTrangThai(trangthai, list) {
    for(var i=0; i<list.length; i++){
        if(list[i].value == trangthai){
            return list[i].tenTrangThai
        }
    }
    return "Không xác định";
}

export{getTrangThai}