function changeLocalStorageName(oldName, newName) {
    const value = localStorage.getItem(oldName);
    if (!value) return;
    localStorage.setItem(newName, value);
    localStorage.removeItem(oldName);
}

function removeLocalStorage(name) {
    localStorage.removeItem(name);
}

// từ các phiên bản cũ thì tên trong local storage có thể khác nhau
// cũng có thể đã xoá đi local storage hoặc các thứ khác tương tự
function doUpgrade() {
    changeLocalStorageName("input-search-class", "search");
    changeLocalStorageName("term", "semester");
    removeLocalStorage("search");
    removeLocalStorage("week");
    removeLocalStorage("seleted");
    removeLocalStorage("selected");
    removeLocalStorage("classes");
    removeLocalStorage("semester");
}

export default doUpgrade;
